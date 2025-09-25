import { IExecuteFunctions, ILoadOptionsFunctions, IHookFunctions, IWebhookFunctions, INodePropertyOptions } from 'n8n-workflow';
import {
  QuireTask,
  QuireComment,
  QuireProject,
  QuireUser,
  QuireTag,
  QuireSublist,
  QuireTaskInput,
  QuireCommentInput,
} from './types';
import { priorityMap } from './constants';

export function toQuireDate(val: string): string {
  const date = new Date(val);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}

export function toQuireDateTime(val: string): string {
  const date = new Date(val);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    0,
    1,
  ).toISOString();
}

export function fixTaskResult(task: any): any {
  for (const key of ['editedAt', 'partner', 'due', 'start', 'toggledAt', 'toggledBy']) {
    task[key] = task[key] || null; // make keys available
  }
  task['peekaboo'] = task['peekaboo'] === true;
  return task;
}

export function fixCommentResult(comment: any): any {
  for (const key of ['editedAt', 'editedBy', 'owner', 'pinAt', 'pinBy']) {
    comment[key] = comment[key] || null; // make keys available
  }
  return comment;
}

// n8n expects an 'id' field, but tags only have 'oid'
export function fixTagIdResult(tag: any): any {
  if (!tag['id']) tag['id'] = tag['oid'];
  return tag;
}

export function toUpdateTaskData(inputData: any): any {
  const {
    name,
    description,
    assignees,
    add_assignees,
    remove_assignees,
    followers,
    add_followers,
    remove_followers,
    status,
    priority: priorityName,
    peekaboo,
    tags,
    add_tags,
    remove_tags,
    due_on,
    due_at,
    start_on,
    start_at,
    by_app,
    sourceRef,
  } = inputData;

  const priority = priorityMap[priorityName];
  const data: any = {};

  if (due_on) {
    data['due'] = toQuireDate(due_on);
  } else if (due_at) {
    data['due'] = toQuireDateTime(due_at);
  }

  if (start_on) {
    data['start'] = toQuireDate(start_on);
  } else if (start_at) {
    data['start'] = toQuireDateTime(start_at);
  }

  if (assignees) {
    data['assignees'] = assignees;
  } else {
    if (add_assignees) data['addAssignees'] = add_assignees;
    if (remove_assignees) data['removeAssignees'] = remove_assignees;
  }

  if (followers) {
    data['followers'] = followers;
  } else {
    if (add_followers) data['addFollowers'] = add_followers;
    if (remove_followers) data['removeFollowers'] = remove_followers;
  }

  if (tags) {
    data['tags'] = tags;
  } else {
    if (add_tags) data['addTags'] = add_tags;
    if (remove_tags) data['removeTags'] = remove_tags;
  }

  if (name) data['name'] = name;
  if (description) data['description'] = description;
  if (status !== undefined && status !== null) data['status'] = status ?? 0;
  if (priority !== undefined) data['priority'] = priority;

  let peekabooValue: boolean | number | null = null;
  if (peekaboo === 'true') {
    peekabooValue = true;
  } else if (peekaboo === 'false') {
    peekabooValue = false;
  } else if (peekaboo != null) {
    const numValue = parseInt(peekaboo);
    if (!isNaN(numValue)) {
      peekabooValue = numValue;
    }
  }
  if (peekabooValue != null) {
    data['peekaboo'] = peekabooValue;
  }

  data['asUser'] = by_app;

  if (sourceRef) {
    data['sourceRef'] = sourceRef;
  }

  return data;
}

// API Request Helper Interfaces
export interface ApiRequestOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	uri: string;
	headers?: Record<string, string>;
	body?: any;
	json?: boolean;
}

// ========== QUIRE API CLASS ==========
export class QuireAPI {
	private static async makeQuireApiRequest(
		context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
		body?: any,
		query?: string
	): Promise<any> {
		const baseUrl = 'https://quire.io';
		let uri = `${baseUrl}/api${path}`;
		if (query) {
			uri += `?${query}`;
		}
		
		const options: ApiRequestOptions = {
			method,
			uri,
			json: true,
		};
		
		if (body && (method === 'POST' || method === 'PUT')) {
			options.body = body;
		}
		
		// Use requestOAuth2 for automatic token refresh
		return await context.helpers.requestOAuth2.call(context, 'quireOAuth2Api', options);
	}

