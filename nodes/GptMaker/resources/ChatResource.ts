import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { gptMakerApiRequest } from '../Helpers';

export async function chatExecute(node: IExecuteFunctions, operation: string, i: number) {
	let responseData;

	switch (operation) {
		case 'getAll': {
			const workspaceId = node.getNodeParameter('workspaceId', i) as string;

			const query: IDataObject = {};
			const agentId = node.getNodeParameter('agentId', i, '') as string;
			const page = node.getNodeParameter('page', i, 0) as number;
			const pageSize = node.getNodeParameter('pageSize', i, 0) as number;
			const searchQuery = node.getNodeParameter('query', i, '') as string;

			if (agentId) query.agentId = agentId;
			if (page) query.page = page;
			if (pageSize) query.pageSize = pageSize;
			if (searchQuery) query.query = searchQuery;

			responseData = await gptMakerApiRequest.call(
				node,
				'GET',
				`/v2/workspace/${workspaceId}/chats`,
				{},
				query,
			);
			break;
		}

		case 'getMessages': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			responseData = await gptMakerApiRequest.call(node, 'GET', `/v2/chat/${chatId}/messages`);
			break;
		}

		case 'deleteChat': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			responseData = await gptMakerApiRequest.call(node, 'DELETE', `/v2/chat/${chatId}`);
			break;
		}

		case 'deleteMessages': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			responseData = await gptMakerApiRequest.call(node, 'DELETE', `/v2/chat/${chatId}/messages`);
			break;
		}

		case 'assumirAtendimento': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			responseData = await gptMakerApiRequest.call(node, 'PUT', `/v2/chat/${chatId}/start-human`);
			break;
		}

		case 'encerrarAtendimento': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			responseData = await gptMakerApiRequest.call(node, 'PUT', `/v2/chat/${chatId}/stop-human`);
			break;
		}

		case 'sendMessage': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			const message = node.getNodeParameter('messageText', i) as string;
			const replyMessageId = node.getNodeParameter('replyMessageId', i, '') as string;

			const body: IDataObject = { message };
			if (replyMessageId) body.replyMessageId = replyMessageId;

			responseData = await gptMakerApiRequest.call(
				node,
				'POST',
				`/v2/chat/${chatId}/send-message`,
				body,
			);
			break;
		}

		case 'deleteMessage': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			const messageId = node.getNodeParameter('messageId', i) as string;
			responseData = await gptMakerApiRequest.call(
				node,
				'DELETE',
				`/v2/chat/${chatId}/message/${messageId}`,
			);
			break;
		}

		case 'editMessage': {
			const chatId = node.getNodeParameter('chatId', i) as string;
			const messageId = node.getNodeParameter('messageId', i) as string;
			const message = node.getNodeParameter('messageText', i) as string;

			const body: IDataObject = { message };

			responseData = await gptMakerApiRequest.call(
				node,
				'PUT',
				`/v2/chat/${chatId}/message/${messageId}`,
				body,
			);
			break;
		}

		default:
			throw new NodeOperationError(node.getNode(), `Unsupported chat operation: ${operation}`, {
				itemIndex: i,
			});
	}

	return responseData;
}
