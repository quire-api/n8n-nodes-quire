// Quire task event constants and related utilities

export const priorityMap: { [key: string]: number } = {
  'Urgent': 2,
  'High': 1,
  'Medium': 0,
  'Low': -1,
} as const;

export const TASK_EVENT_TYPES = {
	ADD_TASK: 0,
	REMOVE_TASK: 1,
	EDIT_TASK: 3,
	COMPLETE_TASK: 5,
	REOPEN_TASK: 6,
	ASSIGN_MEMBER: 7,
	UNASSIGN_MEMBER: 8,
	SET_DUE_DATE: 9,
	CLEAR_DUE_DATE: 10,
	CHANGE_STATUS: 11,
	PEEKABOO_TASK: 12,
	RESHOW_TASK: 13,
	SET_CUSTOM_FIELD: 14,
	REMOVE_CUSTOM_FIELD: 15,
	ADD_COMMENT: 16,
	UNDO_COMPLETE: 17,
	UNDO_REMOVAL: 18,
	UNDO_PEEKABOO: 19,
	ADD_ATTACHMENT: 20,
	REMOVE_ATTACHMENT: 21,
	SET_EXTERNAL_TEAM: 24,
	REMOVE_EXTERNAL_TEAM: 25,
	UNDO_REMOVE_COMMENT: 26,
	REMOVE_COMMENT: 27,
	ADD_TAG: 28,
	REMOVE_TAG: 29,
	TRANSFER_TASK: 30,
	DUPLICATE_TASK: 31,
	MENTION_MEMBER: 32,
	DUPLICATE_RECURRING: 33,
	EDIT_TIME_TRACK: 34,
	SET_PRIORITY: 35,
	CHANGE_TASK_TYPE: 36,
	EDIT_COMMENT: 37,
	SET_START_DATE: 38,
	CLEAR_START_DATE: 39,
} as const;

