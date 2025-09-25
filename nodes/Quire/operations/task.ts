import { INodeProperties, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { QuireAPI, toUpdateTaskData } from '../QuireUtils';
import { createProjectIdField, createTaskIdField } from './sharedFields';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new task',
				action: 'Create a task',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a task by ID',
				action: 'Get a task',
			},
			{
				name: 'Get by OID',
				value: 'getByOid',
				description: 'Get a task by OID',
				action: 'Get task by OID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tasks in a project',
				action: 'Get many tasks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing task',
				action: 'Update a task',
			},
		],
		default: 'create',
	},
	createProjectIdField(['task']),
	createTaskIdField(['task'], ['update', 'get']),
	{
		displayName: 'Task OID',
		name: 'taskOid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getByOid'],
			},
		},
		default: '',
		required: true,
		description: 'The OID of the task to retrieve',
	},
	{
		displayName: 'Task Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the task',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'The description of the task',
	},
	{
		displayName: 'Assignee Names or Emails',
		name: 'assignees',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAssignees',
			loadOptionsDependsOn: ['projectId'],
		},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: [],
		description: 'Select users to assign to this task. Choose from the list, or specify emails using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Status Value',
		name: 'status',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: 0,
		description: 'The numeric value of the task status'
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'options',
		options: [
			{ name: 'Low', value: 'Low' },
			{ name: 'Medium', value: 'Medium' },
			{ name: 'High', value: 'High' },
			{ name: 'Urgent', value: 'Urgent' },
		],
		
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: 'Medium',
		description: 'The priority of the task',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'The start date of the task',
	},
	{
		displayName: 'Due Date',
		name: 'dueDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'The due date of the task',
	},
	{
		displayName: 'Tag Names or IDs',
		name: 'tags',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTaskTags',
			loadOptionsDependsOn: ['projectId'],
		},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: [],
		description: 'Select tags to assign to this task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Sublist Names or IDs',
		name: 'sublists',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getSublists',
			loadOptionsDependsOn: ['projectId'],
		},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		default: [],
		description: 'Select sublists to add this task to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'By App',
		name: 'byApp',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: true,
		description: 'Whether to mark this task as created by the app',
	},
	{
		displayName: 'Include Source Reference',
		name: 'includeSourceRef',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
			},
		},
		default: false,
		description: 'Whether to include source reference data for this task',
	},
	{
		displayName: 'Source Reference',
		name: 'sourceRefJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create', 'update'],
				includeSourceRef: [true],
			},
		},
		default: '',
		description: 'A JSON object with string keys and string values for source reference',
	},
];

export async function handleTaskOperations(
	executeFunctions: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	switch (operation) {
		case 'create': {
			// Create Task
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			const name = executeFunctions.getNodeParameter('name', itemIndex) as string;
			const description = executeFunctions.getNodeParameter('description', itemIndex, '') as string;
			const assignees = executeFunctions.getNodeParameter('assignees', itemIndex, []) as string[];
			const status = executeFunctions.getNodeParameter('status', itemIndex, 0) as number | null;
			const priority = executeFunctions.getNodeParameter('priority', itemIndex, 'Medium') as string;
			const dueDate = executeFunctions.getNodeParameter('dueDate', itemIndex, '') as string;
			const startDate = executeFunctions.getNodeParameter('startDate', itemIndex, '') as string;
			const tags = executeFunctions.getNodeParameter('tags', itemIndex, []) as string[];
			const byApp = executeFunctions.getNodeParameter('byApp', itemIndex, true) as boolean;
			const includeSourceRef = executeFunctions.getNodeParameter('includeSourceRef', itemIndex, false) as boolean;
			
			const taskData: any = {
				name,
				description,
				assignees,
				status,
				priority,
				tags,
				by_app: byApp,
			};

			if (dueDate) {
				taskData.due_on = dueDate;
			}

			if (startDate) {
				taskData.start_on = startDate;
			}

			if (includeSourceRef) {
				const sourceRefJson = executeFunctions.getNodeParameter('sourceRefJson', itemIndex, '') as string;
				if (sourceRefJson) {
					try {
						taskData.sourceRef = JSON.parse(sourceRefJson);
					} catch (error) {
						throw new NodeOperationError(executeFunctions.getNode(), 'Invalid JSON in Source Reference field');
					}
				}
			}

			const processedTaskData = toUpdateTaskData(taskData);
			return await QuireAPI.createTask(executeFunctions, projectId, processedTaskData);
		}

		case 'get': {
			// Get Task
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			const taskId = executeFunctions.getNodeParameter('taskId', itemIndex) as string;
			return await QuireAPI.getTask(executeFunctions, taskId, projectId);
		}

		case 'getByOid': {
			// Get Task by OID
			const taskOid = executeFunctions.getNodeParameter('taskOid', itemIndex) as string;
			return await QuireAPI.getTaskByOid(executeFunctions, taskOid);
		}

		case 'getAll': {
			// Get All Tasks
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			return await QuireAPI.getTasks(executeFunctions, projectId);
		}

		case 'update': {
			// Update Task
			const projectId = executeFunctions.getNodeParameter('projectId', itemIndex) as string;
			const taskId = executeFunctions.getNodeParameter('taskId', itemIndex) as string;
			
			const updateData: any = {};
			
			// Get all possible update fields
			const name = executeFunctions.getNodeParameter('name', itemIndex, '') as string;
			const description = executeFunctions.getNodeParameter('description', itemIndex, '') as string;
			const assignees = executeFunctions.getNodeParameter('assignees', itemIndex, []) as string[];
			const status = executeFunctions.getNodeParameter('status', itemIndex, 0) as number | null;
			const priority = executeFunctions.getNodeParameter('priority', itemIndex, '') as string;
			const dueDate = executeFunctions.getNodeParameter('dueDate', itemIndex, '') as string;
			const startDate = executeFunctions.getNodeParameter('startDate', itemIndex, '') as string;
			const tags = executeFunctions.getNodeParameter('tags', itemIndex, []) as string[];
			const byApp = executeFunctions.getNodeParameter('byApp', itemIndex, true) as boolean;
			const includeSourceRef = executeFunctions.getNodeParameter('includeSourceRef', itemIndex, false) as boolean;

			if (name) updateData.name = name;
			if (description) updateData.description = description;
			if (assignees.length > 0) updateData.assignees = assignees;
			if (status !== null && status !== undefined) updateData.status = status;
			if (priority) updateData.priority = priority;
			if (tags.length > 0) updateData.tags = tags;
			updateData.by_app = byApp;

			if (dueDate) {
				updateData.due_on = dueDate;
			}

			if (startDate) {
				updateData.start_on = startDate;
			}

			if (includeSourceRef) {
				const sourceRefJson = executeFunctions.getNodeParameter('sourceRefJson', itemIndex, '') as string;
				if (sourceRefJson) {
					try {
						updateData.sourceRef = JSON.parse(sourceRefJson);
					} catch (error) {
						throw new NodeOperationError(executeFunctions.getNode(), 'Invalid JSON in Source Reference field');
					}
				}
			}

			const processedUpdateData = toUpdateTaskData(updateData);
			return await QuireAPI.updateTask(executeFunctions, taskId, processedUpdateData, projectId);
		}

		default:
			throw new NodeOperationError(executeFunctions.getNode(), `Unknown task operation: ${operation}`);
	}
}
