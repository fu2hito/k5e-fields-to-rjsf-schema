import { describe, it, expect } from 'vitest';
import { toK5eField, FIELD_SUPPORT_STATUS } from '../../../src/domains/kintone/types';
import type { K5eApiField, K5eField } from '../../../src/domains/kintone/types';

describe('kintone/types', () => {
  describe('toK5eField', () => {
    it('基本的なフィールド変換が正しく動作すること', () => {
      const apiField: K5eApiField = {
        type: 'SINGLE_LINE_TEXT',
        code: 'text_field',
        label: 'テキストフィールド',
        required: true
      };

      const result: K5eField = toK5eField(apiField);

      expect(result).toEqual({
        type: 'SINGLE_LINE_TEXT',
        code: 'text_field',
        label: 'テキストフィールド',
        required: true
      });
    });

    it('オプションフィールドが正しく変換されること', () => {
      const apiField: K5eApiField = {
        type: 'RADIO_BUTTON',
        code: 'radio',
        label: 'ラジオボタン',
        required: true,
        options: ['オプション1', 'オプション2', 'オプション3']
      };

      const result: K5eField = toK5eField(apiField);

      expect(result).toEqual({
        type: 'RADIO_BUTTON',
        code: 'radio',
        label: 'ラジオボタン',
        required: true,
        options: ['オプション1', 'オプション2', 'オプション3']
      });
    });

    it('デフォルト値が正しく変換されること', () => {
      const apiField: K5eApiField = {
        type: 'NUMBER',
        code: 'number_field',
        label: '数値',
        defaultValue: 0
      };

      const result: K5eField = toK5eField(apiField);

      expect(result).toEqual({
        type: 'NUMBER',
        code: 'number_field',
        label: '数値',
        defaultValue: 0
      });
    });

    it('noLabelプロパティが正しく変換されること', () => {
      const apiField: K5eApiField = {
        type: 'SINGLE_LINE_TEXT',
        code: 'text_field',
        label: 'テキストフィールド',
        noLabel: true
      };

      const result: K5eField = toK5eField(apiField);

      expect(result).toEqual({
        type: 'SINGLE_LINE_TEXT',
        code: 'text_field',
        label: 'テキストフィールド',
        noLabel: true
      });
    });
  });

  describe('FIELD_SUPPORT_STATUS', () => {
    it('サポート対象のフィールドタイプが正しく定義されていること', () => {
      const supportedTypes = [
        'SINGLE_LINE_TEXT',
        'MULTI_LINE_TEXT',
        'RICH_TEXT',
        'NUMBER',
        'CHECK_BOX',
        'RADIO_BUTTON',
        'DROP_DOWN',
        'MULTI_SELECT',
        'DATE',
        'TIME',
        'DATETIME',
        'FILE'
      ];

      supportedTypes.forEach(type => {
        expect(FIELD_SUPPORT_STATUS[type as keyof typeof FIELD_SUPPORT_STATUS].supported).toBe(true);
      });
    });

    it('サポート対象外のフィールドタイプが正しく定義されていること', () => {
      const unsupportedTypes = [
        'GROUP',
        'SUBTABLE',
        'CALC',
        'CATEGORY',
        'CREATED_TIME',
        'CREATOR',
        'GROUP_SELECT',
        'MODIFIER',
        'ORGANIZATION_SELECT',
        'RECORD_NUMBER',
        'REFERENCE_TABLE',
        'STATUS',
        'STATUS_ASSIGNEE',
        'UPDATED_TIME',
        'USER_SELECT',
        'LINK'
      ];

      unsupportedTypes.forEach(type => {
        expect(FIELD_SUPPORT_STATUS[type as keyof typeof FIELD_SUPPORT_STATUS].supported).toBe(false);
        expect(FIELD_SUPPORT_STATUS[type as keyof typeof FIELD_SUPPORT_STATUS].reason).toBeDefined();
      });
    });
  });
});