export const TASK_EVENT_INFO: { [key: number]: { name: string; description: string } } = {
	[TASK_EVENT_TYPES.ADD_TASK]: {
		name: 'Task Added',
		description: 'Triggers when a new task is added',
	},
	[TASK_EVENT_TYPES.REMOVE_TASK]: {
		name: 'Task Removed',
		description: 'Triggers when a task is removed',
	},
	[TASK_EVENT_TYPES.EDIT_TASK]: {
		name: 'Task Edited',
		description: 'Triggers when a task content is edited',
	},
	[TASK_EVENT_TYPES.COMPLETE_TASK]: {
		name: 'Task Completed',
		description: 'Triggers when a task is completed',
	},
	[TASK_EVENT_TYPES.REOPEN_TASK]: {
		name: 'Task Reopened',
		description: 'Triggers when a task is reopened',
	},
	[TASK_EVENT_TYPES.ASSIGN_MEMBER]: {
		name: 'Member Assigned',
		description: 'Triggers when a member is assigned to a task',
	},
	[TASK_EVENT_TYPES.UNASSIGN_MEMBER]: {
		name: 'Member Unassigned',
		description: 'Triggers when a member is unassigned from a task',
	},
	[TASK_EVENT_TYPES.SET_DUE_DATE]: {
		name: 'Due Date Set',
		description: 'Triggers when a due date is set for a task',
	},
	[TASK_EVENT_TYPES.CLEAR_DUE_DATE]: {
		name: 'Due Date Cleared',
		description: 'Triggers when a due date is cleared from a task',
	},
	[TASK_EVENT_TYPES.CHANGE_STATUS]: {
		name: 'Status Changed',
		description: 'Triggers when a task status is changed',
	},
	[TASK_EVENT_TYPES.PEEKABOO_TASK]: {
		name: 'Task Peekabooed',
		description: 'Triggers when a task is peekabooed (hidden)',
	},
	[TASK_EVENT_TYPES.RESHOW_TASK]: {
		name: 'Task Reshowed',
		description: 'Triggers when a task is reshowed (unhidden)',
	},
	[TASK_EVENT_TYPES.SET_CUSTOM_FIELD]: {
		name: 'Custom Field Set',
		description: 'Triggers when a custom field value is set',
	},
	[TASK_EVENT_TYPES.REMOVE_CUSTOM_FIELD]: {
		name: 'Custom Field Removed',
		description: 'Triggers when a custom field value is removed',
	},
	[TASK_EVENT_TYPES.ADD_COMMENT]: {
		name: 'Comment Added',
		description: 'Triggers when a comment is added to a task',
	},
	[TASK_EVENT_TYPES.UNDO_COMPLETE]: {
		name: 'Undo Complete',
		description: 'Triggers when task completion is undone',
	},
	[TASK_EVENT_TYPES.UNDO_REMOVAL]: {
		name: 'Undo Removal',
		description: 'Triggers when task removal is undone',
	},
	[TASK_EVENT_TYPES.UNDO_PEEKABOO]: {
		name: 'Undo Peekaboo',
		description: 'Triggers when task peekaboo is undone',
	},
	[TASK_EVENT_TYPES.ADD_ATTACHMENT]: {
		name: 'Attachment Added',
		description: 'Triggers when an attachment is added to a task',
	},
	[TASK_EVENT_TYPES.REMOVE_ATTACHMENT]: {
		name: 'Attachment Removed',
		description: 'Triggers when an attachment is removed from a task',
	},
	[TASK_EVENT_TYPES.SET_EXTERNAL_TEAM]: {
		name: 'External Team Set',
		description: 'Triggers when an external team is set for a task',
	},
	[TASK_EVENT_TYPES.REMOVE_EXTERNAL_TEAM]: {
		name: 'External Team Removed',
		description: 'Triggers when an external team is removed from a task',
	},
	[TASK_EVENT_TYPES.UNDO_REMOVE_COMMENT]: {
		name: 'Undo Remove Comment',
		description: 'Triggers when comment removal is undone',
	},
	[TASK_EVENT_TYPES.REMOVE_COMMENT]: {
		name: 'Comment Removed',
		description: 'Triggers when a comment is removed from a task',
	},
	[TASK_EVENT_TYPES.ADD_TAG]: {
		name: 'Tag Added',
		description: 'Triggers when a tag is added to a task',
	},
	[TASK_EVENT_TYPES.REMOVE_TAG]: {
		name: 'Tag Removed',
		description: 'Triggers when a tag is removed from a task',
	},
	[TASK_EVENT_TYPES.TRANSFER_TASK]: {
		name: 'Task Transferred',
		description: 'Triggers when a task is transferred to another project',
	},
	[TASK_EVENT_TYPES.DUPLICATE_TASK]: {
		name: 'Task Duplicated',
		description: 'Triggers when a task is duplicated',
	},
	[TASK_EVENT_TYPES.MENTION_MEMBER]: {
		name: 'Member Mentioned',
		description: 'Triggers when a member is mentioned in a comment or description',
	},
	[TASK_EVENT_TYPES.DUPLICATE_RECURRING]: {
		name: 'Recurring Task Duplicated',
		description: 'Triggers when a recurring task is automatically duplicated',
	},
	[TASK_EVENT_TYPES.EDIT_TIME_TRACK]: {
		name: 'Time Track Edited',
		description: 'Triggers when time tracking is edited',
	},
	[TASK_EVENT_TYPES.SET_PRIORITY]: {
		name: 'Priority Set',
		description: 'Triggers when task priority is set',
	},
	[TASK_EVENT_TYPES.CHANGE_TASK_TYPE]: {
		name: 'Task Type Changed',
		description: 'Triggers when task type is changed',
	},
	[TASK_EVENT_TYPES.EDIT_COMMENT]: {
		name: 'Comment Edited',
		description: 'Triggers when a comment is edited',
	},
	[TASK_EVENT_TYPES.SET_START_DATE]: {
		name: 'Start Date Set',
		description: 'Triggers when a start date is set for a task',
	},
	[TASK_EVENT_TYPES.CLEAR_START_DATE]: {
		name: 'Start Date Cleared',
		description: 'Triggers when a start date is cleared from a task',
	},
};

export function getTaskEventName(eventType: number): string {
	return TASK_EVENT_INFO[eventType]?.name || `Unknown Event (${eventType})`;
}

export function getTaskEventOptions(): Array<{ name: string; value: number; description: string }> {
	return Object.values(TASK_EVENT_TYPES).map(eventType => ({
		name: TASK_EVENT_INFO[eventType].name,
		value: eventType,
		description: TASK_EVENT_INFO[eventType].description,
	}));
}

// Generate subtitle expression string for QuireTrigger node
export function getSubtitleExpression(): string {
	// Create event name mapping from TASK_EVENT_INFO
	const eventNameMap: { [key: number]: string } = Object.keys(TASK_EVENT_INFO).reduce((map, key) => {
		const eventType = parseInt(key);
		map[eventType] = TASK_EVENT_INFO[eventType].name;
		return map;
	}, {} as { [key: number]: string });
	
	const eventMap = JSON.stringify(eventNameMap);
	return `={{$parameter["events"].map(e => (${eventMap})[e] || \`Event \${e}\`).join(", ")}}`;
}
