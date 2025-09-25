import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeOperationError,
} from 'n8n-workflow';

import {
	QuireAPI,
} from './QuireUtils';

import { handleTaskOperations } from './operations/task';
import { handleCommentOperations } from './operations/comment';
import { handleProjectOperations } from './operations/project';
import { handleUserOperations } from './operations/user';
import { handleTagOperations } from './operations/tag';
import { handleSublistOperations } from './operations/sublist';
import { handlePartnerOperations } from './operations/partner';
import { handleSearchOperations } from './operations/search';

export class QuireOperationHandlers {
	// Common parameter getters
	static getTaskId(executeFunctions: IExecuteFunctions, itemIndex: number): string {
		return executeFunctions.getNodeParameter('taskId', itemIndex) as string;
	}

	static getProjectId(executeFunctions: IExecuteFunctions, itemIndex: number): string {
		return executeFunctions.getNodeParameter('projectId', itemIndex) as string;
	}

	// Resource handlers
	static handleTaskOperations = handleTaskOperations;
	static handleCommentOperations = handleCommentOperations;
	static handleProjectOperations = handleProjectOperations;
	static handleUserOperations = handleUserOperations;
	static handleTagOperations = handleTagOperations;
	static handleSublistOperations = handleSublistOperations;
	static handlePartnerOperations = handlePartnerOperations;
	static handleSearchOperations = handleSearchOperations;
}

// Load options methods
export class QuireLoadOptionsMethods {
	static async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		try {
			return await QuireAPI.getProjectsForLoadOptions(this);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to load projects: ${error.message}`);
		}
	}

	static async getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const projectId = this.getCurrentNodeParameter('projectId') as string;
		if (!projectId) {
			return [];
		}

		try {
			return await QuireAPI.getTasksForLoadOptions(this, projectId);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to load tasks: ${error.message}`);
		}
	}

	static async getSublists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const projectId = this.getCurrentNodeParameter('projectId') as string;
		if (!projectId) {
			return [];
		}

		try {
			return await QuireAPI.getSublistsForLoadOptions(this, projectId);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to load sublists: ${error.message}`);
		}
	}

	static async getAssignees(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const projectId = this.getCurrentNodeParameter('projectId') as string;
		if (!projectId) {
			return [];
		}

		try {
			return await QuireAPI.getUsersForLoadOptions(this, projectId);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to load assignees: ${error.message}`);
		}
	}

	static async getTaskTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const projectId = this.getCurrentNodeParameter('projectId') as string;
		if (!projectId) {
			return [];
		}

		try {
			return await QuireAPI.getTagsForLoadOptions(this, projectId);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to load tags: ${error.message}`);
		}
	}

	static async getTaskStatus(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
		const projectId = this.getCurrentNodeParameter('projectId') as string;
		if (!projectId) {
			return [];
		}

		try {
			return await QuireAPI.getStatusListForLoadOptions(this, projectId);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to load task status: ${error.message}`);
		}
	}
}
