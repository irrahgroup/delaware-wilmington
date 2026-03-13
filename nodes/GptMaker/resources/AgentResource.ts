import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { gptMakerApiRequest } from '../Helpers';

function nonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function pickFixedCollectionValues(param: IDataObject, key: string): IDataObject | undefined {
	const raw = param[key] as IDataObject | IDataObject[] | undefined;
	return Array.isArray(raw) ? raw[0] : raw;
}

function removeEmptyStringsAndZeroSentinels(obj: IDataObject, zeroSentinelKeys: string[] = []) {
	for (const [k, v] of Object.entries(obj)) {
		if (typeof v === 'string' && v.trim() === '') {
			delete obj[k];
		}
	}
	for (const k of zeroSentinelKeys) {
		if (obj[k] === 0) {
			delete obj[k];
		}
	}
}

export async function agentExecute(node: IExecuteFunctions, operation: string, i: number) {
	if (operation === 'getAll') {
		const workspaceId = node.getNodeParameter('workspaceId', i) as string;
		if (!workspaceId) {
			throw new NodeOperationError(node.getNode(), 'Workspace ID is required.', { itemIndex: i });
		}
		return await gptMakerApiRequest.call(node, 'GET', `/v2/workspace/${workspaceId}/agents`);
	}

	if (operation === 'create') {
		const workspaceId = node.getNodeParameter('workspaceId', i) as string;
		if (!workspaceId) {
			throw new NodeOperationError(node.getNode(), 'Workspace ID is required.', { itemIndex: i });
		}

		const body: IDataObject = {
			name: node.getNodeParameter('name', i) as string,
			behavior: node.getNodeParameter('behavior', i) as string,
			communicationType: node.getNodeParameter('communicationType', i) as string,
			type: node.getNodeParameter('agentType', i) as string,
		};

		const avatar = node.getNodeParameter('avatar', i, '') as string;
		const jobName = node.getNodeParameter('jobName', i, '') as string;
		const jobSite = node.getNodeParameter('jobSite', i, '') as string;
		const jobDescription = node.getNodeParameter('jobDescription', i, '') as string;

		if (nonEmptyString(avatar)) body.avatar = avatar;
		if (nonEmptyString(jobName)) body.jobName = jobName;
		if (nonEmptyString(jobSite)) body.jobSite = jobSite;
		if (nonEmptyString(jobDescription)) body.jobDescription = jobDescription;

		return await gptMakerApiRequest.call(node, 'POST', `/v2/workspace/${workspaceId}/agents`, body);
	}
	const agentId = node.getNodeParameter('agentId', i) as string;
	if (!agentId) {
		throw new NodeOperationError(node.getNode(), 'Agent ID is required.', { itemIndex: i });
	}

	if (operation === 'getById') {
		return await gptMakerApiRequest.call(node, 'GET', `/v2/agent/${agentId}`);
	}

	if (operation === 'delete') {
		return await gptMakerApiRequest.call(node, 'DELETE', `/v2/agent/${agentId}`);
	}

	if (operation === 'inactivate') {
		return await gptMakerApiRequest.call(node, 'PUT', `/v2/agent/${agentId}/inactive`);
	}

	if (operation === 'activate') {
		return await gptMakerApiRequest.call(node, 'PUT', `/v2/agent/${agentId}/active`);
	}

	if (operation === 'getWebhooks') {
		return await gptMakerApiRequest.call(node, 'GET', `/v2/agent/${agentId}/webhooks`);
	}

	if (operation === 'updateWebhooks') {
		const webhooks = node.getNodeParameter('webhooks', i, {}) as IDataObject;
		const values = pickFixedCollectionValues(webhooks, 'values');

		if (!values || Object.keys(values).length === 0) {
			throw new NodeOperationError(
				node.getNode(),
				'Webhooks is empty. Add at least one webhook URL to update.',
				{ itemIndex: i },
			);
		}

		const body: IDataObject = { ...(values as IDataObject) };
		removeEmptyStringsAndZeroSentinels(body);

		if (Object.keys(body).length === 0) {
			throw new NodeOperationError(
				node.getNode(),
				'All provided webhook URLs are empty. Fill at least one URL.',
				{ itemIndex: i },
			);
		}

		return await gptMakerApiRequest.call(node, 'PUT', `/v2/agent/${agentId}/webhooks`, body);
	}

	if (operation === 'getSettings') {
		return await gptMakerApiRequest.call(node, 'GET', `/v2/agent/${agentId}/settings`);
	}

	if (operation === 'updateSettings') {
		const settings = node.getNodeParameter('settings', i, {}) as IDataObject;
		const values = pickFixedCollectionValues(settings, 'values');

		if (!values || Object.keys(values).length === 0) {
			throw new NodeOperationError(
				node.getNode(),
				'Settings is empty. Add at least one setting to update.',
				{ itemIndex: i },
			);
		}

		const body: IDataObject = { ...(values as IDataObject) };

		removeEmptyStringsAndZeroSentinels(body, ['maxDailyMessages']);

		if (body.maxDailyMessages === undefined) {
			delete body.maxDailyMessagesLimitAction;
		}

		if (Object.keys(body).length === 0) {
			throw new NodeOperationError(
				node.getNode(),
				'All provided settings are empty (or omitted). Fill at least one setting.',
				{ itemIndex: i },
			);
		}

		return await gptMakerApiRequest.call(node, 'PUT', `/v2/agent/${agentId}/settings`, body);
	}

	if (operation === 'addMessage') {
		const body: IDataObject = {
			contextId: node.getNodeParameter('contextId', i) as string,
			prompt: node.getNodeParameter('prompt', i) as string,
			role: node.getNodeParameter('role', i, 'assistant') as string,
		};

		return await gptMakerApiRequest.call(node, 'POST', `/v2/agent/${agentId}/add-message`, body);
	}

	if (operation === 'conversation') {
		const body: IDataObject = {
			contextId: node.getNodeParameter('conversationContextId', i) as string,
			prompt: node.getNodeParameter('conversationPrompt', i) as string,
		};

		const callbackUrl = node.getNodeParameter('callbackUrl', i, '') as string;
		const onFinishCallback = node.getNodeParameter('onFinishCallback', i, '') as string;
		const chatName = node.getNodeParameter('chatName', i, '') as string;
		const chatPicture = node.getNodeParameter('chatPicture', i, '') as string;
		const phone = node.getNodeParameter('phone', i, '') as string;

		if (nonEmptyString(callbackUrl)) body.callbackUrl = callbackUrl;
		if (nonEmptyString(onFinishCallback)) body.onFinishCallback = onFinishCallback;
		if (nonEmptyString(chatName)) body.chatName = chatName;
		if (nonEmptyString(chatPicture)) body.chatPicture = chatPicture;
		if (nonEmptyString(phone)) body.phone = phone;

		return await gptMakerApiRequest.call(node, 'POST', `/v2/agent/${agentId}/conversation`, body);
	}

	if (operation === 'getCreditsSpent') {
		const qs: IDataObject = {};

		const creditsSpentDate = node.getNodeParameter('creditsSpentDate', i, '') as string;
		if (nonEmptyString(creditsSpentDate)) {
			const dateMatch = creditsSpentDate.match(/^(\d{4})-(\d{2})-(\d{2})/);

			if (dateMatch) {
				qs.year = Number(dateMatch[1]);
				qs.month = Number(dateMatch[2]);
				qs.day = Number(dateMatch[3]);
			} else {
				const parsedDate = new Date(creditsSpentDate);

				if (!Number.isNaN(parsedDate.getTime())) {
					qs.year = parsedDate.getUTCFullYear();
					qs.month = parsedDate.getUTCMonth() + 1;
					qs.day = parsedDate.getUTCDate();
				}
			}
		}

		return await gptMakerApiRequest.call(node, 'GET', `/v2/agent/${agentId}/credits-spent`, {}, qs);
	}

	if (operation === 'update') {
		const updateFields = node.getNodeParameter('updateFields', i, {}) as IDataObject;
		const rawFields = updateFields.fields as IDataObject | IDataObject[] | undefined;
		const fields: IDataObject | undefined = Array.isArray(rawFields) ? rawFields[0] : rawFields;

		if (!fields || Object.keys(fields).length === 0) {
			throw new NodeOperationError(
				node.getNode(),
				'Update Fields is empty. Add at least one field to update.',
				{ itemIndex: i },
			);
		}

		if (fields.agentType) {
			fields.type = fields.agentType;
			delete fields.agentType;
		}

		for (const [k, v] of Object.entries(fields)) {
			if (typeof v === 'string' && v.trim() === '') {
				delete fields[k];
			}
		}

		if (Object.keys(fields).length === 0) {
			throw new NodeOperationError(
				node.getNode(),
				'All provided update fields are empty. Fill at least one field.',
				{ itemIndex: i },
			);
		}

		return await gptMakerApiRequest.call(node, 'PUT', `/v2/agent/${agentId}`, fields);
	}

	throw new NodeOperationError(node.getNode(), `Unsupported agent operation: ${operation}`, { itemIndex: i });
}
