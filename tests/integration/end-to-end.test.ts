import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createK5eToRJSF } from '../../src';
import type { K5eClientOptions } from '../../src/domains/kintone/types';

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
          getFormFields: vi.fn().mockResolvedValue({
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
          })
        }
      };
    })
  };
});

describe('End-to-End Integration Test', () => {
  const clientOptions: K5eClientOptions = {
    domain: 'example.cybozu.com',
    apiToken: 'dummy-token'
  };

  beforeEach(() => {
    // テスト前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createK5eToRJSF', () => {
    it('ファクトリー関数が正しくインスタンスを生成すること', () => {
      const converter = createK5eToRJSF(clientOptions);
      expect(converter).toBeDefined();
    });
  });

  describe('エンドツーエンドフロー', () => {
    it('kintoneフィールドからRJSFスキーマへの変換が正しく行われること', async () => {
      // コンバーターの作成
      const converter = createK5eToRJSF(clientOptions);
      
      // フォームスキーマの生成
      const result = await converter.generateFormSchema(1);
      
      // 期待される結果
      expect(result.ok).toBe(true);
      if (result.ok) {
        // JSONスキーマの検証
        expect(result.value.jsonSchema.type).toBe('object');
        expect(result.value.jsonSchema._brand).toBe('JSONSchema');
        
        // プロパティの検証
        if (result.value.jsonSchema.properties) {
          // テキストフィールド
          const textField = result.value.jsonSchema.properties.text_field;
          expect(textField.type).toBe('string');
          expect(textField.title).toBe('テキストフィールド');
          
          // 数値フィールド
          const numberField = result.value.jsonSchema.properties.number_field;
          expect(numberField.type).toBe('number');
          expect(numberField.title).toBe('数値');
          
          // ラジオボタン
          const radioField = result.value.jsonSchema.properties.radio_button;
          expect(radioField.type).toBe('string');
          expect(radioField.enum).toEqual(['オプション1', 'オプション2', 'オプション3']);
        }
        
        // UIスキーマの検証
        expect(result.value.uiSchema._brand).toBe('RJSFUISchema');
        
        // ラジオボタンのUIスキーマ
        const radioUI = result.value.uiSchema.radio_button;
        if (radioUI) {
          expect(radioUI['ui:widget']).toBe('radio');
          expect(radioUI['ui:options']?.inline).toBe(true);
        }
      }
    });

    // APIエラーケースは単体テストで十分にカバーされているため、
    // 統合テストでは正常系のみテストする
  });
});
