/*
  When you use this package, you can import them from package root like this:
  import { KintoneRestAPIClient, KintoneFormFieldProperty } from "@kintone/rest-api-client";
*/
import type { KintoneFormFieldProperty } from "../../../..";
import { KintoneRestAPIClient } from "../../../..";

const client = new KintoneRestAPIClient({
  /* ... */
});

type MyAppProperty = {
  CreatedBy: K5eFormFieldProperty.Creator;
  EmployeeNo: K5eFormFieldProperty.Number;
  Authorizer: K5eFormFieldProperty.UserSelect;
  Title: K5eFormFieldProperty.SingleLineText;
  Details: K5eFormFieldProperty.Subtable<{
    Date: K5eFormFieldProperty.Date;
    Destination: K5eFormFieldProperty.SingleLineText;
    ModeOfTransportation: K5eFormFieldProperty.Dropdown;
    Cost: K5eFormFieldProperty.Number;
  }>;
  TotalExpenses: K5eFormFieldProperty.Number;
  Notes: K5eFormFieldProperty.MultiLineText;
};

declare function displayTitleFieldProperty(
  property: K5eFormFieldProperty.SingleLineText,
): void;

declare function modifyDetailsProperty(
  property: MyAppProperty["Details"],
): MyAppProperty["Details"];

const exampleGetAndUpdateProperties = async () => {
  const APP_ID = 1;
  const response = await client.app.getFormFields<MyAppProperty>({
    app: APP_ID,
  });

  displayTitleFieldProperty(response.properties.Title);

  const newDetailsProperty = modifyDetailsProperty(response.properties.Details);

  await client.app.updateFormFields({
    app: APP_ID,
    properties: { Details: newDetailsProperty },
  });
};