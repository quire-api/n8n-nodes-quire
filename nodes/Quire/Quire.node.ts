import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { taskOperations } from './operations/task';
import { projectOperations } from './operations/project';
import { userOperations } from './operations/user';
import { commentOperations } from './operations/comment';
import { tagOperations } from './operations/tag';
import { sublistOperations } from './operations/sublist';
import { partnerOperations } from './operations/partner';
import { searchOperations } from './operations/search';
import { QuireOperation, QuireResource } from './types';
import { QuireOperationHandlers, QuireLoadOptionsMethods } from './QuireOperationHandlers';

const operationHandlers = {
	"task": QuireOperationHandlers.handleTaskOperations,
	"comment": QuireOperationHandlers.handleCommentOperations,
	"project": QuireOperationHandlers.handleProjectOperations,
	"user": QuireOperationHandlers.handleUserOperations,
	"tag": QuireOperationHandlers.handleTagOperations,
	"sublist": QuireOperationHandlers.handleSublistOperations,
	"partner": QuireOperationHandlers.handlePartnerOperations,
	"search": QuireOperationHandlers.handleSearchOperations,
};

export class Quire implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Quire',
		name: 'quire',
		icon: 'file:quire_logo.svg',
		group: ['productivity'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Perform actions on Quire project management platform',
		defaults: {
			name: 'Quire',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'quireOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Comment', value: 'comment' },
					{ name: 'Partner', value: 'partner' },
					{ name: 'Project', value: 'project' },
					{ name: 'Search', value: 'search' },
					{ name: 'Sublist', value: 'sublist' },
					{ name: 'Tag', value: 'tag' },
					{ name: 'Task', value: 'task' },
					{ name: 'User', value: 'user' },
				],
				default: 'task',
			},
			...taskOperations,
			...userOperations,
			...commentOperations,
			...tagOperations,
			...sublistOperations,
			...partnerOperations,
			...searchOperations,
			...projectOperations,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as QuireResource;
		const operation = this.getNodeParameter('operation', 0) as QuireOperation;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				const handler = operationHandlers[resource];
				if (!handler) {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				responseData = await handler(this, operation, i);

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((data) => ({
						json: data,
						pairedItem: { item: i },
					})));
				} else if (responseData !== null && responseData !== undefined) {
					returnData.push({
						json: responseData,
						pairedItem: { item: i },
					});
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	methods = {
		loadOptions: {
			getProjects: QuireLoadOptionsMethods.getProjects,
			getTasks: QuireLoadOptionsMethods.getTasks,
			getSublists: QuireLoadOptionsMethods.getSublists,
			getAssignees: QuireLoadOptionsMethods.getAssignees,
			getTaskTags: QuireLoadOptionsMethods.getTaskTags,
			getTaskStatus: QuireLoadOptionsMethods.getTaskStatus,
		},
	};
}
