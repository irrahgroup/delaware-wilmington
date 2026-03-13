import {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
} from 'n8n-workflow';

export async function gptMakerApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<unknown> {
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.gptmaker.ai${endpoint}`,
		body,
		qs: query,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'gptMakerApi', options);
}
