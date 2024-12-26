export type JSONValue = string | number | boolean | JSONObject | JSONObject[];

export type JSONObject = {
  [x: string]: JSONValue;
};
