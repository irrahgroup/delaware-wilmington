import { INodeProperties } from 'n8n-workflow';

export const workspaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['workspace'] },
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List all workspaces',
				description: 'Retrieve many workspaces via GET /v2/workspaces',
			},
			{
				name: 'Get Credits Balance',
				value: 'getCredits',
				action: 'Get workspace credits balance',
				description: 'Retrieve workspace credits via GET /v2/workspace/{workspaceId}/credits',
			},
		],
		default: 'getAll',
	},
];

export const workspaceFields: INodeProperties[] = [
	{
		displayName: 'Workspace Name or ID',
		name: 'workspaceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkspaces',
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['workspace'],
				operation: ['getCredits'],
			},
		},
		description: 'Select the workspace. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
