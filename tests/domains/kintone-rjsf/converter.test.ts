import { describe, it, expect, vi, beforeEach } from 'vitest';
import { K5eToRJSF } from '../../../src/domains/kintone-rjsf/converter';
import { mockKintoneFields, expectedJsonSchema, expectedUiSchema } from '../../mocks/kintone-fields';
import type { K5eClientInterface } from '../../../src/domains/kintone/types';
import type { SchemaConverterInterface } from '../../../src/domains/rjsf/types';

describe('K5eToRJSF', () => {
  // モックの作成
  const mockKintoneClient: K5eClientInterface = {
    getFields: vi.fn()
  };

  const mockSchemaConverter: SchemaConverterInterface = {
    convertToJSONSchema: vi.fn(),
    generateUISchema: vi.fn(),
    convertFieldToSchemaProperty: vi.fn(),
    generateFieldUISchema: vi.fn()
  };

  let converter: K5eToRJSF;

  beforeEach(() => {
    // テスト前にモックをリセット
    vi.clearAllMocks();
    
    // コンバーターの初期化
    converter = new K5eToRJSF(mockKintoneClient, mockSchemaConverter);
  });

  describe('generateFormSchema', () => {
    it('正常系: フォームスキーマが正しく生成されること', async () => {
      // モックの戻り値を設定
      (mockKintoneClient.getFields as any).mockResolvedValue({
        ok: true,
        value: mockKintoneFields
      });

      (mockSchemaConverter.convertToJSONSchema as any).mockReturnValue({
        ok: true,
        value: expectedJsonSchema
      });

      (mockSchemaConverter.generateUISchema as any).mockReturnValue({
        ok: true,
        value: expectedUiSchema
      });

      // メソッド実行
      const result = await converter.generateFormSchema(1);

      // 期待される結果
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.jsonSchema).toEqual(expectedJsonSchema);
        expect(result.value.uiSchema).toEqual(expectedUiSchema);
      }

      // 各メソッドが正しく呼び出されたことを確認
      expect(mockKintoneClient.getFields).toHaveBeenCalledWith(1);
      expect(mockSchemaConverter.convertToJSONSchema).toHaveBeenCalledWith(mockKintoneFields);
      expect(mockSchemaConverter.generateUISchema).toHaveBeenCalledWith(mockKintoneFields);
    });

    it('異常系: kintoneクライアントがエラーを返した場合、エラーが伝播すること', async () => {
      // モックの戻り値を設定
      (mockKintoneClient.getFields as any).mockResolvedValue({
        ok: false,
        error: {
          type: 'API_ERROR',
          message: 'API error occurred'
        }
      });

      // メソッド実行
      const result = await converter.generateFormSchema(1);

      // 期待される結果
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('API error occurred');
      }

      // JSONスキーマとUIスキーマの変換が呼ばれていないことを確認
      expect(mockSchemaConverter.convertToJSONSchema).not.toHaveBeenCalled();
      expect(mockSchemaConverter.generateUISchema).not.toHaveBeenCalled();
    });

    it('異常系: JSONスキーマ変換でエラーが発生した場合、エラーが伝播すること', async () => {
      // モックの戻り値を設定
      (mockKintoneClient.getFields as any).mockResolvedValue({
        ok: true,
        value: mockKintoneFields
      });

      (mockSchemaConverter.convertToJSONSchema as any).mockReturnValue({
        ok: false,
        error: {
          type: 'CONVERSION_ERROR',
          message: 'JSON schema conversion error'
        }
      });

      // メソッド実行
      const result = await converter.generateFormSchema(1);

      // 期待される結果
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('JSON schema conversion error');
      }

      // UIスキーマの変換が呼ばれていないことを確認
      expect(mockSchemaConverter.generateUISchema).not.toHaveBeenCalled();
    });

    it('異常系: UIスキーマ変換でエラーが発生した場合、エラーが伝播すること', async () => {
      // モックの戻り値を設定
      (mockKintoneClient.getFields as any).mockResolvedValue({
        ok: true,
        value: mockKintoneFields
      });

      (mockSchemaConverter.convertToJSONSchema as any).mockReturnValue({
        ok: true,
        value: expectedJsonSchema
      });

      (mockSchemaConverter.generateUISchema as any).mockReturnValue({
        ok: false,
        error: {
          type: 'CONVERSION_ERROR',
          message: 'UI schema conversion error'
        }
      });

      // メソッド実行
      const result = await converter.generateFormSchema(1);

      // 期待される結果
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('UI schema conversion error');
      }
    });

    it('異常系: 予期せぬエラーが発生した場合、エラーが伝播すること', async () => {
      // モックの戻り値を設定
      (mockKintoneClient.getFields as any).mockRejectedValue(new Error('Unexpected error'));

      // メソッド実行
      const result = await converter.generateFormSchema(1);

      // 期待される結果
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('Unexpected error');
      }
    });
  });
});
