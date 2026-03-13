import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

import { gptMakerApiRequest } from '../Helpers';

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function getFixedCollectionItems(
	node: IExecuteFunctions,
	uiParamName: string,
	listKey: string,
	itemIndex: number,
): IDataObject[] {
	const ui = node.getNodeParameter(uiParamName, itemIndex, {}) as IDataObject;
	const raw = ui[listKey] as IDataObject | IDataObject[] | undefined;
	if (!raw) return [];
	return Array.isArray(raw) ? raw : [raw];
}

function getFixedCollectionGroup(ui: IDataObject, groupName: string): IDataObject | undefined {
	const raw = ui[groupName] as IDataObject | IDataObject[] | undefined;
	if (!raw) return undefined;
	return Array.isArray(raw) ? raw[0] : raw;
}

function buildNameValueArray(items: IDataObject[]): Array<{ name: string; value: string }> {
	return items
		.map((it) => ({
			name: String(it.name ?? '').trim(),
			value: String(it.value ?? ''),
		}))
		.filter((it) => it.name.length > 0);
}

function buildFieldsArray(items: IDataObject[]): Array<IDataObject> {
	return items
		.map((it) => {
			const field: IDataObject = {
				name: String(it.name ?? '').trim(),
				jsonName: String(it.jsonName ?? '').trim(),
				type: it.type,
				required: Boolean(it.required),
			};

			const description = String(it.description ?? '').trim();
			if (description) field.description = description;

			if (!field.name || !field.jsonName) return null;
			return field;
		})
		.filter((f): f is IDataObject => f !== null);
}

function buildVariablesArray(items: IDataObject[]): IDataObject[] {
	return items
		.map((it) => {
			const valueExpression = String(it.valueExpression ?? '').trim();
			const defaultFieldKey = String(it.defaultFieldKey ?? '').trim();

			const customFieldRaw = it.customField;
			const customFieldUi =
				typeof customFieldRaw === 'object' && customFieldRaw !== null && !Array.isArray(customFieldRaw)
					? (customFieldRaw as IDataObject)
					: undefined;
			const customFieldGroup = customFieldUi ? getFixedCollectionGroup(customFieldUi, 'field') : undefined;

			const customField: IDataObject = {};
			if (customFieldGroup) {
				const id = String(customFieldGroup.id ?? '').trim();
				const name = String(customFieldGroup.name ?? '').trim();
				const description = String(customFieldGroup.description ?? '').trim();
				const type = customFieldGroup.type;
				const jsonName = String(customFieldGroup.jsonName ?? '').trim();

				if (id) customField.id = id;
				if (name) customField.name = name;
				if (description) customField.description = description;
				if (type) customField.type = type;
				if (jsonName) customField.jsonName = jsonName;
			}

			const hasCustomField = Object.keys(customField).length > 0;

			if (!hasCustomField) return null;
			if (!valueExpression && !defaultFieldKey) return null;

			const variable: IDataObject = {
				customField,
			};

			if (valueExpression) variable.valueExpression = valueExpression;
			if (defaultFieldKey) variable.defaultFieldKey = defaultFieldKey;

			return variable;
		})
		.filter((v): v is IDataObject => v !== null);
}

function buildRequestBodyObject(items: IDataObject[]): IDataObject {
	const out: IDataObject = {};
	for (const it of items) {
		const key = String(it.key ?? '').trim();
		if (!key) continue;
		const value = it.value;

		if (typeof value === 'string') {
			const trimmed = value.trim();

			if (trimmed === 'true') {
				out[key] = true;
				continue;
			}
			if (trimmed === 'false') {
				out[key] = false;
				continue;
			}
			if (trimmed === 'null') {
				out[key] = null;
				continue;
			}
			if (!Number.isNaN(Number(trimmed)) && trimmed !== '') {

				out[key] = Number(trimmed);
				continue;
			}
			if (
				(trimmed.startsWith('{') && trimmed.endsWith('}')) ||
				(trimmed.startsWith('[') && trimmed.endsWith(']'))
			) {
				try {
					out[key] = JSON.parse(trimmed);
					continue;
				} catch {
					out[key] = value;
					continue;
				}
			}
			out[key] = value;
			continue;
		}

		out[key] = value;
	}
	return out;
}

