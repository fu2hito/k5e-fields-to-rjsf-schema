// Re-export types
export type { FormSchema, JSONSchema, RJSFUISchema } from "./domains/rjsf/types";
export type { K5eField, K5eFieldsResponse, K5eClientOptions } from "./domains/kintone/types";

// Re-export classes and factories
export { K5eClient } from "./domains/kintone/client";
export { SchemaConverter } from "./domains/rjsf/converter";
export { K5eToRJSF } from "./domains/kintone-rjsf/converter";

// Factory function for creating K5eToRJSF instance
import { K5eClient } from "./domains/kintone/client";
import { SchemaConverter } from "./domains/rjsf/converter";
import { K5eToRJSF } from "./domains/kintone-rjsf/converter";
import { K5eClientOptions } from "./domains/kintone/types";

/**
 * K5eToRJSFインスタンスを作成する
 */
export function createK5eToRJSF(options: K5eClientOptions): K5eToRJSF {
  const kintoneClient = new K5eClient(options);
  const schemaConverter = new SchemaConverter();
  return new K5eToRJSF(kintoneClient, schemaConverter);
}
  async getFields(appId: number): Promise<K5eFieldsResponse> {
    const useProxy = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    const client = new KintoneRestAPIClient({
      baseUrl: useProxy 
        ? `${window.location.origin}/kintone-api` 
        : `https://${this.domain}`,
      auth: {
        apiToken: this.apiToken,
      },
    });
    

    try {
      const response = await client.app.getFormFields({
        app: appId,
        lang: 'default',
      });
      return response;
    } catch (error) {
      console.error('Error fetching fields:', error);
      throw new Error(`Failed to fetch fields: ${error}`);
    }
  }

  /**
   * kintoneのフィールド情報からJSONスキーマを生成する
   * MARK: convertToJSONSchema
   */
  convertToJSONSchema(fields: K5eFieldsResponse): RJSFSchema {
    const schema: RJSFSchema = {
      type: 'object',
      required: [] as string[],
      properties: {},
    };

    Object.entries(fields.properties).forEach(([fieldCode, field]) => {
      if (field.required) {
        (schema.required as string[]).push(fieldCode);
      }

      const property = this.convertFieldToSchemaProperty(field);
      if (schema.properties) {
        schema.properties[fieldCode] = property;
      }
    });

    return schema;
  }

  /**
   * 個別のフィールドをJSONスキーマのプロパティに変換する
   */
  private convertFieldToSchemaProperty(field: K5eFormFieldProperty.Field): RJSFSchema {
    switch (field.type) {
      case 'SINGLE_LINE_TEXT': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
        };

        if ('maxLength' in field && field.maxLength) {
          schema.maxLength = field.maxLength;
        }

        if ('minLength' in field && field.minLength) {
          schema.minLength = field.minLength;
        }

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'MULTI_LINE_TEXT': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
        };

        if ('maxLength' in field && field.maxLength) {
          schema.maxLength = field.maxLength;
        }

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'RICH_TEXT': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
        };

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'NUMBER': {
        const schema: RJSFSchema = {
          type: 'number',
          title: field.label,
        };

        if ('minValue' in field && field.minValue !== undefined) {
          schema.minimum = field.minValue;
        }

        if ('maxValue' in field && field.maxValue !== undefined) {
          schema.maximum = field.maxValue;
        }

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = Number(field.defaultValue);
        }

        return schema;
      }

      case 'CHECK_BOX': {
        const schema: RJSFSchema = {
          type: 'array',
          title: field.label,
          uniqueItems: true,
          items: {
            type: 'string',
            enum: [] as string[],
          },
        };

        if ('options' in field && field.options) {
          const sortedOptions = Object.values(field.options).sort(
            (a, b) => a.index - b.index
          );

          for (const option of sortedOptions) {
            (schema.items.enum as string[]).push(option.label);
          }
        }

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'RADIO_BUTTON': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
          enum: [] as string[],
        };

        if ('options' in field && field.options) {
          const sortedOptions = Object.values(field.options).sort(
            (a, b) => a.index - b.index
          );

          for (const option of sortedOptions) {
            (schema.enum as string[]).push(option.label);
          }
        }

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'DROP_DOWN': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
          enum: [] as string[],
        };

        if ('options' in field && field.options) {
          const sortedOptions = Object.values(field.options).sort(
            (a, b) => a.index - b.index
          );

          for (const option of sortedOptions) {
            (schema.enum as string[]).push(option.label);
          }
        }

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'MULTI_SELECT': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
          format: 'multi_choice_list',
          enum: [] as string[],
        };

        if ('options' in field && field.options) {
          const sortedOptions = Object.values(field.options).sort(
            (a, b) => a.index - b.index
          );

          for (const option of sortedOptions) {
            (schema.enum as string[]).push(option.label);
          }
        }

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue ? field.defaultValue.join(',') : undefined;
        }

        return schema;
      }

      case 'DATE': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
          format: 'date',
        };

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        } else if ('defaultNowValue' in field && field.defaultNowValue) {
          const today = new Date();
          const iso = today.toISOString().split('T')[0];
          schema.default = iso;
        }

        return schema;
      }

      case 'TIME': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
          format: 'time',
        };

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'DATETIME': {
        const schema: RJSFSchema = {
          type: 'string',
          title: field.label,
          format: 'date-time',
        };

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'USER_SELECT': {
        const schema: RJSFSchema = {
          type: 'array',
          title: field.label,
          items: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              name: { type: 'string' },
            },
          },
        };

        if ('defaultValue' in field && field.defaultValue) {
          schema.default = field.defaultValue;
        }

        return schema;
      }

      case 'SUBTABLE': {
        const schema: RJSFSchema = {
          type: 'array',
          title: field.label,
          items: {
            type: 'object',
            properties: {},
          },
        };

        if ('fields' in field && field.fields) {
          Object.entries(field.fields).forEach(([fieldCode, subField]) => {
            const subProperty = this.convertFieldToSchemaProperty(subField);
            if (schema.items && schema.items.properties) {
              schema.items.properties[fieldCode] = subProperty;
            }
          });
        }

        return schema;
      }

      default:
        // デフォルトは文字列として扱う
        return {
          type: 'string',
          title: field.label,
          readOnly: true,
        };
    }
  }

  /**
   * UIスキーマを生成する
   */
  generateUISchema(fields: K5eFieldsResponse): UiSchema {
    const uiSchema: UiSchema = {};

    Object.entries(fields.properties).forEach(([fieldCode, field]) => {
      uiSchema[fieldCode] = this.generateFieldUISchema(field);
    });

    return uiSchema;
  }

  /**
   * 個別のフィールドのUIスキーマを生成する
   */
  private generateFieldUISchema(field: K5eFormFieldProperty.Field): UiSchema {
    switch (field.type) {
      case 'CHECK_BOX': {
        const uiSchema: UiSchema = {};
        if ('options' in field && field.options) {
          const sortedOptions = Object.values(field.options).sort(
            (a, b) => a.index - b.index
          );
          uiSchema['ui:enumNames'] = sortedOptions.map(option => option.label);
        }
        return uiSchema;
      }

      case 'RADIO_BUTTON': {
        const uiSchema: UiSchema = {};
        if ('options' in field && field.options) {
          const sortedOptions = Object.values(field.options).sort(
            (a, b) => a.index - b.index
          );
          uiSchema['ui:enumNames'] = sortedOptions.map(option => option.label);
        }
        return uiSchema;
      }

      case 'DROP_DOWN': {
        const uiSchema: UiSchema = {};
        if ('options' in field && field.options) {
          const sortedOptions = Object.values(field.options).sort(
            (a, b) => a.index - b.index
          );
          uiSchema['ui:enumNames'] = sortedOptions.map(option => option.label);
        }
        return uiSchema;
      }

      case 'MULTI_SELECT':
        return {
          'ui:widget': 'multi_choice_list'
        };

      case 'MULTI_LINE_TEXT':
        return {
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
          },
        };

      case 'RICH_TEXT':
        return {
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 8,
          },
        };

      case 'DATE':
        return {
          'ui:widget': 'date',
        };

      case 'TIME':
        return {
          'ui:widget': 'time',
        };

      case 'DATETIME':
        return {
          'ui:widget': 'datetime',
        };

      case 'USER_SELECT':
      case 'GROUP_SELECT':
      case 'ORGANIZATION_SELECT':
        return {
          'ui:widget': 'select',
          'ui:options': {
            creatable: true,
          },
        };

      case 'CALC':
      case 'RECORD_NUMBER':
      case 'CREATOR':
      case 'CREATED_TIME':
      case 'MODIFIER':
      case 'UPDATED_TIME':
      case 'REFERENCE_TABLE':
        return {
          'ui:readonly': true,
        };

      default:
        return {};
    }
  }

  /**
   * アプリIDからJSONスキーマとUIスキーマを一括生成する
   */
  async generateFormSchema(
    appId: number,
    options: { includeValidation?: boolean; strictMode?: boolean } = {}
  ): Promise<{
    jsonSchema: RJSFSchema;
    uiSchema: UiSchema;
  }> {
    const fields = await this.getFields(appId);
    const jsonSchema = this.convertToJSONSchema(fields);
    console.info('jsonSchema', jsonSchema);
    const uiSchema = this.generateUISchema(fields);

    return {
      jsonSchema,
      uiSchema,
    };
  }
}
