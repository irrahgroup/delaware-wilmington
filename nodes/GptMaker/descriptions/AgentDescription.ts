import { INodeProperties } from 'n8n-workflow';

export const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
			},
		},
		options: [
			{
				name: 'Activate',
				value: 'activate',
				action: 'Activate an agent',
				description: 'Set an agent status to active via PUT /v2/agent/{agentId}/active',
			},
			{
				name: 'Add Context',
				value: 'addMessage',
				action: 'Add context to an agent',
				description: 'Add conversation context via POST /v2/agent/{agentId}/add-message',
			},
			{
				name: 'Conversation',
				value: 'conversation',
				action: 'Talk to an agent',
				description: 'Chat with an agent via POST /v2/agent/{agentId}/conversation',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an agent',
				description: 'Create a new agent via POST /v2/workspace/{workspaceId}/agents',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an agent',
				description: 'Permanently remove an agent via DELETE /v2/agent/{agentId}',
			},
			{
				name: 'Get By ID',
				value: 'getById',
				action: 'Get an agent',
				description: 'Fetch a single agent via GET /v2/agent/{agentId}',
			},
			{
				name: 'Get Credits Spent',
				value: 'getCreditsSpent',
				action: 'Get agent credits spent',
				description: 'Retrieve credits spent via GET /v2/agent/{agentId}/credits-spent',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List agents in a workspace',
				description: 'Retrieve agents for a workspace via GET /v2/workspace/{workspaceId}/agents',
			},
			{
				name: 'Get Settings',
				value: 'getSettings',
				action: 'Get agent settings',
				description: 'Retrieve agent settings via GET /v2/agent/{agentId}/settings',
			},
			{
				name: 'Get Webhooks',
				value: 'getWebhooks',
				action: 'Get agent webhooks',
				description: 'List all webhooks configured for an agent via GET /v2/agent/{agentId}/webhooks',
			},
			{
				name: 'Inactivate',
				value: 'inactivate',
				action: 'Inactivate an agent',
				description: 'Set an agent status to inactive via PUT /v2/agent/{agentId}/inactive',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an agent',
				description: 'Edit an agent via PUT /v2/agent/{agentId}',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				action: 'Update agent settings',
				description: 'Update agent settings via PUT /v2/agent/{agentId}/settings',
			},
			{
				name: 'Update Webhooks',
				value: 'updateWebhooks',
				action: 'Update agent webhooks',
				description: 'Update webhooks via PUT /v2/agent/{agentId}/webhooks',
			},
		],
		default: 'getAll',
	},
];

