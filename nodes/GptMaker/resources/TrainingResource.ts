import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { gptMakerApiRequest } from '../Helpers';

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

export async function trainingExecute(node: IExecuteFunctions, operation: string, i: number) {
	if (operation === 'create') {
		const agentId = node.getNodeParameter('agentId', i) as string;
		if (!agentId) {
			throw new NodeOperationError(node.getNode(), 'Agent ID is required.', { itemIndex: i });
		}

		const body: IDataObject = {
			type: node.getNodeParameter('createType', i) as string,
			text: node.getNodeParameter('text', i) as string,
		};

		const image = node.getNodeParameter('image', i, '') as string;
		const callbackUrl = node.getNodeParameter('callbackUrl', i, '') as string;

		if (isNonEmptyString(image)) body.image = image;
		if (isNonEmptyString(callbackUrl)) body.callbackUrl = callbackUrl;

		return await gptMakerApiRequest.call(node, 'POST', `/v2/agent/${agentId}/trainings`, body);
	}

	if (operation === 'getAll') {
		const agentId = node.getNodeParameter('agentId', i) as string;
		if (!agentId) {
			throw new NodeOperationError(node.getNode(), 'Agent ID is required.', { itemIndex: i });
		}

		const qs: IDataObject = {};

		const type = node.getNodeParameter('type', i) as string;
		if (!type) {
			throw new NodeOperationError(node.getNode(), 'Type is required for listing trainings.', { itemIndex: i });
		}
		qs.type = type;

		const page = node.getNodeParameter('page', i, 0) as number;
		const pageSize = node.getNodeParameter('pageSize', i, 0) as number;
		const query = node.getNodeParameter('query', i, '') as string;

		if (page && page > 0) qs.page = page;
		if (pageSize && pageSize > 0) qs.pageSize = pageSize;
		if (isNonEmptyString(query)) qs.query = query;

		return await gptMakerApiRequest.call(node, 'GET', `/v2/agent/${agentId}/trainings`, {}, qs);
	}

	if (operation === 'update') {
		const trainingId = node.getNodeParameter('trainingId', i) as string;
		if (!trainingId) {
			throw new NodeOperationError(node.getNode(), 'Training ID is required.', { itemIndex: i });
		}

		const text = node.getNodeParameter('text', i) as string;
		if (!text) {
			throw new NodeOperationError(node.getNode(), 'Text is required to update a training.', { itemIndex: i });
		}

		const body: IDataObject = {
			type: 'TEXT',
			text,
		};

		const image = node.getNodeParameter('image', i, '') as string;
		if (isNonEmptyString(image)) body.image = image;

		return await gptMakerApiRequest.call(node, 'PUT', `/v2/training/${trainingId}`, body);
	}

	if (operation === 'delete') {
		const trainingId = node.getNodeParameter('trainingId', i) as string;
		if (!trainingId) {
			throw new NodeOperationError(node.getNode(), 'Training ID is required.', { itemIndex: i });
		}

		return await gptMakerApiRequest.call(node, 'DELETE', `/v2/training/${trainingId}`);
	}

	throw new NodeOperationError(node.getNode(), `Unsupported training operation: ${operation}`, { itemIndex: i });
}
