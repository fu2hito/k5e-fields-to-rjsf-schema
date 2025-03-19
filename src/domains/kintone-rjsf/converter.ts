import type { K5eClientInterface } from '../kintone/types';
import type { SchemaConverterInterface } from '../rjsf/types';
import type { FormSchema } from '../rjsf/types';
import type { Result } from '../types';

/**
 * k5e-fields-to-rjsf-schema変換クラス
 * K5eClientとSchemaConverterを使用してフォームスキーマを生成する
 */
export class K5eToRJSF {
	constructor(
		private readonly kintoneClient: K5eClientInterface,
		private readonly schemaConverter: SchemaConverterInterface,
	) {}

	/**
	 * アプリIDからJSONスキーマとUIスキーマを一括生成する
	 */
	async generateFormSchema(appId: number): Promise<Result<FormSchema, Error>> {
		try {
			const fieldsResult = await this.kintoneClient.getFields(appId);
			if (!fieldsResult.ok) {
				return {
					ok: false,
					error: new Error(fieldsResult.error.message),
				};
			}
			console.info('fieldsResult.value', fieldsResult.value);

			const jsonSchemaResult = this.schemaConverter.convertToJSONSchema(
				fieldsResult.value,
			);
			if (!jsonSchemaResult.ok) {
				return {
					ok: false,
					error: new Error(jsonSchemaResult.error.message),
				};
			}

			const uiSchemaResult = this.schemaConverter.generateUISchema(
				fieldsResult.value,
			);
			if (!uiSchemaResult.ok) {
				return {
					ok: false,
					error: new Error(uiSchemaResult.error.message),
				};
			}

			return {
				ok: true,
				value: {
					jsonSchema: jsonSchemaResult.value,
					uiSchema: uiSchemaResult.value,
				},
			};
		} catch (error) {
			return {
				ok: false,
				error:
					error instanceof Error ? error : new Error('Unknown error occurred'),
			};
		}
	}
}