	// ========== TASK OPERATIONS ==========
	public static async createTask(
		context: IExecuteFunctions,
		projectId: string,
		taskData: QuireTaskInput
	): Promise<QuireTask> {
		const response = await this.makeQuireApiRequest(context, `/task/id/${projectId}`, 'POST', taskData);
		
		return fixTaskResult(response);
	}

	public static async updateTask(
		context: IExecuteFunctions,
		taskId: string,
		taskData: QuireTaskInput,
		projectId: string
	): Promise<QuireTask> {
		const response = await this.makeQuireApiRequest(context, `/task/id/${projectId}/${taskId}`, 'PUT', taskData);
		
		return fixTaskResult(response);
	}

	public static async getTask(
		context: IExecuteFunctions | IWebhookFunctions,
		taskId: string,
		projectId: string
	): Promise<QuireTask> {
		const response = await this.makeQuireApiRequest(context, `/task/id/${projectId}/${taskId}`);
		
		return fixTaskResult(response);
	}

	public static async getTaskByOid(
		context: IExecuteFunctions | IWebhookFunctions,
		taskOid: string,
	): Promise<QuireTask> {
		const response = await this.makeQuireApiRequest(context, `/task/${taskOid}`);
		
		return fixTaskResult(response);
	}

	public static async getTasks(
		context: IExecuteFunctions,
		projectId: string,
	): Promise<QuireTask[]> {
		const response = await this.makeQuireApiRequest(context, `/task/list/id/${projectId}`, 'GET');
		
		return response.map((task: any) => fixTaskResult(task));
	}

	// ========== COMMENT OPERATIONS ==========
	public static async createComment(
		context: IExecuteFunctions,
		projectId: string,
		taskId: string,
		commentData: QuireCommentInput
	): Promise<QuireComment> {
		const response = await this.makeQuireApiRequest(context, `/comment/id/${projectId}/${taskId}`, 'POST', commentData);
		
		return fixCommentResult(response);
	}

	public static async getComments(
		context: IExecuteFunctions,
		projectId: string,
		taskId: string
	): Promise<QuireComment[]> {
		const response = await this.makeQuireApiRequest(context, `/comment/list/id/${projectId}/${taskId}`);
		
		return response.map((comment: any) => fixCommentResult(comment));
	}

	// ========== PROJECT OPERATIONS ==========
	public static async getProjects(context: IExecuteFunctions): Promise<QuireProject[]>;
	public static async getProjects(context: ILoadOptionsFunctions, asLoadOptions: true): Promise<INodePropertyOptions[]>;
	public static async getProjects(context: IExecuteFunctions | ILoadOptionsFunctions, asLoadOptions?: boolean): Promise<QuireProject[] | INodePropertyOptions[]> {
		const projects = await this.makeQuireApiRequest(context, '/project/list');

		if (asLoadOptions) {
			return projects
				.map((project: QuireProject) => ({
					name: project.name,
					value: project.id,
					description: project.description || '',
				}))
				.sort((a: INodePropertyOptions, b: INodePropertyOptions) => a.name.localeCompare(b.name));
		}

		
		return projects;
	}

	public static async getProjectsForLoadOptions(
		context: ILoadOptionsFunctions
	): Promise<INodePropertyOptions[]> {
		return await this.getProjects(context, true);
	}

	// ========== USER OPERATIONS ==========
	public static async getUsers(context: IExecuteFunctions, projectId: string): Promise<QuireUser[]>;
	public static async getUsers(context: ILoadOptionsFunctions, projectId: string, asLoadOptions: true): Promise<INodePropertyOptions[]>;
	public static async getUsers(context: IExecuteFunctions | ILoadOptionsFunctions, projectId: string, asLoadOptions?: boolean): Promise<QuireUser[] | INodePropertyOptions[]> {
		const response = await this.makeQuireApiRequest(context, `/user/list/project/id/${projectId}`);
		
		const users = response;
		
		if (asLoadOptions) {
			return users
				.map((user: QuireUser) => ({
					name: `${user.name} (${user.email || user.id})`,
					value: user.id,
				}))
				.sort((a: INodePropertyOptions, b: INodePropertyOptions) => a.name.localeCompare(b.name));
		}
		
		return users;
	}

	public static async getUsersForLoadOptions(
		context: ILoadOptionsFunctions,
		projectId: string
	): Promise<INodePropertyOptions[]> {
		return await this.getUsers(context, projectId, true);
	}

