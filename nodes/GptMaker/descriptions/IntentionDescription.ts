import { INodeProperties } from 'n8n-workflow';

export const intentionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['intention'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List intentions',
				description: 'List agent intentions via GET /v2/agent/{agentId}/intentions',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an intention',
				description: 'Create an intention via POST /v2/agent/{agentId}/intentions',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an intention',
				description: 'Update an intention via PUT /v2/intention/{intentionId}',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an intention',
				description: 'Delete an intention via DELETE /v2/intention/{intentionId}',
			},
		],
		default: 'list',
	},
];

const headerCollection: INodeProperties = {
	displayName: 'Headers',
	name: 'headersUi',
	type: 'fixedCollection',
	default: {},
	placeholder: 'Add Header',
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			displayName: 'Header',
			name: 'headersValues',
			values: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
					placeholder: 'Authorization',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					placeholder: 'Bearer xxx',
				},
			],
		},
	],
};

const paramsCollection: INodeProperties = {
	displayName: 'Params',
	name: 'paramsUi',
	type: 'fixedCollection',
	default: {},
	placeholder: 'Add Param',
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			displayName: 'Param',
			name: 'paramsValues',
			values: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
					placeholder: 'orderId',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					placeholder: '={{$json.orderId}}',
				},
			],
		},
	],
};

const fieldsCollection: INodeProperties = {
	displayName: 'Fields',
	name: 'fieldsUi',
	type: 'fixedCollection',
	default: {},
	placeholder: 'Add Field',
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			displayName: 'Field',
			name: 'fieldsValues',
			values: [
				{
					displayName: 'Description',
					name: 'description',
					type: 'string',
					default: '',
					placeholder: 'Order ID in the ERP',
				},
				{
					displayName: 'JSON Name',
					name: 'jsonName',
					type: 'string',
					default: '',
					placeholder: 'orderId',
				},
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
					placeholder: 'Order',
				},
				{
					displayName: 'Required',
					name: 'required',
					type: 'boolean',
					default: true,
				},
				{
					displayName: 'Type',
					name: 'type',
					type: 'options',
					default: 'STRING',
					options: [
						{
							name: 'Array',
							value: 'ARRAY',
						},
						{
							name: 'Boolean',
							value: 'BOOLEAN',
						},
						{
							name: 'Date',
							value: 'DATE',
						},
						{
							name: 'Date Time',
							value: 'DATE_TIME',
						},
						{
							name: 'Money',
							value: 'MONEY',
						},
						{
							name: 'Number',
							value: 'NUMBER',
						},
						{
							name: 'Object',
							value: 'OBJECT',
						},
						{
							name: 'String',
							value: 'STRING',
						},
					]
				},
			],
		},
	],
};

const variablesCollection: INodeProperties = {
	displayName: 'Variables',
	name: 'variablesUi',
	type: 'fixedCollection',
	default: {},
	placeholder: 'Add Variable',
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			displayName: 'Variable',
			name: 'variablesValues',
			values: [
				{
					displayName: 'Value Expression',
					name: 'valueExpression',
					type: 'string',
					default: '',
					placeholder: '={{$json.orderId}}',
					description: 'Expression used to set the variable value',
				},
				{
					displayName: 'Default Field Key',
					name: 'defaultFieldKey',
					type: 'string',
					default: '',
					placeholder: 'orderId',
					description: 'Fallback key name (optional)',
				},
				{
					displayName: 'Custom Field',
					name: 'customField',
					type: 'fixedCollection',
					default: {},
					placeholder: 'Set Custom Field',
					options: [
						{
							displayName: 'Field',
							name: 'field',
							values: [
						{
							displayName: 'Description',
							name: 'description',
							type: 'string',
							default: '',
							placeholder: 'Order ID in the ERP',
						},
						{
							displayName: 'ID',
							name: 'id',
							type: 'string',
							default: '',
							placeholder: 'cf_123',
						},
						{
							displayName: 'JSON Name',
							name: 'jsonName',
							type: 'string',
							default: '',
							placeholder: 'orderId',
						},
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
							placeholder: 'Order',
						},
						{
							displayName: 'Type',
							name: 'type',
							type: 'options',
							default: 'STRING',
							options: [
										{
											name: 'Array',
											value: 'ARRAY',
										},
										{
											name: 'Boolean',
											value: 'BOOLEAN',
										},
										{
											name: 'Date',
											value: 'DATE',
										},
										{
											name: 'Date Time',
											value: 'DATE_TIME',
										},
										{
											name: 'Money',
											value: 'MONEY',
										},
										{
											name: 'Number',
											value: 'NUMBER',
										},
										{
											name: 'Object',
											value: 'OBJECT',
										},
										{
											name: 'String',
											value: 'STRING',
										},
									]
						},
						],
						},
					],
				},
			],
		},
	],
};

