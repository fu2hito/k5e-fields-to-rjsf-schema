import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import type { K5eField, K5eFieldsResponse } from '../kintone/types';
import type { Branded, Result } from '../types';

/**
 * JSONスキーマの型定義
 */
export type JSONSchema = Branded<
	RJSFSchema & {
		properties?: Record<string, JSONSchema>;
	},
	'JSONSchema'
>;

/**
 * UIスキーマの型定義
 */
export type RJSFUISchema = Branded<
	UiSchema & {
		[key: string]: unknown;
	},
	'RJSFUISchema'
>;

export type RJSFUISchemaMap = {
	[key: string]: RJSFUISchema;
};

export type RJSFUISchemaObject = Branded<
	RJSFUISchemaMap & {
		_brand: 'RJSFUISchema';
	},
	'RJSFUISchema'
>;

/**
 * RJSFのエラー型定義
 */
export type RJSFError =
	| { type: 'SCHEMA_ERROR'; message: string }
	| { type: 'VALIDATION_ERROR'; message: string }
	| { type: 'CONVERSION_ERROR'; message: string };

/**
 * スキーマコンバーターのインターフェース
 */
export interface SchemaConverterInterface {
	convertToJSONSchema(fields: K5eFieldsResponse): Result<JSONSchema, RJSFError>;
	generateUISchema(
		fields: K5eFieldsResponse,
	): Result<RJSFUISchemaObject, RJSFError>;
	convertFieldToSchemaProperty(field: K5eField): Result<JSONSchema, RJSFError>;
	generateFieldUISchema(field: K5eField): Result<RJSFUISchema, RJSFError>;
}

/**
 * 最終的なフォームスキーマの型定義
 */
export interface FormSchema {
	jsonSchema: JSONSchema;
	uiSchema: RJSFUISchema;
}
