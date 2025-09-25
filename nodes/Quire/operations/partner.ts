import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI } from '../QuireUtils';
import { createProjectIdField } from './sharedFields';

export const partnerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['partner'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many partners in an organization',
				action: 'Get many partners',
			},
		],
		default: 'getAll',
	},
	// Project ID field for partner operations
	createProjectIdField(['partner']),
];

export async function handlePartnerOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	switch (operation) {
		case 'getAll': {
			// Get All Partners
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			return await QuireAPI.getPartners(executeFunctions, projectId);
		}
		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown partner operation: ${operation}`);
	}
}
