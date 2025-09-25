import { INodeProperties } from 'n8n-workflow';

/**
 * Creates a project ID field for the specified resource(s)
 * @param resources - Array of resource names that this field applies to
 * @param operations - Optional array of specific operations. If not provided, applies to all operations for the resource
 * @returns INodeProperties object for project selection
 */
export function createProjectIdField(resources: string[], operations?: string[]): INodeProperties {
	const displayOptions: any = {
		show: {
			resource: resources,
		},
	};
	
	if (operations && operations.length > 0) {
		displayOptions.show.operation = operations;
	}
	
	return {
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getProjects',
		},
		displayOptions,
		default: '',
		required: true,
	};
}

/**
 * Creates a task ID field for the specified resource(s) and operation(s)
 * @param resources - Array of resource names that this field applies to
 * @param operations - Array of operations that this field applies to
 * @returns INodeProperties object for task selection
 */
export function createTaskIdField(resources: string[], operations: string[]): INodeProperties {
	return {
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getTasks',
			loadOptionsDependsOn: ['projectId'],
		},
		displayOptions: {
			show: {
				resource: resources,
				operation: operations,
			},
		},
		default: '',
		required: true,
	};
}