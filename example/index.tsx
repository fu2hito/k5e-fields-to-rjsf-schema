import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Form from '@rjsf/mui';
import { FormProps } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { createK5eToRJSF } from '../src';
import type { FormSchema } from '../src';

type ChangeEvent = Parameters<Required<FormProps<any>>["onChange"]>[0];
type SubmitEvent = Parameters<Required<FormProps<any>>["onSubmit"]>[0];

// Environment-based configuration
const CONFIG = {
  domain: (import.meta as any).env?.VITE_KINTONE_DOMAIN || '',
  apiToken: (import.meta as any).env?.VITE_KINTONE_API_TOKEN || '',
  appId: Number((import.meta as any).env?.VITE_KINTONE_APP_ID || 0)
};

const App: React.FC = () => {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const converter = createK5eToRJSF({
          domain: CONFIG.domain,
          apiToken: CONFIG.apiToken
        });
        
        const result = await converter.generateFormSchema(CONFIG.appId);
        if (!result.ok) {
          throw new Error(result.error.message);
        }
        console.info('Form schema:', result.value);
        
        setFormSchema(result.value);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  const handleSubmit = (event: SubmitEvent) => {
    console.info('Form submitted with data:', event.formData);
    // ここでkintoneにデータを送信するロジックを追加
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  if (!formSchema) {
    return <div>スキーマが読み込めませんでした</div>;
  }

  return (
    <div className="container">
      <h1>kintoneフォーム</h1>
      <Form
        schema={formSchema.jsonSchema}
        uiSchema={formSchema.uiSchema}
        validator={validator}
        formData={formData}
        onChange={(e: ChangeEvent) => setFormData(e.formData)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