const requestBodyCollection: INodeProperties = {
	displayName: 'Request Body',
	name: 'requestBodyUi',
	type: 'fixedCollection',
	default: {},
	placeholder: 'Add Body Field',
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			displayName: 'Body Field',
			name: 'requestBodyValues',
			values: [
				{
					displayName: 'Key',
					name: 'key',
					type: 'string',
					default: '',
					placeholder: 'customerId',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					placeholder: '={{$json.customerId}}',
				},
			],
		},
	],
};

export const intentionFields: INodeProperties[] = [
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
				resource: ['intention'],
				operation: ['list', 'create'],
			},
		},
		description: 'Select the agent for agent-scoped intention endpoints. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Intention ID',
		name: 'intentionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['update', 'delete'],
			},
		},
		description: 'Intention ID (used by update/delete endpoints)',
	},

	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['list'],
			},
		},
		description: 'Optional. Use 0 to omit.',
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['list'],
			},
		},
		description: 'Optional. Use 0 to omit.',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['list'],
			},
		},
		description: 'Optional filter by intention description',
	},

	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
			},
		},
		description: 'Intention description',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		default: 'WEBHOOK',
		required: true,
		options: [
			{ name: 'Webhook', value: 'WEBHOOK' },
			{ name: 'Instructions', value: 'INSTRUCTIONS' },
		],
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
			},
		},
		description: 'Intention type',
	},
	{
		displayName: 'HTTP Method',
		name: 'httpMethod',
		type: 'options',
		default: 'GET',
		required: true,
		options: [
			{ name: 'GET', value: 'GET' },
			{ name: 'POST', value: 'POST' },
		],
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
		description: 'Webhook HTTP method',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
		description: 'Webhook URL',
	},
	{
		displayName: 'Auto Generate Params',
		name: 'autoGenerateParams',
		type: 'boolean',
		default: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
		description: 'Whether to automatically generate query params',
	},
	{
		displayName: 'Auto Generate Body',
		name: 'autoGenerateBody',
		type: 'boolean',
		default: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
		description: 'Whether to automatically generate request body',
	},
	{
		displayName: 'Instructions',
		name: 'instructions',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['INSTRUCTIONS'],
			},
		},
		description: 'Agent instructions for INSTRUCTIONS-type intentions',
	},
	{
		displayName: 'Details',
		name: 'details',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
			},
		},
		description: 'When to use the intention / output formatting',
	},

	{
		...headerCollection,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
	},
	{
		...paramsCollection,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
	},
	{
		...fieldsCollection,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
	},
	{
		...variablesCollection,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
	},
	{
		...requestBodyCollection,
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['create'],
				type: ['WEBHOOK'],
			},
		},
		description: 'Key/value pairs that will be converted to JSON and sent as requestBody (API expects a string)',
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Auto Generate Body',
						name: 'autoGenerateBody',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Auto Generate Params',
						name: 'autoGenerateParams',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Details',
						name: 'details',
						type: 'string',
						default: '',
					},
					{
						displayName: 'HTTP Method',
						name: 'httpMethod',
						type: 'options',
						default: 'GET',
						options: [
							{
								name: 'GET',
								value: 'GET',
							},
							{
								name: 'POST',
								value: 'POST',
							},
						]
					},
					{
						displayName: 'Instructions',
						name: 'instructions',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'WEBHOOK',
						options: [
							{
								name: 'Webhook',
								value: 'WEBHOOK',
							},
					],
						description: 'According to GPTMaker docs, update supports WEBHOOK',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
					},
			],
			},
		],
		description: 'Only the fields you add here will be sent to the API',
	},

	{
		...headerCollection,
		name: 'updateHeadersUi',
		displayName: 'Update Headers',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['update'],
			},
		},
	},
	{
		...paramsCollection,
		name: 'updateParamsUi',
		displayName: 'Update Params',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['update'],
			},
		},
	},
	{
		...fieldsCollection,
		name: 'updateFieldsUi',
		displayName: 'Update Fields List',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['update'],
			},
		},
	},
	{
		...variablesCollection,
		name: 'updateVariablesUi',
		displayName: 'Update Variables',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['update'],
			},
		},
	},
	{
		...requestBodyCollection,
		name: 'updateRequestBodyUi',
		displayName: 'Update Request Body',
		displayOptions: {
			show: {
				resource: ['intention'],
				operation: ['update'],
			},
		},
		description: 'If you add body fields here, the node will send requestBody (stringified JSON). Leave empty to not change.',
	},
];
