import type { K5eFieldsResponse } from '../../src/domains/kintone/types';

/**
 * kintoneフィールドのモックデータ
 */
export const mockKintoneFields: K5eFieldsResponse = {
  properties: {
    text_field: {
      type: 'SINGLE_LINE_TEXT',
      code: 'text_field',
      label: 'テキストフィールド',
      required: true
    },
    multi_line_text: {
      type: 'MULTI_LINE_TEXT',
      code: 'multi_line_text',
      label: '複数行テキスト',
      required: false
    },
    rich_text: {
      type: 'RICH_TEXT',
      code: 'rich_text',
      label: 'リッチテキスト',
      required: false
    },
    number_field: {
      type: 'NUMBER',
      code: 'number_field',
      label: '数値',
      required: false,
      defaultValue: 0
    },
    checkbox: {
      type: 'CHECK_BOX',
      code: 'checkbox',
      label: 'チェックボックス',
      required: false,
      options: ['選択肢1', '選択肢2', '選択肢3']
    },
    radio: {
      type: 'RADIO_BUTTON',
      code: 'radio',
      label: 'ラジオボタン',
      required: true,
      options: ['オプション1', 'オプション2', 'オプション3']
    },
    dropdown: {
      type: 'DROP_DOWN',
      code: 'dropdown',
      label: 'ドロップダウン',
      required: false,
      options: ['項目1', '項目2', '項目3']
    },
    multi_select: {
      type: 'MULTI_SELECT',
      code: 'multi_select',
      label: '複数選択',
      required: false,
      options: ['選択1', '選択2', '選択3', '選択4']
    },
    date_field: {
      type: 'DATE',
      code: 'date_field',
      label: '日付',
      required: false
    },
    time_field: {
      type: 'TIME',
      code: 'time_field',
      label: '時刻',
      required: false
    },
    datetime_field: {
      type: 'DATETIME',
      code: 'datetime_field',
      label: '日時',
      required: false
    },
    file_field: {
      type: 'FILE',
      code: 'file_field',
      label: 'ファイル',
      required: false
    },
    // サポート対象外のフィールド
    unsupported_field: {
      type: 'GROUP',
      code: 'unsupported_field',
      label: 'サポート対象外フィールド',
      required: false
    }
  },
  revision: '1'
};

/**
 * 期待されるJSONスキーマの結果
 */
export const expectedJsonSchema = {
  type: 'object',
  required: ['text_field', 'radio'],
  properties: {
    text_field: {
      type: 'string',
      title: 'テキストフィールド'
    },
    multi_line_text: {
      type: 'string',
      title: '複数行テキスト'
    },
    rich_text: {
      type: 'string',
      title: 'リッチテキスト'
    },
    number_field: {
      type: 'number',
      title: '数値'
    },
    checkbox: {
      type: 'array',
      title: 'チェックボックス',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['選択肢1', '選択肢2', '選択肢3']
      }
    },
    radio: {
      type: 'string',
      title: 'ラジオボタン',
      enum: ['オプション1', 'オプション2', 'オプション3']
    },
    dropdown: {
      type: 'string',
      title: 'ドロップダウン',
      enum: ['項目1', '項目2', '項目3']
    },
    multi_select: {
      type: 'array',
      title: '複数選択',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['選択1', '選択2', '選択3', '選択4']
      }
    },
    date_field: {
      type: 'string',
      format: 'date',
      title: '日付'
    },
    time_field: {
      type: 'string',
      format: 'time',
      title: '時刻'
    },
    datetime_field: {
      type: 'string',
      format: 'date-time',
      title: '日時'
    },
    file_field: {
      type: 'string',
      format: 'data-url',
      title: 'ファイル'
    },
    unsupported_field: {
      type: 'null'
    }
  },
  _brand: 'JSONSchema'
};

/**
 * 期待されるUIスキーマの結果
 */
export const expectedUiSchema = {
  multi_line_text: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5
    },
    _brand: 'RJSFUISchema'
  },
  rich_text: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 8
    },
    _brand: 'RJSFUISchema'
  },
  radio: {
    'ui:widget': 'radio',
    'ui:options': {
      inline: true
    },
    _brand: 'RJSFUISchema'
  },
  checkbox: {
    'ui:widget': 'checkboxes',
    'ui:options': {
      inline: true
    },
    _brand: 'RJSFUISchema'
  },
  dropdown: {
    'ui:widget': 'select',
    'ui:placeholder': '選択してください',
    _brand: 'RJSFUISchema'
  },
  multi_select: {
    'ui:widget': 'checkboxes',
    'ui:options': {
      inline: true
    },
    _brand: 'RJSFUISchema'
  },
  date_field: {
    'ui:widget': 'date',
    _brand: 'RJSFUISchema'
  },
  time_field: {
    'ui:widget': 'time',
    _brand: 'RJSFUISchema'
  },
  file_field: {
    'ui:widget': 'file',
    _brand: 'RJSFUISchema'
  },
  _brand: 'RJSFUISchema'
};
