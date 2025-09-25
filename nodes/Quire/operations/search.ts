import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI } from '../QuireUtils';
import { createProjectIdField } from './sharedFields';

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['search'],
			},
		},
		options: [
			{
				name: 'Find Task in Project',
				value: 'findTaskInProject',
				description: 'Find tasks in a project',
				action: 'Find task in project',
			},
			{
				name: 'Find User',
				value: 'findUser',
				description: 'Find a user by email or ID',
				action: 'Find user',
			},
		],
		default: 'findTaskInProject',
	},
	// Search Project Fields
	createProjectIdField(['search'], ['findTaskInProject']),
	// Search Fields
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['findTaskInProject'],
			},
		},
		default: '',
		required: true,
		description: 'Search query for tasks in the project',
	},
	{
		displayName: 'User Email or ID',
		name: 'userEmailOrId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['findUser'],
			},
		},
		default: '',
		required: true,
		description: 'Email address or ID of the user to search for',
	},
];

export async function handleSearchOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	switch (operation) {
		case 'findTaskInProject': {
			// Find Task in Project
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			const query = executeFunctions.getNodeParameter('searchQuery', itemIndex) as string;
			return await QuireAPI.findTaskInProject(executeFunctions, projectId, query);
		}
		case 'findUser': {
			// Find User by Email or ID
			const userEmailOrId = executeFunctions.getNodeParameter('userEmailOrId', itemIndex) as string;
			return await QuireAPI.findUser(executeFunctions, userEmailOrId);
		}
		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown search operation: ${operation}`);
	}
}
