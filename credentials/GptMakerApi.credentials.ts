import { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class GptMakerApi implements ICredentialType {
	name = 'gptMakerApi';

	displayName = 'GPTMaker API';

	icon = {
		light: 'file:../nodes/GptMaker/GptMaker.svg',
		dark: 'file:../nodes/GptMaker/GptMaker.svg',
	} as const;

	documentationUrl = 'https://developer.gptmaker.ai/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];

	authenticate = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	} as const;

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.gptmaker.ai',
			url: '/v2/workspaces',
			method: 'GET',
		},
	};
}