	// ========== TAG OPERATIONS ==========
	public static async getTags(context: IExecuteFunctions, projectId: string): Promise<QuireTag[]>;
	public static async getTags(context: ILoadOptionsFunctions, projectId: string, asLoadOptions: true): Promise<INodePropertyOptions[]>;
	public static async getTags(context: IExecuteFunctions | ILoadOptionsFunctions, projectId: string, asLoadOptions?: boolean): Promise<QuireTag[] | INodePropertyOptions[]> {
		const response = await this.makeQuireApiRequest(context, `/tag/list/id/${projectId}`);
		
		const tags = response.map((tag: any) => fixTagIdResult(tag));
		
		if (asLoadOptions) {
			return tags
				.map((tag: QuireTag) => ({
					name: tag.name,
					value: tag.id,
				}))
				.sort((a: INodePropertyOptions, b: INodePropertyOptions) => a.name.localeCompare(b.name));
		}
		
		return tags;
	}

	public static async getTagsForLoadOptions(
		context: ILoadOptionsFunctions,
		projectId: string
	): Promise<INodePropertyOptions[]> {
		return await this.getTags(context, projectId, true);
	}

	// ========== WEBHOOK OPERATIONS ==========
	public static async updateProjectFollower(
		context: IHookFunctions,
		projectId: string,
		webhookPath: string,
		action: 'add' | 'remove'
	): Promise<void> {
		const body = action === 'add' 
			? { addFollowers: [`app|${webhookPath}`] }
			: { removeFollowers: [`app|${webhookPath}`] };
		
		await this.makeQuireApiRequest(context, `/project/id/${projectId}`, 'PUT', body);
	}

	// ========== STATUS OPERATIONS ==========
	public static async getStatusListForLoadOptions(
		context: ILoadOptionsFunctions,
		projectId: string
	): Promise<INodePropertyOptions[]> {
		const response = await this.makeQuireApiRequest(context, `/status/list/id/${projectId}`);
		
		const statusOptions = response
			.map((status: any) => ({
				name: status.name,
				value: status.value,
			}))
			.sort((a: INodePropertyOptions, b: INodePropertyOptions) => {
				// Sort by value (smallest first), then by name
				if (a.value !== b.value) {
					return Number(a.value) - Number(b.value);
				}
				return a.name.localeCompare(b.name);
			});

		return [
			{
				name: 'Default',
				value: 0,
			},
			...statusOptions,
		];
	}

	// ========== LOAD OPTIONS HELPER METHODS ==========
	public static async getTasksForLoadOptions(context: ILoadOptionsFunctions,
		projectId: string
	): Promise<INodePropertyOptions[]> {
		try {
			const tasks = await this.getTasks(context as any, projectId);
			return tasks.map((task: QuireTask) => ({
				name: task.name,
				value: task.id,
			}));
		} catch (error) {
			return [];
		}
	}

	public static async getSublistsForLoadOptions(
		context: ILoadOptionsFunctions,
		projectId: string
	): Promise<INodePropertyOptions[]> {
		try {
			const sublists = await this.getSublists(context as any, projectId);
			return sublists.map((sublist: QuireSublist) => ({
				name: sublist.name,
				value: sublist.id,
			}));
		} catch (error) {
			return [];
		}
	}

	public static async getSublists(
		context: IExecuteFunctions,
		projectId: string
	): Promise<QuireSublist[]> {
		const sublists = await this.makeQuireApiRequest(context, `/sublist/list/id/project/${projectId}`);
		return sublists;
	}

	public static async getPartners(
		context: IExecuteFunctions,
		projectId: string
	): Promise<QuireUser[]> {
		const partners = await this.makeQuireApiRequest(context, `/partner/list/id/${projectId}`);
		return partners;
	}

	public static async findTaskInProject(
		context: IExecuteFunctions,
		projectId: string,
		query: string
	): Promise<QuireTask[]> {
		try {
			const tasks = await this.makeQuireApiRequest(context, `/task/search/id/${projectId}`, 'GET', undefined, `text=${encodeURIComponent(query)}`);
			return tasks.map((task: any) => fixTaskResult(task));
		} catch (error) {
			return [];
		}
	}

	public static async findUser(
		context: IExecuteFunctions,
		emailOrId: string
	): Promise<QuireUser | null> {
		try {
			return await this.makeQuireApiRequest(context, `/user/id/${emailOrId}`);
		} catch (error) {
			return null;
		}
	}
}
