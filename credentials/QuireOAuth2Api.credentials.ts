import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const quireUrl = 'https://quire.io';

export class QuireOAuth2Api implements ICredentialType {
	name = 'quireOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Quire OAuth2 API';
	documentationUrl = 'https://quire.io/dev/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: `${quireUrl}/oauth`,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: `${quireUrl}/oauth/token`,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'read write',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
