import { Validator } from 'jsonschema';
import { ddbSchema, jsonSchema } from 'src/data/drawdb-schema';

export function jsonDiagramIsValid(obj) {
  return new Validator().validate(obj, jsonSchema).valid;
}

export function ddbDiagramIsValid(obj) {
  return new Validator().validate(obj, ddbSchema).valid;
}
