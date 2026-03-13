import { INodeProperties } from 'n8n-workflow';

export const trainingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['training'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a training',
				description: 'Add a new training via POST /v2/agent/{agentId}/trainings',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List trainings',
				description: 'List trainings via GET /v2/agent/{agentId}/trainings',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a training',
				description: 'Update a training via PUT /v2/training/{trainingId} (TEXT only)',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a training',
				description: 'Delete a training via DELETE /v2/training/{trainingId}',
			},
		],
		default: 'getAll',
	},
];

export const trainingFields: INodeProperties[] = [
	{
		displayName: 'Agent Name or ID',
		name: 'agentId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['create', 'getAll'],
			},
		},
		description: 'Select the agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Training Type',
		name: 'createType',
		type: 'options',
		default: 'TEXT',
		required: true,
		options: [{ name: 'Text', value: 'TEXT' }],
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['create'],
			},
		},
		description: 'Training type for creation (currently TEXT in this node)',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['create', 'update'],
			},
		},
		description: 'Training text (for update: TEXT trainings only)',
	},
	{
		displayName: 'Image URL',
		name: 'image',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['create', 'update'],
			},
		},
		description: 'Optional image URL',
	},
	{
		displayName: 'Callback URL',
		name: 'callbackUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['create'],
			},
		},
		description: 'Optional webhook URL notified when training finishes',
	},

	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		default: 'TEXT',
		required: true,
		options: [
			{ name: 'Text', value: 'TEXT' },
			{ name: 'Website', value: 'WEBSITE' },
			{ name: 'Video', value: 'VIDEO' },
			{ name: 'Document', value: 'DOCUMENT' },
		],
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['getAll'],
			},
		},
		description: 'Training type filter (required by the API)',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['getAll'],
			},
		},
		description: 'Filter string for trainings',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['getAll'],
			},
		},
		description: 'Page number (use 0 to omit)',
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['getAll'],
			},
		},
		description: 'Page size (use 0 to omit)',
	},

	{
		displayName: 'Training ID',
		name: 'trainingId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['training'],
				operation: ['update', 'delete'],
			},
		},
	},
];
