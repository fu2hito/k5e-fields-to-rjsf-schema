import type { K5eField, K5eFieldsResponse } from '../kintone/types';
import { FIELD_SUPPORT_STATUS } from '../kintone/types';
import type { Result } from '../types';
import type {
	JSONSchema,
	RJSFError,
	RJSFUISchema,
	RJSFUISchemaMap,
	RJSFUISchemaObject,
	SchemaConverterInterface,
} from './types';

/**
 * RJSFスキーマコンバーターの実装
 */
export class SchemaConverter implements SchemaConverterInterface {
	/**
	 * JSONスキーマに変換する
	 */
	convertToJSONSchema(
		fields: K5eFieldsResponse,
	): Result<JSONSchema, RJSFError> {
		try {
			const schema: JSONSchema = {
				type: 'object',
				required: [] as string[],
				properties: {} as Record<string, JSONSchema>,
				_brand: 'JSONSchema' as const,
			};

			for (const [fieldCode, field] of Object.entries(fields.properties)) {
				if (field.required) {
					schema.required.push(fieldCode);
				}

				const result = this.convertFieldToSchemaProperty(field);
				if (!result.ok) return result;

				if (schema.properties) {
					schema.properties[fieldCode] = result.value;
				}
			}

			return { ok: true, value: schema };
		} catch (error) {
			return {
				ok: false,
				error: {
					type: 'CONVERSION_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
	}

	/**
	 * UIスキーマを生成する
	 */
	generateUISchema(
		fields: K5eFieldsResponse,
	): Result<RJSFUISchemaObject, RJSFError> {
		try {
			const uiSchema = {} as RJSFUISchemaMap;

			for (const [fieldCode, field] of Object.entries(fields.properties)) {
				const result = this.generateFieldUISchema(field);
				if (!result.ok) return result;

				uiSchema[fieldCode] = result.value;
			}

			return {
				ok: true,
				value: {
					...uiSchema,
					_brand: 'RJSFUISchema' as const,
				} as RJSFUISchemaObject,
			};
		} catch (error) {
			return {
				ok: false,
				error: {
					type: 'CONVERSION_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
	}

	/**
	 * 個別のフィールドをJSONスキーマのプロパティに変換する
	 */
	convertFieldToSchemaProperty(field: K5eField): Result<JSONSchema, RJSFError> {
		try {
			// サポート対象外のフィールドの場合は空のオブジェクトを返す
			if (!FIELD_SUPPORT_STATUS[field.type].supported) {
				console.warn(`Skipping unsupported field type: ${field.type}`);
				return {
					ok: true,
					value: { type: 'null', _brand: 'JSONSchema' as const },
				};
			}

			switch (field.type) {
				case 'SINGLE_LINE_TEXT': {
					const schema: JSONSchema = {
						type: 'string',
						title: field.label,
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'MULTI_LINE_TEXT':
				case 'RICH_TEXT': {
					const schema: JSONSchema = {
						type: 'string',
						title: field.label,
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'NUMBER': {
					const schema: JSONSchema = {
						type: 'number',
						title: field.label,
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'CHECK_BOX': {
					const schema: JSONSchema = {
						type: 'array',
						title: field.label,
						uniqueItems: true,
						items: {
							type: 'string',
							enum: field.options || [],
						},
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'RADIO_BUTTON': {
					const schema: JSONSchema = {
						type: 'string',
						title: field.label,
						enum: field.options || [],
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'DROP_DOWN': {
					const schema: JSONSchema = {
						type: 'string',
						title: field.label,
						enum: field.options || [],
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'MULTI_SELECT': {
					const schema: JSONSchema = {
						type: 'array',
						title: field.label,
						items: {
							type: 'string',
							enum: field.options || [],
						},
						uniqueItems: true,
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'DATE': {
					const schema: JSONSchema = {
						type: 'string',
						format: 'date',
						title: field.label,
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'TIME': {
					const schema: JSONSchema = {
						type: 'string',
						format: 'time',
						title: field.label,
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'DATETIME': {
					const schema: JSONSchema = {
						type: 'string',
						format: 'date-time',
						title: field.label,
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'FILE': {
					const schema: JSONSchema = {
						type: 'string',
						title: field.label,
						format: 'data-url',
						_brand: 'JSONSchema' as const,
					};
					return { ok: true, value: schema };
				}

				default:
					return {
						ok: false,
						error: {
							type: 'CONVERSION_ERROR',
							message: `Unsupported field type: ${field.type}`,
						},
					};
			}
		} catch (error) {
			return {
				ok: false,
				error: {
					type: 'CONVERSION_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
	}

	/**
	 * 個別のフィールドのUIスキーマを生成する
	 */
	generateFieldUISchema(field: K5eField): Result<RJSFUISchema, RJSFError> {
		try {
			if (!FIELD_SUPPORT_STATUS[field.type].supported) {
				console.warn(`Skipping unsupported field type: ${field.type}`);
				return { ok: true, value: { _brand: 'RJSFUISchema' as const } };
			}

			switch (field.type) {
				case 'MULTI_LINE_TEXT': {
					const schema: RJSFUISchema = {
						'ui:widget': 'textarea',
						'ui:options': {
							rows: 5,
						},
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'RICH_TEXT': {
					const schema: RJSFUISchema = {
						'ui:widget': 'textarea',
						'ui:options': {
							rows: 8,
						},
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'RADIO_BUTTON': {
					const schema: RJSFUISchema = {
						'ui:widget': 'radio',
						'ui:options': {
							inline: true,
						},
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'DATE': {
					const schema: RJSFUISchema = {
						'ui:widget': 'date',
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'TIME': {
					const schema: RJSFUISchema = {
						'ui:widget': 'time',
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'DATETIME': {
					// DATETIMEはデフォルトのwidgetを使用
					return { ok: true, value: { _brand: 'RJSFUISchema' as const } };
				}

				case 'CHECK_BOX': {
					const schema: RJSFUISchema = {
						'ui:widget': 'checkboxes',
						'ui:options': {
							inline: true,
						},
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'DROP_DOWN': {
					const schema: RJSFUISchema = {
						'ui:widget': 'select',
						'ui:placeholder': '選択してください',
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'MULTI_SELECT': {
					const schema: RJSFUISchema = {
						'ui:widget': 'checkboxes',
						'ui:options': {
							inline: true,
						},
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				case 'FILE': {
					const schema: RJSFUISchema = {
						'ui:widget': 'file',
						_brand: 'RJSFUISchema' as const,
					};
					return { ok: true, value: schema };
				}

				default:
					return { ok: true, value: { _brand: 'RJSFUISchema' as const } };
			}
		} catch (error) {
			return {
				ok: false,
				error: {
					type: 'CONVERSION_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
	}
}
