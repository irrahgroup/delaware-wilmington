import { INodeProperties } from 'n8n-workflow';

export const channelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['channel'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a channel',
				description: 'Create a new channel for an agent via POST /v2/agent/{agentId}/create-channel',
			},
			{
				name: 'Create In Workspace',
				value: 'createInWorkspace',
				action: 'Create a channel in a workspace',
				description: 'Create a new channel in a workspace via POST /v2/workspace/{workspaceId}/create-channel',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a channel',
				description: 'Remove a channel via DEL /v2/channel/{channelId}',
			},
			{
				name: 'Get Config',
				value: 'getConfig',
				action: 'Get channel config',
				description: 'Get channel config via GET /v2/channel/{channelId}/config',
			},
			{
				name: 'List By Workspace',
				value: 'getAllByWorkspace',
				action: 'List channels in a workspace',
				description: 'List channels via GET /v2/workspace/{workspaceId}/channels',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a channel',
				description: 'Edit a channel via PUT /v2/channel/{channelId}',
			},
			{
				name: 'Update Config',
				value: 'updateConfig',
				action: 'Update channel config',
				description: 'Update channel config via PUT /v2/channel/{channelId}/config',
			},
		],
		default: 'create',
	},
];

export const channelFields: INodeProperties[] = [
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
				resource: ['channel'],
				operation: ['createInWorkspace', 'getAllByWorkspace'],
			},
		},
		description: 'Select the workspace. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Agent Name or ID',
		name: 'agentId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
			loadOptionsDependsOn: ['workspaceId'],
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['channel'],
				operation: ['create', 'createInWorkspace'],
			},
		},
		description: 'Select the agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Channel ID',
		name: 'channelId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['channel'],
				operation: ['update', 'delete', 'getConfig', 'updateConfig'],
			},
		},
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['channel'],
				operation: ['create', 'createInWorkspace'],
			},
		},
		description: 'Channel name',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		default: 'WHATSAPP',
		required: true,
		displayOptions: {
			show: {
				resource: ['channel'],
				operation: ['create','createInWorkspace'],
			},
		},
		options: [
			{ name: 'Cloud API', value: 'CLOUD_API' },
			{ name: 'Instagram', value: 'INSTAGRAM' },
			{ name: 'Mercado Livre', value: 'MERCADO_LIVRE' },
			{ name: 'Messenger', value: 'MESSENGER' },
			{ name: 'Telegram', value: 'TELEGRAM' },
			{ name: 'WhatsApp', value: 'WHATSAPP' },
			{ name: 'Widget', value: 'WIDGET' },
		],
		description: 'Channel type (per GPTMaker docs)',
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['channel'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: 'Agent ID',
						name: 'agentId',
						type: 'string',
						default: '',
						description: 'Optional. Leave empty to unlink the current agent from the channel.',
					},
				],
			},
		],
		description: 'Name is required. Agent ID is optional; if empty it will unlink the channel from the current agent.',
	},

	{
		displayName: 'Config Fields',
		name: 'configFields',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Config Field',
		displayOptions: {
			show: {
				resource: ['channel'],
				operation: ['updateConfig'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Audio Action',
						name: 'audioAction',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Call Reject Auto',
						name: 'callRejectAuto',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Call Reject Message',
						name: 'callRejectMessage',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Comments Call Direct Instruction',
						name: 'commentsCallDirectInstruction',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Comments Reply All Enabled',
						name: 'commentsReplyAllEnabled',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Comments Reply All Instruction',
						name: 'commentsReplyAllInstruction',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Comments Reply Enabled',
						name: 'commentsReplyEnabled',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Enable Groups Response',
						name: 'enableGroupsResponse',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Enable Private Chat Response',
						name: 'enablePrivateChatResponse',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Enabled Typing',
						name: 'enabledTyping',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'End Trigger',
						name: 'endTrigger',
						type: 'string',
						default: '',
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'Optional channel ID in body (usually not needed because Channel ID path param is already used)',
					},
					{
						displayName: 'Not React Instagram Stories',
						name: 'notReactInstagramStories',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Reply Groups Type',
						name: 'replyGroupsType',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Start Trigger',
						name: 'startTrigger',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Take Outside Service',
						name: 'takeOutsideService',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Take Outside Service Command',
						name: 'takeOutsideServiceCommand',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Take Outside Service Command Return',
						name: 'takeOutsideServiceCommandReturn',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Take Outside Service Member',
						name: 'takeOutsideServiceMember',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Take Outside Service Message',
						name: 'takeOutsideServiceMessage',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Take Outside Service Return Message',
						name: 'takeOutsideServiceReturnMessage',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Tenant',
						name: 'tenant',
						type: 'string',
						default: '',
						description: 'Tenant identifier (if required for your channel type)',
					},
					{
						displayName: 'Waiting Message Enabled',
						name: 'waitingMessageEnabled',
						type: 'boolean',
						default: false,
					},
					{
						displayName: 'Waiting Message Text',
						name: 'waitingMessageText',
						type: 'string',
						default: '',
					},
				],
			},
		],
		description: 'Channel config fields. Fields vary by channel type; only fields you add are sent.',
	},
];
