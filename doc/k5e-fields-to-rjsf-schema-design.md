# k5e-fields-to-rjsf-schema ライブラリ設計書

## 概要

kintoneアプリのフィールド情報を取得し、[react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)用のJSONスキーマに変換するライブラリ。
これにより、既存のkintoneアプリに基づいた入力フォームを簡単に生成できます。

## 目的

### 1. kintoneフィールドタイプとRJSFのマッピング

| kintoneフィールドタイプ | JSONスキーマ型 | RJSFウィジェット          |
| ----------------------- | -------------- | ------------------------- |
| SINGLE\_LINE\_TEXT      | string         | TextWidget                |
| MULTI\_LINE\_TEXT       | string         | TextareaWidget            |
| RICH\_TEXT              | string         | RichTextWidget (カスタム) |
| NUMBER                  | number         | NumberWidget              |
| CALC                    | number/string  | ReadOnlyWidget            |
| CHECK\_BOX              | array          | CheckboxesWidget          |
| RADIO\_BUTTON           | string         | RadioWidget               |
| DROP\_DOWN              | string         | SelectWidget              |
| MULTI\_SELECT           | array          | MultiSelectWidget         |
| FILE                    | array          | FileWidget (カスタム)     |
| DATE                    | string         | DateWidget                |
| TIME                    | string         | TimeWidget                |
| DATETIME                | string         | DateTimeWidget            |
| USER\_SELECT            | array/string   | SelectWidget (カスタム)   |
| GROUP\_SELECT           | array/string   | SelectWidget (カスタム)   |
| ORGANIZATION\_SELECT    | array/string   | SelectWidget (カスタム)   |
| LINK                    | string         | URLWidget                 |
| CATEGORY                | array          | ReadOnlyWidget            |
| STATUS                  | string         | SelectWidget              |
| STATUS\_ASSIGNEE        | array          | ReadOnlyWidget            |
| RECORD\_NUMBER          | string         | ReadOnlyWidget            |
| CREATOR                 | object         | ReadOnlyWidget            |
| CREATED\_TIME           | string         | ReadOnlyWidget            |
| MODIFIER                | object         | ReadOnlyWidget            |
| UPDATED\_TIME           | string         | ReadOnlyWidget            |
| SUBTABLE                | array          | TableWidget (カスタム)    |
| REFERENCE\_TABLE        | array          | ReadOnlyWidget            |
