import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IWebhookFunctions,
	IWebhookResponseData,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IHookFunctions,
	NodeOperationError,
} from 'n8n-workflow';

import { QuireAPI } from './QuireUtils';
import {
	getTaskEventName,
	getTaskEventOptions,
	getSubtitleExpression,
} from './constants';

export class QuireTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Quire Trigger',
		name: 'quireTrigger',
		icon: 'file:quire_logo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: getSubtitleExpression(),
		description: 'Triggers when specified events occur in a Quire project',
		defaults: {
			name: 'Quire Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'quireOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Project Name or ID',
				name: 'projectId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				default: '',
				required: true,
				description: 'The project to monitor. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Events to Monitor',
				name: 'events',
				type: 'multiOptions',
				options: getTaskEventOptions(),
				default: [0],
				required: true,
				description: 'Select which task events to monitor. Only task-related events are supported.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {				try {
					return await QuireAPI.getProjectsForLoadOptions(this);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to load projects: ${error.message}`);
				}
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// We don't need to check for webhook existence as Quire manages the followers
				// and we can safely add/remove without checking
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const projectId = this.getNodeParameter('projectId') as string;

				if (!webhookUrl || !projectId) {
					throw new NodeOperationError(this.getNode(), 'Missing webhook URL or project ID');
				}
				
				// Extract path from full URL
				const webhookPath = new URL(webhookUrl).pathname;
				
				try {
					await QuireAPI.updateProjectFollower(this, projectId, webhookPath, 'add');
					return true;
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to setup webhook: ${error.message}`);
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const projectId = this.getNodeParameter('projectId') as string;

				if (!webhookUrl || !projectId) {
					throw new NodeOperationError(this.getNode(), 'Missing webhook URL or project ID');
				}

				// Extract path from full URL
				const webhookPath = new URL(webhookUrl).pathname;

				try {
					await QuireAPI.updateProjectFollower(this, projectId, webhookPath, 'remove');
					return true;
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to delete webhook: ${error.message}`);
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const events = this.getNodeParameter('events') as number[];

		// Validate notification structure
		if (bodyData.type !== 'notification' || !bodyData.data || typeof bodyData.data !== 'object') {
			return {
				workflowData: [[]],
			};
		}

		const notificationData = bodyData.data as IDataObject;
		const eventType = notificationData.type as number;

		// Check if this event type should be processed
		if (!events.includes(eventType)) {
			// Event type not selected by user - filter it out by returning empty data
			return {
				workflowData: [[]],
			};
		}

		const projectId = this.getNodeParameter('projectId') as string;

		// Create base event data from notification
		const baseEventData = {
			eventType: eventType,
			eventName: getTaskEventName(eventType),
			projectId: projectId, // Include the selected project ID
			when: notificationData.when,
			what: notificationData.what,
			user: notificationData.user,
			message: notificationData.message,
			text: notificationData.text,
			url: notificationData.url,
			token: bodyData.token,
			secret: bodyData.secret,
		};

		return {
			workflowData: [
				this.helpers.returnJsonArray([baseEventData]),
			],
		}
	}
}
