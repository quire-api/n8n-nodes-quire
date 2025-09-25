import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI } from '../QuireUtils';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many accessible projects',
				action: 'Get many projects',
			},
		],
		default: 'getAll',
	},


];

export async function handleProjectOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	switch (operation) {
		case 'getAll': {
			// Get All Projects
			return await QuireAPI.getProjects(executeFunctions);
		}

		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown project operation: ${operation}`);
	}
}
