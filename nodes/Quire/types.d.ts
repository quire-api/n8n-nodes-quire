// Quire TypeScript interfaces for n8n integration

export interface QuireCredentials {
  oauthTokenData?: {
    access_token: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface QuireTask {
  id: string;
  name: string;
  description?: string;
  assignees?: string[];
  followers?: string[];
  status?: number;
  priority?: number;
  peekaboo?: boolean;
  tags?: string[];
  due?: string;
  start?: string;
  editedAt?: string | null;
  partner?: any;
  toggledAt?: string | null;
  toggledBy?: any;
  [key: string]: any;
}

export interface QuireComment {
  id: string;
  content: string;
  editedAt?: string | null;
  editedBy?: any;
  owner?: any;
  ownerOtype?: any;
  pinAt?: string | null;
  pinBy?: any;
  [key: string]: any;
}

export interface QuireProject {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface QuireUser {
  id: string;
  name: string;
  email?: string;
  [key: string]: any;
}

export interface QuireTag {
  id: string;
  name: string;
  color?: string;
  [key: string]: any;
}

export interface QuireSublist {
  id: string;
  name: string;
  [key: string]: any;
}

export interface QuireTaskInput {
  name?: string;
  description?: string;
  assignees?: string[];
  add_assignees?: string[];
  remove_assignees?: string[];
  followers?: string[];
  add_followers?: string[];
  remove_followers?: string[];
  status?: number;
  priority?: string;
  peekaboo?: string | boolean | number;
  tags?: string[];
  add_tags?: string[];
  remove_tags?: string[];
  due_on?: string;
  due_at?: string;
  start_on?: string;
  start_at?: string;
  by_app?: boolean;
  sourceRef?: { [key: string]: string };
}

export interface QuireCommentInput {
  description: string;
  asUser: boolean;
  pinned: boolean;
}



// Resource types
export type QuireResource = 
	| 'task' 
	| 'comment' 
	| 'project' 
	| 'user' 
	| 'tag' 
	| 'sublist' 
	| 'partner' 
	| 'search';

// Operation types for each resource
export type TaskOperation = 'create' | 'get' | 'getByOid' | 'getAll' | 'update';
export type CommentOperation = 'create' | 'getAll';
export type ProjectOperation = 'getAll';
export type UserOperation = 'getAll';
export type TagOperation = 'getAll';
export type SublistOperation = 'getAll';
export type PartnerOperation = 'getAll';
export type SearchOperation = 'findTaskInProject' | 'findUser';

export type QuireOperation = 
	| TaskOperation 
	| CommentOperation 
	| ProjectOperation 
	| UserOperation 
	| TagOperation 
	| SublistOperation 
	| PartnerOperation 
	| SearchOperation;
