import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI } from '../QuireUtils';
import { createProjectIdField, createTaskIdField } from './sharedFields';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['comment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new comment',
				action: 'Create a comment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many comments for a task',
				action: 'Get many comments',
			},
		],
		default: 'create',
	},
	// Project ID field for comment operations
	createProjectIdField(['comment']),
	// Task ID field for comment operations
	createTaskIdField(['comment'], ['create', 'getAll']),
	{
		displayName: 'Comment Text',
		name: 'comment',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
	},
	{
		displayName: "Pinned",
		name: "pinned",
		type: "boolean",
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		default: false,
		description: "Whether to pin the comment",
	},
	{
		displayName: "Post as User",
		name: "asUser",
		type: "boolean",
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create'],
			},
		},
		default: true,
		description: "Whether to post the comment by the app user",
	},
];

export async function handleCommentOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
	switch (operation) {
		case 'create': {
			// Create Comment
			const taskId = executeFunctions.getNodeParameter('taskId', itemIndex) as string;
			const description = executeFunctions.getNodeParameter('comment', itemIndex) as string;
			const pinned = executeFunctions.getNodeParameter('pinned', itemIndex, false) as boolean;
			const asUser = executeFunctions.getNodeParameter('asUser', itemIndex, true) as boolean;
			return await QuireAPI.createComment(executeFunctions, projectId, taskId, { description, pinned, asUser });
		}

		case 'getAll': {
			// Get All Comments
			const taskId = executeFunctions.getNodeParameter('taskId', itemIndex) as string;
			return await QuireAPI.getComments(executeFunctions, projectId, taskId);
		}

		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown comment operation: ${operation}`);
	}
}
