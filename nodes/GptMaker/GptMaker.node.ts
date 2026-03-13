import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';

import { channelExecute } from './resources/ChannelResource';
import { agentExecute } from './resources/AgentResource';
import { workspaceExecute } from './resources/WorkspaceResource';
import { intentionExecute } from './resources/IntentionResource';
import { trainingExecute } from './resources/TrainingResource';
import { chatExecute } from './resources/ChatResource';
import { interactionsExecute } from './resources/InteractionsResource';

import { channelOperations, channelFields } from './descriptions/ChannelDescription';
import { agentOperations, agentFields } from './descriptions/AgentDescription';
import { workspaceOperations, workspaceFields } from './descriptions/WorkspaceDescription';
import { intentionOperations, intentionFields } from './descriptions/IntentionDescription';
import { trainingOperations, trainingFields } from './descriptions/TrainingDescription';
import { chatOperations, chatFields } from './descriptions/ChatDescription';
import { interactionsOperations, interactionsFields } from './descriptions/InteractionsDescription';
import { gptMakerApiRequest } from './Helpers';

interface IWorkspaceReference {
	id: string;
	name: string;
}

function isDataObject(value: unknown): value is IDataObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractCollectionItems(value: unknown): IDataObject[] {
	if (Array.isArray(value)) {
		return value.filter(isDataObject);
	}

	if (!isDataObject(value)) {
		return [];
	}

	const preferredKeys = ['data', 'results', 'items', 'workspaces', 'agents'];

	for (const key of preferredKeys) {
		const nestedItems = extractCollectionItems(value[key]);
		if (nestedItems.length > 0) {
			return nestedItems;
		}
	}

	const objectValues = Object.values(value);
	const nestedObjects = objectValues.filter(isDataObject);

	if (nestedObjects.length > 1 && nestedObjects.length === objectValues.length) {
		return nestedObjects;
	}

	for (const nestedValue of objectValues) {
		const nestedItems = extractCollectionItems(nestedValue);
		if (nestedItems.length > 0) {
			return nestedItems;
		}
	}

	return [];
}

function getFirstStringValue(record: IDataObject, keys: string[]): string | undefined {
	for (const key of keys) {
		const value = record[key];

		if (typeof value === 'string' && value.trim() !== '') {
			return value.trim();
		}

		if (typeof value === 'number') {
			return String(value);
		}
	}

	return undefined;
}

function buildWorkspaceReferences(workspacesResponse: unknown): IWorkspaceReference[] {
	const workspaceRecords = extractCollectionItems(workspacesResponse);
	const seen = new Set<string>();
	const workspaces: IWorkspaceReference[] = [];

	for (const workspaceRecord of workspaceRecords) {
		const workspaceId = getFirstStringValue(workspaceRecord, ['id', '_id', 'workspaceId', 'workspaceID', 'uuid']);

		if (!workspaceId || seen.has(workspaceId)) {
			continue;
		}

		const workspaceName =
			getFirstStringValue(workspaceRecord, ['name', 'workspaceName', 'title', 'label']) ?? workspaceId;

		seen.add(workspaceId);
		workspaces.push({
			id: workspaceId,
			name: workspaceName,
		});
	}

	return workspaces;
}

export class GptMaker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GPTMaker',
		name: 'gptMaker',
		icon: 'file:GptMaker.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume GPTMaker API',
		defaults: { name: 'GPTMaker' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'gptMakerApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'Channel', value: 'channel' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'Intention', value: 'intention' },
					{ name: 'Interaction', value: 'interaction' },
					{ name: 'Training', value: 'training' },
					{ name: 'Workspace', value: 'workspace' },
				],
				default: 'agent',
			},
			...agentOperations,
			...agentFields,
			...channelOperations,
			...channelFields,
			...chatOperations,
			...chatFields,
			...interactionsOperations,
			...interactionsFields,
			...intentionOperations,
			...intentionFields,
			...trainingOperations,
			...trainingFields,
			...workspaceOperations,
			...workspaceFields,
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await gptMakerApiRequest.call(this, 'GET', '/v2/workspaces');
				const workspaces = buildWorkspaceReferences(response);

				return workspaces
					.map((workspace) => ({
						name: workspace.name,
						value: workspace.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				let selectedWorkspaceId = '';

				try {
					const currentWorkspaceId = this.getCurrentNodeParameter('workspaceId');

					if (typeof currentWorkspaceId === 'string' && currentWorkspaceId.trim() !== '') {
						selectedWorkspaceId = currentWorkspaceId.trim();
					}
				} catch {
					selectedWorkspaceId = '';
				}

				const workspacesResponse = await gptMakerApiRequest.call(this, 'GET', '/v2/workspaces');
				const allWorkspaces = buildWorkspaceReferences(workspacesResponse);

				const workspacesToQuery =
					selectedWorkspaceId !== ''
						? allWorkspaces.filter((workspace) => workspace.id === selectedWorkspaceId)
						: allWorkspaces;

				const normalizedWorkspaces =
					selectedWorkspaceId !== '' && workspacesToQuery.length === 0
						? [{ id: selectedWorkspaceId, name: selectedWorkspaceId }]
						: workspacesToQuery;

				if (normalizedWorkspaces.length === 0) {
					return [];
				}

				const agentResponses = await Promise.all(
					normalizedWorkspaces.map(async (workspace) => {
						const response = await gptMakerApiRequest.call(
							this,
							'GET',
							`/v2/workspace/${workspace.id}/agents`,
						);

						return {
							workspace,
							response,
						};
					}),
				);

				const seen = new Set<string>();
				const options: INodePropertyOptions[] = [];

				for (const agentResponse of agentResponses) {
					const agentRecords = extractCollectionItems(agentResponse.response);

					for (const agentRecord of agentRecords) {
						const agentId = getFirstStringValue(agentRecord, ['id', '_id', 'agentId', 'agentID', 'uuid']);

						if (!agentId || seen.has(agentId)) {
							continue;
						}

						const agentName =
							getFirstStringValue(agentRecord, ['name', 'agentName', 'title', 'label']) ?? agentId;

						seen.add(agentId);
						options.push({
							name:
								selectedWorkspaceId === '' && normalizedWorkspaces.length > 1
									? `${agentName} (${agentResponse.workspace.name})`
									: agentName,
							value: agentId,
						});
					}
				}

				return options.sort((a, b) => a.name.localeCompare(b.name));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData;

				if (resource === 'channel') {
					responseData = await channelExecute(this, operation, i);
				} else if (resource === 'agent') {
					responseData = await agentExecute(this, operation, i);
				} else if (resource === 'workspace') {
					responseData = await workspaceExecute(this, operation, i);
				} else if (resource === 'intention') {
					responseData = await intentionExecute(this, operation, i);
				} else if (resource === 'training') {
					responseData = await trainingExecute(this, operation, i);
				} else if (resource === 'chat') {
					responseData = await chatExecute(this, operation, i);
				} else if (resource === 'interaction') {
					responseData = await interactionsExecute(this, operation, i);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as JsonObject),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}
}
