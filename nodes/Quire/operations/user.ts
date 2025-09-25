import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI } from '../QuireUtils';
import { QuireUser } from '../types';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many accessible users',
				action: 'Get many users',
			},
		],
		default: 'getAll',
	},
];

export async function handleUserOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
): Promise<any> {
	switch (operation) {
		case 'getAll': {
			// Get All Users
			const projects = await QuireAPI.getProjects(executeFunctions);
			const allUsers: QuireUser[] = [];
			const userIds = new Set<string>();
			for (const project of projects) {
				try {
					const users = await QuireAPI.getUsers(executeFunctions, project.id);
					for (const user of users) {
						if (!userIds.has(user.id)) {
							userIds.add(user.id);
							allUsers.push(user);
						}
					}
				} catch (error) {
					continue;
				}
			}
			return allUsers;
		}
		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown user operation: ${operation}`);
	}
}
