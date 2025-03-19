# kintone REST API - アプリフォームフィールドを取得する

> このAPIは、指定したkintoneアプリケーションのフォームに設定されているフィールドの一覧と、それぞれの詳細な設定情報を取得するために使用されます。

## エンドポイント

### 通常のアプリ (運用環境)

`https://sample.cybozu.com/k/v1/app/form/fields.json`

### ゲストスペースのアプリ (運用環境)

`https://sample.cybozu.com/k/guest/GUEST_SPACE_ID/v1/app/form/fields.json`

### 通常のアプリ (動作テスト環境)

`https://sample.cybozu.com/k/v1/preview/app/form/fields.json`

### ゲストスペースのアプリ (動作テスト環境)

`https://sample.cybozu.com/k/guest/GUEST_SPACE_ID/v1/preview/app/form/fields.json`

## HTTPメソッド

- GET

## 必要なアクセス権限

### 運用環境

- アプリのレコード閲覧権限
- アプリのレコード追加権限
- アプリの管理権限

### 動作テスト環境

- アプリ管理権限

## リクエストパラメータ

- `app` (必須): 取得したいアプリのIDを指定します。数値または文字列です。
- `lang` (任意): 取得するフィールド名や選択肢名の言語を指定します。指定可能な値は `ja` (日本語), `en` (英語), `zh` (中国語), `user` (API実行ユーザーの表示言語), `default` (デフォルト) です。省略した場合、デフォルトの名称が取得されます。

## レスポンスの構造

APIのレスポンスはJSON形式で、以下のような構造を持ちます。

```json
{
  "properties": {
    "フィールドコード1": {
      "type": "フィールドの種類",
      "code": "フィールドコード1",
      "label": "フィールド名"
      // その他のプロパティ (required, unique, options など)
    },
    "フィールドコード2": {
      "type": "別のフィールドの種類",
      "code": "フィールドコード2",
      "label": "別のフィールド名"
      // その他のプロパティ
    }
    // ... 複数のフィールドの情報
  },
  "revision": "アプリ設定のリビジョン番号"
}
```

各フィールドコードに対応するオブジェクトには、そのフィールドの詳細な設定が含まれます。type プロパティには、`SINGLE_LINE_TEXT`, `NUMBER`, `RADIO_BUTTON`など、様々なフィールドの種類が格納されます。

### フィールドの種類

- `CALC`: 計算
- `CATEGORY`: カテゴリー
- `CHECK_BOX`: チェックボックス
- `CREATED_TIME`: 作成日時
- `CREATOR`: 作成者
- `DATE`: 日付
- `DATETIME`: 日時
- `DROP_DOWN`: ドロップダウン
- `FILE`: ファイル
- `GROUP`: グループ
- `GROUP_SELECT`: グループ選択
- `LINK`: リンク
- `MODIFIER`: 更新者
- `MULTI_LINE_TEXT`: 文字列（複数行）
- `MULTI_SELECT`: 複数選択
- `NUMBER`: 数値
- `ORGANIZATION_SELECT`: 組織選択
- `RADIO_BUTTON`: ラジオボタン
- `RECORD_NUMBER`: レコード番号
- `REFERENCE_TABLE`: 関連テーブル
- `RICH_TEXT`: リッチエディター
- `SINGLE_LINE_TEXT`: 文字列（1行）
- `STATUS`: プロセス管理機能のステータス
- `STATUS_ASSIGNEE`: プロセス管理機能の作業者
- `SUBTABLE`: テーブル
- `TIME`: 時刻
- `UPDATED_TIME`: 更新日時
- `USER_SELECT`: ユーザー選択

### サンプルリクエスト (curl)

```bash
curl -X GET 'https://sample.cybozu.com/k/v1/app/form/fields.json' \
  -H 'X-Cybozu-API-Token: YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "app": 1,
    "lang": "ja"
  }'
```

### サンプルリクエスト (kintone.api())

```javascript
const body = {
  app: kintone.app.getId(),
  lang: 'ja'
};
kintone.api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', body)
.then((resp) => {
  console.log(resp);
})
.catch((err) => {
  console.error(err);
});
```

### 詳細情報

より詳細な情報や個々のプロパティの説明については、[フィールドを取得する - cybozu developer network](https://cybozu.dev/ja/kintone/docs/rest-api/apps/form/get-form-fields/) を参照してください。

## このファイルについて

- [フィールドを取得する - cybozu developer network](https://cybozu.dev/ja/kintone/docs/rest-api/apps/form/get-form-fields/#anchor_getform_fields)を[NotebookLM](https://notebooklm.google.com/)に読み込ませて`「フィールドを取得する」ソースの内容について、LLM が理解しやすい形式に変換してほしい`というプロンプトの生成物
