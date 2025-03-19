// Re-export types
export type {
	FormSchema,
	JSONSchema,
	RJSFUISchema,
} from './domains/rjsf/types';
export type {
	K5eField,
	K5eFieldsResponse,
	K5eClientOptions,
} from './domains/kintone/types';

// Re-export classes and factories
export { K5eClient } from './domains/kintone/client';
export { SchemaConverter } from './domains/rjsf/converter';
export { K5eToRJSF } from './domains/kintone-rjsf/converter';

import { K5eToRJSF } from './domains/kintone-rjsf/converter';
// Factory function for creating K5eToRJSF instance
import { K5eClient } from './domains/kintone/client';
import type { K5eClientOptions } from './domains/kintone/types';
import { SchemaConverter } from './domains/rjsf/converter';

/**
 * K5eToRJSFインスタンスを作成する
 */
export function createK5eToRJSF(options: K5eClientOptions): K5eToRJSF {
	const kintoneClient = new K5eClient(options);
	const schemaConverter = new SchemaConverter();
	return new K5eToRJSF(kintoneClient, schemaConverter);
}
