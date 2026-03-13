import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { gptMakerApiRequest } from '../Helpers';

export async function interactionsExecute(
	node: IExecuteFunctions,
	operation: string,
	i: number,
) {
	let responseData;

	if (operation === 'getAllByWorkspace') {
		const workspaceId = node.getNodeParameter('workspaceId', i) as string;
		if (!workspaceId) {
			throw new NodeOperationError(node.getNode(), 'Workspace ID is required.', { itemIndex: i });
		}

		responseData = await gptMakerApiRequest.call(
			node,
			'GET',
			`/v2/workspace/${workspaceId}/interactions`,
		);
	}

	if (operation === 'delete') {
		const interactionId = node.getNodeParameter('interactionId', i) as string;
		if (!interactionId) {
			throw new NodeOperationError(node.getNode(), 'Interaction ID is required.', { itemIndex: i });
		}

		responseData = await gptMakerApiRequest.call(
			node,
			'DELETE',
			`/v2/interaction/${interactionId}`,
		);
	}

	if (responseData === undefined) {
		throw new NodeOperationError(node.getNode(), `Unsupported interaction operation: ${operation}`, {
			itemIndex: i,
		});
	}

	return responseData;
}
