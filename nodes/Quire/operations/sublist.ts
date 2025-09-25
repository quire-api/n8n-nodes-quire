import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI } from '../QuireUtils';
import { createProjectIdField } from './sharedFields';

export const sublistOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sublist'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sublists in a project',
				action: 'Get many sublists',
			},
		],
		default: 'getAll',
	},
	// Project ID field for sublist operations
	createProjectIdField(['sublist']),
];

export async function handleSublistOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	switch (operation) {
		case 'getAll': {
			// Get All Sublists
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			return await QuireAPI.getSublists(executeFunctions, projectId);
		}
		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown sublist operation: ${operation}`);
	}
}
