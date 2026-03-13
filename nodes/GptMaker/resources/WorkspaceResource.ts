import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { gptMakerApiRequest } from '../Helpers';

export async function workspaceExecute(node: IExecuteFunctions, operation: string, i: number) {
	if (operation === 'getAll') {
		return await gptMakerApiRequest.call(node, 'GET', '/v2/workspaces');
	}

	if (operation === 'getCredits') {
		const workspaceId = node.getNodeParameter('workspaceId', i) as string;
		if (!workspaceId) {
			throw new NodeOperationError(node.getNode(), 'Workspace ID is required.', { itemIndex: i });
		}
		return await gptMakerApiRequest.call(node, 'GET', `/v2/workspace/${workspaceId}/credits`);
	}

	throw new NodeOperationError(node.getNode(), `Unsupported workspace operation: ${operation}`, { itemIndex: i });
}