export async function intentionExecute(node: IExecuteFunctions, operation: string, i: number) {
	if (operation === 'list') {
		const agentId = node.getNodeParameter('agentId', i) as string;
		if (!agentId) throw new NodeOperationError(node.getNode(), 'Agent ID is required.', { itemIndex: i });

		const qs: IDataObject = {};
		const page = node.getNodeParameter('page', i, 0) as number;
		const pageSize = node.getNodeParameter('pageSize', i, 0) as number;
		const query = node.getNodeParameter('query', i, '') as string;

		if (page && page > 0) qs.page = page;
		if (pageSize && pageSize > 0) qs.pageSize = pageSize;
		if (isNonEmptyString(query)) qs.query = query;

		return await gptMakerApiRequest.call(node, 'GET', `/v2/agent/${agentId}/intentions`, {}, qs);
	}

	if (operation === 'create') {
		const agentId = node.getNodeParameter('agentId', i) as string;
		if (!agentId) throw new NodeOperationError(node.getNode(), 'Agent ID is required.', { itemIndex: i });

		const type = node.getNodeParameter('type', i) as string;

		const body: IDataObject = {
			description: node.getNodeParameter('description', i) as string,
			type,
		};

		const details = node.getNodeParameter('details', i, '') as string;
		if (isNonEmptyString(details)) body.details = details;

		if (type === 'INSTRUCTIONS') {
			const instructions = node.getNodeParameter('instructions', i, '') as string;
			if (!isNonEmptyString(instructions)) {
				throw new NodeOperationError(node.getNode(), 'Instructions is required when Type is INSTRUCTIONS.', {
					itemIndex: i,
				});
			}
			body.instructions = instructions;
			return await gptMakerApiRequest.call(node, 'POST', `/v2/agent/${agentId}/intentions`, body);
		}

		
		body.httpMethod = node.getNodeParameter('httpMethod', i) as string;
		body.url = node.getNodeParameter('url', i) as string;
		body.autoGenerateParams = node.getNodeParameter('autoGenerateParams', i) as boolean;
		body.autoGenerateBody = node.getNodeParameter('autoGenerateBody', i) as boolean;

		const headersItems = getFixedCollectionItems(node, 'headersUi', 'headersValues', i);
		const paramsItems = getFixedCollectionItems(node, 'paramsUi', 'paramsValues', i);
		const fieldsItems = getFixedCollectionItems(node, 'fieldsUi', 'fieldsValues', i);
		const varsItems = getFixedCollectionItems(node, 'variablesUi', 'variablesValues', i);
		const rbItems = getFixedCollectionItems(node, 'requestBodyUi', 'requestBodyValues', i);

		const headers = buildNameValueArray(headersItems);
		const params = buildNameValueArray(paramsItems);
		const fields = buildFieldsArray(fieldsItems);
		const variables = buildVariablesArray(varsItems);

		if (headers.length) body.headers = headers;
		if (params.length) body.params = params;
		if (fields.length) body.fields = fields;
		if (variables.length) body.variables = variables;

		if (rbItems.length) {
			const rbObj = buildRequestBodyObject(rbItems);
			body.requestBody = JSON.stringify(rbObj);
		}

		return await gptMakerApiRequest.call(node, 'POST', `/v2/agent/${agentId}/intentions`, body);
	}

	if (operation === 'update') {
		const intentionId = node.getNodeParameter('intentionId', i) as string;
		if (!intentionId) throw new NodeOperationError(node.getNode(), 'Intention ID is required.', { itemIndex: i });

		const body: IDataObject = { id: intentionId };

		const updateFields = node.getNodeParameter('updateFields', i, {}) as IDataObject;
		const rawFields = updateFields.fields as IDataObject | IDataObject[] | undefined;
		const fieldsObj: IDataObject | undefined = Array.isArray(rawFields) ? rawFields[0] : rawFields;

		if (fieldsObj && Object.keys(fieldsObj).length) {
			for (const [k, v] of Object.entries(fieldsObj)) {
				if (typeof v === 'string' && v.trim() === '') continue;
				body[k] = v;
			}
		}

		if (body.type && body.type !== 'WEBHOOK') {
			throw new NodeOperationError(node.getNode(), 'Update supports only type WEBHOOK (per GPTMaker docs).', {
				itemIndex: i,
			});
		}

		const headersItems = getFixedCollectionItems(node, 'updateHeadersUi', 'headersValues', i);
		const paramsItems = getFixedCollectionItems(node, 'updateParamsUi', 'paramsValues', i);
		const fieldsItems = getFixedCollectionItems(node, 'updateFieldsUi', 'fieldsValues', i);
		const varsItems = getFixedCollectionItems(node, 'updateVariablesUi', 'variablesValues', i);
		const rbItems = getFixedCollectionItems(node, 'updateRequestBodyUi', 'requestBodyValues', i);

		const headers = buildNameValueArray(headersItems);
		const params = buildNameValueArray(paramsItems);
		const fields = buildFieldsArray(fieldsItems);
		const variables = buildVariablesArray(varsItems);

		if (headers.length) body.headers = headers;
		if (params.length) body.params = params;
		if (fields.length) body.fields = fields;
		if (variables.length) body.variables = variables;

		if (rbItems.length) {
			const rbObj = buildRequestBodyObject(rbItems);
			body.requestBody = JSON.stringify(rbObj);
		}

		if (Object.keys(body).length <= 1) {
			throw new NodeOperationError(
				node.getNode(),
				'No update data provided. Add at least one Update Field or add items in Update Headers/Params/Fields/Variables/Request Body.',
				{ itemIndex: i },
			);
		}

		return await gptMakerApiRequest.call(node, 'PUT', `/v2/intention/${intentionId}`, body);
	}

	if (operation === 'delete') {
		const intentionId = node.getNodeParameter('intentionId', i) as string;
		if (!intentionId) throw new NodeOperationError(node.getNode(), 'Intention ID is required.', { itemIndex: i });

		return await gptMakerApiRequest.call(node, 'DELETE', `/v2/intention/${intentionId}`);
	}

	throw new NodeOperationError(node.getNode(), `Unsupported intention operation: ${operation}`, { itemIndex: i });
}
