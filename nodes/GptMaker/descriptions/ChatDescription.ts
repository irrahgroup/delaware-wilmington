import { INodeProperties } from 'n8n-workflow';

export const chatOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['chat'],
			},
		},
		options: [
			{
				name: 'Delete Chat',
				value: 'deleteChat',
				action: 'Delete chat',
				description: 'Delete a chat (DELETE /v2/chat/{chatId})',
			},
			{
				name: 'Delete Message',
				value: 'deleteMessage',
				action: 'Delete message',
				description: 'Delete a message (DELETE /v2/chat/{chatId}/message/{messageId})',
			},
			{
				name: 'Delete Messages',
				value: 'deleteMessages',
				action: 'Delete messages',
				description: 'Clear messages from a chat (DELETE /v2/chat/{chatId}/messages)',
			},
			{
				name: 'Edit Message',
				value: 'editMessage',
				action: 'Edit message',
				description: 'Edit a message (PUT /v2/chat/{chatId}/message/{messageId})',
			},
			{
				name: 'End Human Support',
				value: 'encerrarAtendimento',
				action: 'End human support',
				description: 'End human support (PUT /v2/chat/{chatId}/stop-human)',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'List chats',
				description: 'List workspace chats (GET /v2/workspace/{workspaceId}/chats)',
			},
			{
				name: 'List Messages',
				value: 'getMessages',
				action: 'List messages',
				description: 'List chat messages (GET /v2/chat/{chatId}/messages)',
			},
			{
				name: 'Send Message',
				value: 'sendMessage',
				action: 'Send message',
				description: 'Send a new message to the chat (POST /v2/chat/{chatId}/send-message)',
			},
			{
				name: 'Take Over Support',
				value: 'assumirAtendimento',
				action: 'Take over support',
				description: 'Mark that a human will take over the support (PUT /v2/chat/{chatId}/start-human)',
			},
		],
		default: 'getAll',
	},
];

export const chatFields: INodeProperties[] = [
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
				resource: ['chat'],
				operation: ['getAll'],
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
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getAll'],
			},
		},
		description: 'Filter chats by agent (optional). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getAll'],
			},
		},
		description: 'Page number (optional)',
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 50,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getAll'],
			},
		},
		description: 'Page size (optional)',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getAll'],
			},
		},
		description: 'Filter by chat name (optional)',
	},
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['chat'],
			},
			hide: {
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['deleteMessage', 'editMessage'],
			},
		},
	},
	{
		displayName: 'Message',
		name: 'messageText',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['sendMessage', 'editMessage'],
			},
		},
		description: 'Message content',
	},
	{
		displayName: 'Reply Message ID',
		name: 'replyMessageId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['sendMessage'],
			},
		},
		description: 'ID of a message to reply to (optional)',
	},
];
