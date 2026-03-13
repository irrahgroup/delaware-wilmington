import { INodeProperties } from 'n8n-workflow';

export const interactionsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['interaction'],
			},
		},
		options: [
			{
				name: 'List Interactions',
				value: 'getAllByWorkspace',
				action: 'List interactions in a workspace',
				description: 'GET /v2/workspace/{workspaceId}/interactions',
			},
			{
				name: 'Delete Interaction',
				value: 'delete',
				action: 'Delete an interaction',
				description: 'DELETE /v2/interaction/{ID}',
			},
		],
		default: 'getAllByWorkspace',
	},
];

export const interactionsFields: INodeProperties[] = [
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
				resource: ['interaction'],
				operation: ['getAllByWorkspace'],
			},
		},
		description: 'Select the workspace. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Interaction ID',
		name: 'interactionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['interaction'],
				operation: ['delete'],
			},
		},
	},
];
