import { describe, it, expect } from 'vitest';
import { SchemaConverter } from '../../../src/domains/rjsf/converter';
import { mockKintoneFields, expectedJsonSchema, expectedUiSchema } from '../../mocks/kintone-fields';
import type { K5eField } from '../../../src/domains/kintone/types';

describe('SchemaConverter', () => {
  const converter = new SchemaConverter();

  describe('convertToJSONSchema', () => {
    it('kintoneフィールドからJSONスキーマに正しく変換すること', () => {
      const result = converter.convertToJSONSchema(mockKintoneFields);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        // 基本構造の検証
        expect(result.value.type).toBe('object');
        expect(result.value._brand).toBe('JSONSchema');
        
        // 必須フィールドの検証
        expect(result.value.required).toContain('text_field');
        expect(result.value.required).toContain('radio');
        
        // プロパティの検証
        expect(result.value.properties).toBeDefined();
        if (result.value.properties) {
          // テキストフィールド
          expect(result.value.properties.text_field.type).toBe('string');
          expect(result.value.properties.text_field.title).toBe('テキストフィールド');
          
          // 数値フィールド
          expect(result.value.properties.number_field.type).toBe('number');
          
          // チェックボックス
          const checkbox = result.value.properties.checkbox;
          expect(checkbox.type).toBe('array');
          expect(checkbox.items?.enum).toEqual(['選択肢1', '選択肢2', '選択肢3']);
          
          // ラジオボタン
          const radio = result.value.properties.radio;
          expect(radio.type).toBe('string');
          expect(radio.enum).toEqual(['オプション1', 'オプション2', 'オプション3']);
          
          // 日付フィールド
          const dateField = result.value.properties.date_field;
          expect(dateField.type).toBe('string');
          expect(dateField.format).toBe('date');
        }
      }
    });

    it('空のフィールドリストからも正しく変換すること', () => {
      const emptyFields = {
        properties: {},
        revision: '1'
      };
      
      const result = converter.convertToJSONSchema(emptyFields);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.type).toBe('object');
        expect(result.value.required).toEqual([]);
        expect(result.value.properties).toEqual({});
      }
    });
  });

  describe('generateUISchema', () => {
    it('kintoneフィールドからUIスキーマに正しく変換すること', () => {
      const result = converter.generateUISchema(mockKintoneFields);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        // 基本構造の検証
        expect(result.value._brand).toBe('RJSFUISchema');
        
        // 複数行テキスト
        const multiLineText = result.value.multi_line_text;
        expect(multiLineText['ui:widget']).toBe('textarea');
        expect(multiLineText['ui:options']?.rows).toBe(5);
        
        // リッチテキスト
        const richText = result.value.rich_text;
        expect(richText['ui:widget']).toBe('textarea');
        expect(richText['ui:options']?.rows).toBe(8);
        
        // ラジオボタン
        const radioUI = result.value.radio;
        expect(radioUI['ui:widget']).toBe('radio');
        expect(radioUI['ui:options']?.inline).toBe(true);
        
        // ドロップダウン
        expect(result.value.dropdown['ui:widget']).toBe('select');
        expect(result.value.dropdown['ui:placeholder']).toBe('選択してください');
        
        // 日付フィールド
        expect(result.value.date_field['ui:widget']).toBe('date');
      }
    });
  });

  describe('convertFieldToSchemaProperty', () => {
    it('SINGLE_LINE_TEXTフィールドを正しく変換すること', () => {
      const field: K5eField = {
        type: 'SINGLE_LINE_TEXT',
        code: 'text_field',
        label: 'テキストフィールド',
        required: true
      };
      
      const result = converter.convertFieldToSchemaProperty(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.type).toBe('string');
        expect(result.value.title).toBe('テキストフィールド');
      }
    });

    it('NUMBERフィールドを正しく変換すること', () => {
      const field: K5eField = {
        type: 'NUMBER',
        code: 'number_field',
        label: '数値',
        required: false
      };
      
      const result = converter.convertFieldToSchemaProperty(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.type).toBe('number');
        expect(result.value.title).toBe('数値');
      }
    });

    it('RADIO_BUTTONフィールドを正しく変換すること', () => {
      const field: K5eField = {
        type: 'RADIO_BUTTON',
        code: 'radio',
        label: 'ラジオボタン',
        required: true,
        options: ['オプション1', 'オプション2', 'オプション3']
      };
      
      const result = converter.convertFieldToSchemaProperty(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.type).toBe('string');
        expect(result.value.title).toBe('ラジオボタン');
        expect(result.value.enum).toEqual(['オプション1', 'オプション2', 'オプション3']);
      }
    });

    it('CHECK_BOXフィールドを正しく変換すること', () => {
      const field: K5eField = {
        type: 'CHECK_BOX',
        code: 'checkbox',
        label: 'チェックボックス',
        required: false,
        options: ['選択肢1', '選択肢2', '選択肢3']
      };
      
      const result = converter.convertFieldToSchemaProperty(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.type).toBe('array');
        expect(result.value.title).toBe('チェックボックス');
        expect(result.value.uniqueItems).toBe(true);
        expect(result.value.items?.type).toBe('string');
        expect(result.value.items?.enum).toEqual(['選択肢1', '選択肢2', '選択肢3']);
      }
    });

    it('DATEフィールドを正しく変換すること', () => {
      const field: K5eField = {
        type: 'DATE',
        code: 'date_field',
        label: '日付',
        required: false
      };
      
      const result = converter.convertFieldToSchemaProperty(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.type).toBe('string');
        expect(result.value.format).toBe('date');
        expect(result.value.title).toBe('日付');
      }
    });

    it('サポート対象外のフィールドタイプの場合、nullタイプを返すこと', () => {
      const field: K5eField = {
        type: 'GROUP',
        code: 'group_field',
        label: 'グループ',
        required: false
      };
      
      const result = converter.convertFieldToSchemaProperty(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.type).toBe('null');
      }
    });
  });

  describe('generateFieldUISchema', () => {
    it('MULTI_LINE_TEXTフィールドのUIスキーマを正しく生成すること', () => {
      const field: K5eField = {
        type: 'MULTI_LINE_TEXT',
        code: 'multi_line_text',
        label: '複数行テキスト',
        required: false
      };
      
      const result = converter.generateFieldUISchema(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value['ui:widget']).toBe('textarea');
        expect(result.value['ui:options']?.rows).toBe(5);
      }
    });

    it('RADIO_BUTTONフィールドのUIスキーマを正しく生成すること', () => {
      const field: K5eField = {
        type: 'RADIO_BUTTON',
        code: 'radio',
        label: 'ラジオボタン',
        required: true,
        options: ['オプション1', 'オプション2', 'オプション3']
      };
      
      const result = converter.generateFieldUISchema(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value['ui:widget']).toBe('radio');
        expect(result.value['ui:options']?.inline).toBe(true);
      }
    });

    it('DROP_DOWNフィールドのUIスキーマを正しく生成すること', () => {
      const field: K5eField = {
        type: 'DROP_DOWN',
        code: 'dropdown',
        label: 'ドロップダウン',
        required: false,
        options: ['項目1', '項目2', '項目3']
      };
      
      const result = converter.generateFieldUISchema(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value['ui:widget']).toBe('select');
        expect(result.value['ui:placeholder']).toBe('選択してください');
      }
    });

    it('サポート対象外のフィールドタイプの場合、空のUIスキーマを返すこと', () => {
      const field: K5eField = {
        type: 'GROUP',
        code: 'group_field',
        label: 'グループ',
        required: false
      };
      
      const result = converter.generateFieldUISchema(field);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(Object.keys(result.value).length).toBe(1); // _brandのみ
        expect(result.value._brand).toBe('RJSFUISchema');
      }
    });
  });
});
