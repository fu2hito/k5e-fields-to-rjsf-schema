import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import type { Result } from '../types';
import {
	type FieldType,
	type K5eApiField,
	type K5eClientInterface,
	type K5eClientOptions,
	type K5eError,
	type K5eField,
	type K5eFieldsResponse,
	toK5eField,
} from './types';

/**
 * K5e API クライアントの実装
 */
export class K5eClient implements K5eClientInterface {
	private client: KintoneRestAPIClient;

	constructor(options: K5eClientOptions) {
		const useProxy =
			window.location.hostname === 'localhost' ||
			window.location.hostname === '127.0.0.1';

		this.client = new KintoneRestAPIClient({
			baseUrl: useProxy
				? `${window.location.origin}/kintone-api`
				: `https://${options.domain}`,
			auth: {
				apiToken: options.apiToken,
			},
		});
	}

	/**
	 * フィールド情報を取得する
	 */
	async getFields(appId: number): Promise<Result<K5eFieldsResponse, K5eError>> {
		try {
			const response = await this.client.app.getFormFields({
				app: appId,
				lang: 'default',
			});

			const properties = Object.entries(response.properties).reduce(
				(acc, [key, field]) => {
					// APIフィールドの型を合わせる
					const cleaned: K5eApiField = {
						type: field.type as FieldType,
						code: field.code,
						label: field.label,
						...('noLabel' in field ? { noLabel: field.noLabel } : {}),
						...('required' in field ? { required: field.required } : {}),
						...('defaultValue' in field
							? { defaultValue: field.defaultValue }
							: {}),
						...([
							'CHECK_BOX',
							'RADIO_BUTTON',
							'DROP_DOWN',
							'MULTI_SELECT',
						].includes(field.type) && 'options' in field
							? {
									options: Object.values(
										field.options as Record<string, { label: string }>,
									).map((opt) => opt.label),
								}
							: {}),
					};

					acc[key] = toK5eField(cleaned);
					return acc;
				},
				{} as Record<string, K5eField>,
			);

			return {
				ok: true,
				value: {
					properties,
					revision: response.revision,
				},
			};
		} catch (error) {
			console.error('Error fetching fields:', error);

			if (error instanceof Error) {
				if (error.message.includes('404')) {
					return {
						ok: false,
						error: {
							type: 'NOT_FOUND_ERROR',
							message: `App ID ${appId} not found`,
						},
					};
				}

				if (error.message.includes('403')) {
					return {
						ok: false,
						error: {
							type: 'API_ERROR',
							message: 'Authentication failed. Please check your API token.',
						},
					};
				}
			}

			return {
				ok: false,
				error: {
					type: 'API_ERROR',
					message:
						error instanceof Error ? error.message : 'Unknown error occurred',
				},
			};
		}
	}
}
