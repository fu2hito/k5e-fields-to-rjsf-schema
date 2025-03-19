import { describe, it, expect, vi, beforeEach } from 'vitest';
import { K5eClient } from '../../../src/domains/kintone/client';

// windowオブジェクトのモック
vi.stubGlobal('window', {
  location: {
    hostname: 'localhost',
    origin: 'http://localhost:3000'
  }
});

// KintoneRestAPIClientのモック
vi.mock('@kintone/rest-api-client', () => {
  return {
    KintoneRestAPIClient: vi.fn().mockImplementation(() => {
      return {
        app: {
          getFormFields: vi.fn()
        }
      };
    })
  };
});

describe('K5eClient', () => {
  let client: K5eClient;
  let mockGetFormFields: any;

  beforeEach(() => {
    // テスト前にモックをリセット
    vi.clearAllMocks();
    
    // クライアントの初期化
    client = new K5eClient({ domain: 'example.cybozu.com', apiToken: 'dummy-token' });
    
    // モックの参照を取得
    mockGetFormFields = client['client'].app.getFormFields;
  });

  describe('getFields', () => {
    it('フィールド情報を正しく取得して変換すること', async () => {
      // モックの戻り値を設定
      const mockResponse = {
        properties: {
          text_field: {
            type: 'SINGLE_LINE_TEXT',
            code: 'text_field',
            label: 'テキストフィールド',
            required: true
          },
          number_field: {
            type: 'NUMBER',
            code: 'number_field',
            label: '数値',
            required: false
          },
          radio_button: {
            type: 'RADIO_BUTTON',
            code: 'radio_button',
            label: 'ラジオボタン',
            required: false,
            options: {
              option1: { label: 'オプション1' },
              option2: { label: 'オプション2' },
              option3: { label: 'オプション3' }
            }
          }
        },
        revision: '1'
      };
      
      mockGetFormFields.mockResolvedValue(mockResponse);

      // メソッド実行
      const result = await client.getFields(1);

      // 期待される結果
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.revision).toBe('1');
        expect(result.value.properties.text_field).toEqual({
          type: 'SINGLE_LINE_TEXT',
          code: 'text_field',
          label: 'テキストフィールド',
          required: true
        });
        expect(result.value.properties.number_field).toEqual({
          type: 'NUMBER',
          code: 'number_field',
          label: '数値',
          required: false
        });
        expect(result.value.properties.radio_button).toEqual({
          type: 'RADIO_BUTTON',
          code: 'radio_button',
          label: 'ラジオボタン',
          required: false,
          options: ['オプション1', 'オプション2', 'オプション3']
        });
      }

      // APIが正しく呼び出されたことを確認
      expect(mockGetFormFields).toHaveBeenCalledWith({
        app: 1,
        lang: 'default'
      });
    });

    it('APIエラー（404）が発生した場合、適切なエラーを返すこと', async () => {
      // 404エラーをシミュレート
      const error = new Error('HTTP error: 404 Not Found');
      mockGetFormFields.mockRejectedValue(error);

      // メソッド実行
      const result = await client.getFields(999);

      // 期待される結果
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('NOT_FOUND_ERROR');
        expect(result.error.message).toContain('App ID 999 not found');
      }
    });

    it('APIエラー（403）が発生した場合、認証エラーを返すこと', async () => {
      // 403エラーをシミュレート
      const error = new Error('HTTP error: 403 Forbidden');
      mockGetFormFields.mockRejectedValue(error);

      // メソッド実行
      const result = await client.getFields(1);

      // 期待される結果
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('API_ERROR');
        expect(result.error.message).toContain('Authentication failed');
      }
    });

    it('その他のエラーが発生した場合、一般的なAPIエラーを返すこと', async () => {
      // その他のエラーをシミュレート
      const error = new Error('Network error');
      mockGetFormFields.mockRejectedValue(error);

      // メソッド実行
      const result = await client.getFields(1);

      // 期待される結果
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('API_ERROR');
        expect(result.error.message).toBe('Network error');
      }
    });
  });
});
