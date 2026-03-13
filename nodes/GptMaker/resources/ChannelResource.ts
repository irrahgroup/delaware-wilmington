import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { gptMakerApiRequest } from '../Helpers';

function getFixedCollectionFields(input: IDataObject): IDataObject | undefined {
	const raw = input.fields as IDataObject | IDataObject[] | undefined;
	return Array.isArray(raw) ? raw[0] : raw;
}

export async function channelExecute(node: IExecuteFunctions, operation: string, i: number) {
	if (operation === 'getAllByWorkspace') {
		const workspaceId = node.getNodeParameter('workspaceId', i) as string;
		if (!workspaceId) {
			throw new NodeOperationError(node.getNode(), 'Workspace ID is required.', { itemIndex: i });
		}
		return await gptMakerApiRequest.call(node, 'GET', `/v2/workspace/${workspaceId}/channels`);
	}

	if (operation === 'create') {
		const agentId = node.getNodeParameter('agentId', i) as string;
		if (!agentId) {
			throw new NodeOperationError(node.getNode(), 'Agent ID is required.', { itemIndex: i });
		}

		const body: IDataObject = {
			name: node.getNodeParameter('name', i) as string,
			type: node.getNodeParameter('type', i) as string,
		};

		return await gptMakerApiRequest.call(node, 'POST', `/v2/agent/${agentId}/create-channel`, body);
	}

	if (operation === 'createInWorkspace') {
		const workspaceId = node.getNodeParameter('workspaceId', i) as string;
		const agentId = node.getNodeParameter('agentId', i) as string;

		if (!workspaceId) {
			throw new NodeOperationError(node.getNode(), 'Workspace ID is required.', { itemIndex: i });
		}
		if (!agentId) {
			throw new NodeOperationError(node.getNode(), 'Agent ID is required.', { itemIndex: i });
		}

		const body: IDataObject = {
			agentId,
			name: node.getNodeParameter('name', i) as string,
			type: node.getNodeParameter('type', i) as string,
		};

		return await gptMakerApiRequest.call(node, 'POST', `/v2/workspace/${workspaceId}/create-channel`, body);
	}

	const channelId = node.getNodeParameter('channelId', i) as string;
	if (!channelId) {
		throw new NodeOperationError(node.getNode(), 'Channel ID is required.', { itemIndex: i });
	}

	if (operation === 'delete') {
		return await gptMakerApiRequest.call(node, 'DELETE', `/v2/channel/${channelId}`);
	}

	if (operation === 'update') {
		const updateFields = node.getNodeParameter('updateFields', i, {}) as IDataObject;
		const fields = getFixedCollectionFields(updateFields);

		if (!fields || Object.keys(fields).length === 0) {
			throw new NodeOperationError(node.getNode(), 'Update Fields is empty. Name is required.', {
				itemIndex: i,
			});
		}

		const body: IDataObject = {};
		const nameValue = fields.name;

		if (typeof nameValue !== 'string' || nameValue.trim() === '') {
			throw new NodeOperationError(node.getNode(), 'Name is required and cannot be empty.', {
				itemIndex: i,
			});
		}
		body.name = nameValue.trim();

		if ('agentId' in fields) {
			const agentIdValue = fields.agentId;

			if (agentIdValue === null) {
				body.agentId = null;
			} else if (typeof agentIdValue === 'string') {
				const trimmedAgentId = agentIdValue.trim();
				body.agentId = trimmedAgentId === '' ? null : trimmedAgentId;
			} else {
				throw new NodeOperationError(node.getNode(), 'Agent ID must be a string or null.', {
					itemIndex: i,
				});
			}
		}

		return await gptMakerApiRequest.call(node, 'PUT', `/v2/channel/${channelId}`, body);
	}

	if (operation === 'getConfig') {
		return await gptMakerApiRequest.call(node, 'GET', `/v2/channel/${channelId}/config`);
	}

	if (operation === 'updateConfig') {
		const configFields = node.getNodeParameter('configFields', i, {}) as IDataObject;
		const fields = getFixedCollectionFields(configFields);

		if (!fields || Object.keys(fields).length === 0) {
			throw new NodeOperationError(node.getNode(), 'Config Fields is empty. Add at least one config field.', {
				itemIndex: i,
			});
		}

		const nullableStringFields = new Set<string>([
			'audioAction',
			'startTrigger',
			'endTrigger',
			'replyGroupsType',
			'callRejectMessage',
			'takeOutsideServiceMember',
			'takeOutsideServiceCommand',
			'takeOutsideServiceMessage',
			'takeOutsideServiceReturnMessage',
			'waitingMessageText',
			'commentsReplyAllInstruction',
			'commentsCallDirectInstruction',
		]);

		const body: IDataObject = {};

		for (const [key, value] of Object.entries(fields)) {
			if (typeof value === 'string') {
				const trimmed = value.trim();

				if (trimmed === '') {
					if (nullableStringFields.has(key)) {
						body[key] = null;
					}
					continue;
				}

				body[key] = trimmed;
				continue;
			}

			body[key] = value;
		}

		if (Object.keys(body).length === 0) {
			throw new NodeOperationError(node.getNode(), 'All provided config fields are empty.', { itemIndex: i });
		}

		return await gptMakerApiRequest.call(node, 'PUT', `/v2/channel/${channelId}/config`, body);
	}

	throw new NodeOperationError(node.getNode(), `Unsupported channel operation: ${operation}`, { itemIndex: i });
}