export const agentFields: INodeProperties[] = [
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
				resource: ['agent'],
				operation: ['create', 'getAll'],
			},
		},
		description: 'Select the workspace for workspace-scoped agent endpoints. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
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
				resource: ['agent'],
				operation: [
					'activate',
					'addMessage',
					'conversation',
					'delete',
					'getById',
					'getCreditsSpent',
					'getSettings',
					'getWebhooks',
					'inactivate',
					'update',
					'updateSettings',
					'updateWebhooks',
				],
			},
		},
		description: 'Select the agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'Agent name',
	},
	{
		displayName: 'Avatar URL',
		name: 'avatar',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'Optional agent avatar URL',
	},
	{
		displayName: 'Behavior / Instructions',
		name: 'behavior',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'Agent behavior/instructions',
	},
	{
		displayName: 'Communication Type',
		name: 'communicationType',
		type: 'options',
		default: 'FORMAL',
		required: true,
		options: [
			{ name: 'Formal', value: 'FORMAL' },
			{ name: 'Normal', value: 'NORMAL' },
			{ name: 'Relaxed', value: 'RELAXED' },
		],
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'How the agent should communicate',
	},
	{
		displayName: 'Agent Type',
		name: 'agentType',
		type: 'options',
		default: 'SUPPORT',
		required: true,
		options: [
			{ name: 'Support', value: 'SUPPORT' },
			{ name: 'Sale', value: 'SALE' },
			{ name: 'Personal', value: 'PERSONAL' },
		],
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'Agent objective/type',
	},
	{
		displayName: 'Job Name',
		name: 'jobName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'Company/product name the agent represents',
	},
	{
		displayName: 'Job Site',
		name: 'jobSite',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'Company website',
	},
	{
		displayName: 'Job Description',
		name: 'jobDescription',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'Short description about the company/product',
	},
	{
		displayName: 'Context ID',
		name: 'contextId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['addMessage'],
			},
		},
		description: 'Context ID required by add-message endpoint',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['addMessage'],
			},
		},
		description: 'Prompt/message to add into the context',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		default: 'assistant',
		options: [
			{ name: 'Assistant', value: 'assistant' },
			{ name: 'User', value: 'user' },
		],
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['addMessage'],
			},
		},
		description: 'Message role (default: assistant)',
	},
	{
		displayName: 'Conversation Context ID',
		name: 'conversationContextId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['conversation'],
			},
		},
		description: 'Context ID required by conversation endpoint',
	},
	{
		displayName: 'Conversation Prompt',
		name: 'conversationPrompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['conversation'],
			},
		},
		description: 'Prompt/message to send to the agent (conversation)',
	},
	{
		displayName: 'Callback URL',
		name: 'callbackUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['conversation'],
			},
		},
		description: 'Optional callback URL to receive asynchronous updates',
	},
	{
		displayName: 'On Finish Callback',
		name: 'onFinishCallback',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['conversation'],
			},
		},
		description: 'Optional callback URL to be called when the conversation finishes',
	},
	{
		displayName: 'Chat Name',
		name: 'chatName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['conversation'],
			},
		},
		description: 'Optional chat display name',
	},
	{
		displayName: 'Chat Picture',
		name: 'chatPicture',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['conversation'],
			},
		},
		description: 'Optional chat picture URL',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['conversation'],
			},
		},
		description: 'Optional phone number associated with the chat',
	},
	{
		displayName: 'Date',
		name: 'creditsSpentDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getCreditsSpent'],
			},
		},
		description: 'Optional date filter. Internally sent as year, month, and day.',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Agent Type',
						name: 'agentType',
						type: 'options',
						default: 'SUPPORT',
						options: [
							{
								name: 'Support',
								value: 'SUPPORT',
							},
							{
								name: 'Sale',
								value: 'SALE',
							},
							{
								name: 'Personal',
								value: 'PERSONAL',
							},
						]
					},
					{
						displayName: 'Avatar URL',
						name: 'avatar',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Behavior	/	Instructions',
						name: 'behavior',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Communication Type',
						name: 'communicationType',
						type: 'options',
						default: 'FORMAL',
						options: [
							{
								name: 'Formal',
								value: 'FORMAL',
							},
							{
								name: 'Normal',
								value: 'NORMAL',
							},
							{
								name: 'Relaxed',
								value: 'RELAXED',
							},
					]
					},
					{
						displayName: 'Job Description',
						name: 'jobDescription',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Job Name',
						name: 'jobName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Job Site',
						name: 'jobSite',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
			],
			},
		],
		description: 'Only the fields you add here will be sent to the API',
	},
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Setting',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['updateSettings'],
			},
		},
		options: [
			{
				displayName: 'Settings',
				name: 'values',
				values: [
					{
						displayName: 'Enable Emoji',
						name: 'enabledEmoji',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Enable Human Transfer',
						name: 'enabledHumanTransfer',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Enable Reminder',
						name: 'enabledReminder',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Knowledge By Function',
						name: 'knowledgeByFunction',
						type: 'boolean',
						default: true,
						description: 'Whether to enable intelligent training-base lookup',
					},
					{
						displayName: 'Limit Subjects',
						name: 'limitSubjects',
						type: 'boolean',
						default: true,
						description: 'Whether to limit answers to company/product subjects',
					},
					{
						displayName: 'Max Daily Messages',
						name: 'maxDailyMessages',
						type: 'number',
						default: 0,
						description: 'Use 0 to omit. API accepts null or specific values (e.g. 20, 50, 100, 200, 500, 1000).',
					},
					{
						displayName: 'Max Daily Messages Limit Action',
						name: 'maxDailyMessagesLimitAction',
						type: 'options',
						default: 'TEMP_BLOCK_30S',
						options: [
							{
								name: 'Block',
								value: 'BLOCK',
							},
							{
								name: 'Temp Block 10m',
								value: 'TEMP_BLOCK_10M',
							},
							{
								name: 'Temp Block 1h',
								value: 'TEMP_BLOCK_1H',
							},
							{
								name: 'Temp Block 30m',
								value: 'TEMP_BLOCK_30M',
							},
							{
								name: 'Temp Block 30s',
								value: 'TEMP_BLOCK_30S',
							},
							{
								name: 'Temp Block 5m',
								value: 'TEMP_BLOCK_5M',
							},
							{
								name: 'Transfer',
								value: 'TRANSFER',
							},
						],
						description: 'Used only when maxDailyMessages is set (not 0)',
					},
					{
						displayName: 'Message Grouping Time',
						name: 'messageGroupingTime',
						type: 'options',
						default: 'NO_GROUP',
						options: [
							{
								name: '1 Minute',
								value: 'ONE_MINUTE',
							},
							{
								name: '10 Seconds',
								value: 'TEN_SEC',
							},
							{
								name: '30 Seconds',
								value: 'THIRD_SEC',
							},
							{
								name: '5 Seconds',
								value: 'FIVE_SEC',
							},
							{
								name: 'No Group',
								value: 'NO_GROUP',
							},
						],
					},
					{
						displayName: 'On Lack Knowledge (Webhook URL)',
						name: 'onLackKnowLedge',
						type: 'string',
						default: '',
						description: 'Webhook URL to trigger when the agent lacks knowledge',
					},
					{
						displayName: 'Preferred Model',
						name: 'prefferModel',
						type: 'string',
						default: '',
						description: 'Preferred LLM model (e.g. GPT_5, GPT_4_O, etc.)',
					},
					{
						displayName: 'Sign Messages',
						name: 'signMessages',
						type: 'boolean',
						default: true,
						description: 'Whether the agent messages should be signed',
					},
					{
						displayName: 'Split Messages',
						name: 'splitMessages',
						type: 'boolean',
						default: true,
						description: 'Whether to split large messages into multiple messages',
					},
					{
						displayName: 'Timezone',
						name: 'timezone',
						type: 'string',
						default: '',
						description: 'Agent timezone (e.g. America/Sao_Paulo)',
					},
			],
			},
		],
		description: 'Only the settings you add here will be sent to the API',
	},
	{
		displayName: 'Webhooks',
		name: 'webhooks',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Webhook',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['updateWebhooks'],
			},
		},
		options: [
			{
				displayName: 'Webhook URLs',
				name: 'values',
				values: [
					{
						displayName: 'On Cancel Event',
						name: 'onCancelEvent',
						type: 'string',
						default: '',
					},
					{
						displayName: 'On Create Event',
						name: 'onCreateEvent',
						type: 'string',
						default: '',
					},
					{
						displayName: 'On Finish Interaction',
						name: 'onFinishInteraction',
						type: 'string',
						default: '',
					},
					{
						displayName: 'On First Interaction',
						name: 'onFirstInteraction',
						type: 'string',
						default: '',
					},
					{
						displayName: 'On Lack Knowledge',
						name: 'onLackKnowLedge',
						type: 'string',
						default: '',
					},
					{
						displayName: 'On New Message',
						name: 'onNewMessage',
						type: 'string',
						default: '',
					},
					{
						displayName: 'On Start Interaction',
						name: 'onStartInteraction',
						type: 'string',
						default: '',
					},
					{
						displayName: 'On Transfer',
						name: 'onTransfer',
						type: 'string',
						default: '',
					},
				],
			},
		],
		description: 'Only the webhook URLs you add here will be sent to the API',
	},
];
