import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI } from '../QuireUtils';
import { createProjectIdField } from './sharedFields';

export const tagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tag'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tags in a project',
				action: 'Get many tags',
			},
		],
		default: 'getAll',
	},
	// Project ID field for tag operations
	createProjectIdField(['tag']),
];

export async function handleTagOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	switch (operation) {
		case 'getAll': {
			// Get All Tags
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			return await QuireAPI.getTags(executeFunctions, projectId);
		}
		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown tag operation: ${operation}`);
	}
}
