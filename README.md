# k5e-fields-to-rjsf-schema

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![](https://img.shields.io/badge/versioning-PrideVer-blue)](https://pridever.org/)

@rjsf/core: ![NPM Version](https://img.shields.io/npm/v/%40rjsf%2Fcore)
@kintone/rest-api-client: ![NPM Version](https://img.shields.io/npm/v/%40kintone%2Frest-api-client)

kintoneアプリのフィールド情報をReact JSON Schema Form（RJSF）用のJSONスキーマに変換するライブラリです。
kintone REST APIから取得した情報を元に、RJSFのフォームを動的に生成できます。

このリポジトリは以下のAIアシスタントを利用して作成しています。

1. Copilot Edits(Agent) + Claude 3.7 Sonnet(VS code Insiders)
   - 基本設計。PoC作成
2. Cline + Claude 3.5 Sonnet(via VS Code LM API)
   - v2の実装
3. Cline + Claude 3.7 Sonnet(via Anthropic API)
   - testの初期実装

## 特徴

- kintone REST APIを使用してアプリのフィールド情報を取得
- JSON Schema形式に変換してRJSFで利用可能

## 主な用途

- kintoneアプリのフィールド情報を利用したフォーム生成
- 複数アプリを対象としたフォームの一括生成

### 今後の機能

- カスタムウィジェットの適用
- 独自のバリデーションルールの追加と再利用性の向上

## 使い方

### 事前準備

- kintoneでアプリを作成し、APIを有効化
  - アプリ閲覧権限またはアプリ管理権限が必要
- .envファイルを作成し環境変数を設定
  - see [.env.template](./.env.template)

### 実行方法

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/k5e-fields-to-rjsf-schema.git
cd k5e-fields-to-rjsf-schema
pnpm install

# exampleページの起動
pnpm dev
```

### 基本的な使用例

```typescript
import { createK5eToRJSF } from 'k5e-fields-to-rjsf-schema';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';

// ライブラリの初期化
const converter = createK5eToRJSF({
  domain: 'your-domain.cybozu.com',
  apiToken: 'your-api-token'
});

// アプリからフォームスキーマを生成
const result = await converter.generateFormSchema(123);
if (!result.ok) {
  console.error('Error:', result.error);
  return;
}

const { jsonSchema, uiSchema } = result.value;

// Reactコンポーネントでの使用
function K5eForm() {
  return (
    <Form
      schema={jsonSchema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={({formData}) => console.log(formData)}
    />
  );
}
```

### バリデーション付きフォームの生成

```typescript
// バリデーションルールを含むスキーマの生成
const { jsonSchema, uiSchema } = await converter.generateFormSchema(123, {
  includeValidation: true,
  strictMode: true // kintoneのルールを厳密に適用
});
```

### カスタムウィジェットの適用

```typescript
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/mui';
import { MyCustomWidgets } from './custom-widgets';

// カスタムウィジェットを追加したフォームの生成
const Form = withTheme(MuiTheme);

function K5eCustomForm() {
  return (
    <Form
      schema={jsonSchema}
      uiSchema={uiSchema}
      widgets={MyCustomWidgets}
      onSubmit={({formData}) => console.log(formData)}
    />
  );
}
```

## API リファレンス

### K5eToRJSF

メインクラス。kintoneフィールド情報をRJSFスキーマに変換します。

```typescript
new K5eToRJSF(options: {
  domain: string;
  apiToken?: string;
  username?: string;
  password?: string;
  basicAuth?: { username: string; password: string };
})
```

#### メソッド

- **getFields(appId: number): Promise<K5eFieldsResponse>**\
  指定したアプリのフィールド情報を取得します。

- **convertToJSONSchema(fields: K5eFieldsResponse): JSONSchema7**\
  kintoneフィールド情報をJSONスキーマに変換します。

- **generateUISchema(fields: K5eFieldsResponse): object**\
  フィールド情報からUIスキーマを生成します。

- **generateFormSchema(appId: number, options?: { includeValidation?: boolean, strictMode?: boolean }): Promise<{ jsonSchema: JSONSchema7, uiSchema: object }>**\
  アプリIDからJSONスキーマとUIスキーマを生成します。

## フィールドタイプのサポート状況

| フィールドタイプ     | サポート | 備考             |
| -------------------- | -------- | ---------------- |
| SINGLE\_LINE\_TEXT   | ✅       | 1行テキスト      |
| MULTI\_LINE\_TEXT    | ✅       | 複数行テキスト   |
| RICH\_TEXT           | ✅       | リッチテキスト   |
| NUMBER               | ✅       | 数値             |
| CHECK\_BOX           | ✅       | チェックボックス |
| RADIO\_BUTTON        | ✅       | ラジオボタン     |
| DROP\_DOWN           | ✅       | ドロップダウン   |
| MULTI\_SELECT        | ✅       | 複数選択         |
| DATE                 | ✅       | 日付             |
| TIME                 | ✅       | 時刻             |
| DATETIME             | ✅       | 日時             |
| FILE                 | ✅       | ファイル         |
| CALC                 | ❌       | 計算フィールド   |
| CATEGORY             | ❌       | カテゴリー       |
| CREATED\_TIME        | ❌       | 作成日時         |
| CREATOR              | ❌       | 作成者           |
| GROUP                | ❌       | グループ         |
| GROUP\_SELECT        | ❌       | グループ選択     |
| MODIFIER             | ❌       | 更新者           |
| ORGANIZATION\_SELECT | ❌       | 組織選択         |
| RECORD\_NUMBER       | ❌       | レコード番号     |
| REFERENCE\_TABLE     | ❌       | 関連テーブル     |
| STATUS               | ❌       | ステータス       |
| STATUS\_ASSIGNEE     | ❌       | 作業者           |
| SUBTABLE             | ❌       | サブテーブル     |
| UPDATED\_TIME        | ❌       | 更新日時         |
| USER\_SELECT         | ❌       | ユーザー選択     |
| LINK                 | ❌       | リンク           |

### 開発のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/k5e-fields-to-rjsf-schema.git
cd k5e-fields-to-rjsf-schema

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# リントとフォーマット
pnpm check
```

## ライセンス

Apache-2.0

## 参考資料

### 開発リソース

- [アーキテクチャ](./doc/architecture.md)
- [初期設計資料](./doc/rjsfschema-from-kintone-fields-design.md)
- [v1](./doc/old_index.ts)

### 前提とするライブラリ

- [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form): JSON Schema形式から動的フォームを生成するReactライブラリ
- [kintone JavaScript Client - cybozu developer network](https://cybozu.dev/ja/kintone/sdk/rest-api-client/kintone-javascript-client/): kintoneのREST API仕様
  - [GitHub](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client#readme)

### 参考

- [.clinerulesをはじめとしたClineの使い方](https://github.com/mizchi/ailab)
  - MIT License
- [./doc/react-jsonschema-form](./doc/react-jsonschema-form/): RJSFのフォーム定義の一部
  - [GitHub](https://github.com/rjsf-team/react-jsonschema-form/tree/main/packages/docs/docs/json-schema)
  - Apache-2.0
- [property.ts](./doc/rest-api-client/property.ts): kintone JavaScript Clientのフィールド定義の一部
  - [GitHub](https://github.com/kintone/js-sdk/blob/main/packages/rest-api-client/src/K5eFields/exportTypes/**checks**/usecases/property.ts)
  - MIT License

## その他

- kintoneはサイボウズ株式会社の登録商標です。
- このライブラリはサイボウズ株式会社の提供するライブラリを利用しておりますが、サイボウズ株式会社とは関係ありません。
