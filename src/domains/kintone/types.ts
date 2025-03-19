export type FieldType = K5eFieldType;

export interface K5eApiField {
	type: FieldType;
	code: string;
	label: string;
	noLabel?: boolean;
	required?: boolean;
	defaultValue?: string | number;
	options?: string[];
}

export interface K5eClientOptions {
	domain: string;
	apiToken?: string;
}

export type K5eError = {
	type: 'API_ERROR' | 'NOT_FOUND_ERROR';
	message: string;
};

export type K5eFieldType =
	| 'CALC'
	| 'CATEGORY'
	| 'CHECK_BOX'
	| 'CREATED_TIME'
	| 'CREATOR'
	| 'DATE'
	| 'DATETIME'
	| 'DROP_DOWN'
	| 'FILE'
	| 'GROUP'
	| 'GROUP_SELECT'
	| 'LINK'
	| 'MODIFIER'
	| 'MULTI_LINE_TEXT'
	| 'MULTI_SELECT'
	| 'NUMBER'
	| 'ORGANIZATION_SELECT'
	| 'RADIO_BUTTON'
	| 'RECORD_NUMBER'
	| 'REFERENCE_TABLE'
	| 'RICH_TEXT'
	| 'SINGLE_LINE_TEXT'
	| 'STATUS'
	| 'STATUS_ASSIGNEE'
	| 'SUBTABLE'
	| 'TIME'
	| 'UPDATED_TIME'
	| 'USER_SELECT';

export type K5eFieldSupport = {
	supported: boolean;
	reason?: string;
};

export const FIELD_SUPPORT_STATUS: Record<K5eFieldType, K5eFieldSupport> = {
	SINGLE_LINE_TEXT: { supported: true },
	MULTI_LINE_TEXT: { supported: true },
	RICH_TEXT: { supported: true },
	NUMBER: { supported: true },
	CHECK_BOX: { supported: true },
	RADIO_BUTTON: { supported: true },
	DROP_DOWN: { supported: true },
	MULTI_SELECT: { supported: true },
	DATE: { supported: true },
	TIME: { supported: true },
	DATETIME: { supported: true },
	FILE: { supported: true },
	GROUP: { supported: false, reason: 'Complex nested structure' },
	SUBTABLE: { supported: false, reason: 'Complex nested structure' },
	CALC: { supported: false, reason: 'Calculation-based field' },
	CATEGORY: { supported: false, reason: 'System field' },
	CREATED_TIME: { supported: false, reason: 'System field' },
	CREATOR: { supported: false, reason: 'System field' },
	GROUP_SELECT: { supported: false, reason: 'Organization-related field' },
	MODIFIER: { supported: false, reason: 'System field' },
	ORGANIZATION_SELECT: {
		supported: false,
		reason: 'Organization-related field',
	},
	RECORD_NUMBER: { supported: false, reason: 'System field' },
	REFERENCE_TABLE: { supported: false, reason: 'Complex data structure' },
	STATUS: { supported: false, reason: 'Process management field' },
	STATUS_ASSIGNEE: { supported: false, reason: 'Process management field' },
	UPDATED_TIME: { supported: false, reason: 'System field' },
	USER_SELECT: { supported: false, reason: 'Organization-related field' },
	LINK: { supported: false, reason: 'Complex data structure' },
};

export interface K5eField {
	type: K5eFieldType;
	code: string;
	label: string;
	noLabel?: boolean;
	required?: boolean;
	defaultValue?: string | number;
	options?: string[];
}

export interface K5eFieldsResponse {
	properties: Record<string, K5eField>;
	revision: string;
}

import type { Result } from '../types';

/**
 * APIから返されるフィールドをアプリケーション内部の型に変換する
 */
export function toK5eField(field: K5eApiField): K5eField {
	return {
		type: field.type,
		code: field.code,
		label: field.label,
		noLabel: field.noLabel,
		required: field.required,
		defaultValue: field.defaultValue,
		options: field.options,
	};
}

export interface K5eClientInterface {
	getFields(appId: number): Promise<Result<K5eFieldsResponse, Error>>;
}
