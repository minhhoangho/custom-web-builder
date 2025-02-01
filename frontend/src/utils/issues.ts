// import { isFunction } from './utils';
import { isFunction } from 'src/utils';
import { dbToTypes } from 'src/data/datatypes';

import i18n from 'src/i18n/i18n';
import { DBValueType, DField, DTemplate } from '../data/interface';

function checkDefault(field: DField, database: DBValueType): boolean {
  if (field.default === '') return true;

  if (isFunction(field.default)) return true;

  if (!field.notNull && field.default.toLowerCase() === 'null') return true;

  if (!dbToTypes[database][field['type']].checkDefault) return true;

  return dbToTypes[database][field['type']].checkDefault(field);
}

export function getIssues(diagram: Partial<DTemplate>) {
  const issues: string[] = [];
  const duplicateTableNames: Record<string, boolean> = {};

  diagram.tables?.forEach((table) => {
    if (table.name === '') {
      issues.push(i18n.t('table_w_no_name'));
    }

    if (duplicateTableNames[table.name]) {
      issues.push(i18n.t('duplicate_table_by_name', { tableName: table.name }));
    } else {
      duplicateTableNames[table.name] = true;
    }

    const duplicateFieldNames: Record<string, boolean> = {};
    let hasPrimaryKey = false;

    table.fields.forEach((field) => {
      if (field.primary) {
        hasPrimaryKey = true;
      }
      if (field['name'] === '') {
        issues.push(i18n.t('empty_field_name', { tableName: table.name }));
      }

      // @ts-ignore
      if (field['type'] === '') {
        issues.push(i18n.t('empty_field_type', { tableName: table.name }));
      } else if (field['type'] === 'ENUM' || field['type'] === 'SET') {
        if (!field.values || field.values.length === 0) {
          issues.push(
            i18n.t('no_values_for_field', {
              tableName: table.name,
              fieldName: field['name'],
              type: field['type'],
            }),
          );
        }
      }

      if (!checkDefault(field, diagram.database as DBValueType)) {
        issues.push(
          i18n.t('default_doesnt_match_type', {
            tableName: table.name,
            fieldName: field['name'],
          }),
        );
      }

      if (field.notNull && field.default.toLowerCase() === 'null') {
        issues.push(
          i18n.t('not_null_is_null', {
            tableName: table.name,
            fieldName: field['name'],
          }),
        );
      }

      if (duplicateFieldNames[field['name']]) {
        issues.push(
          i18n.t('duplicate_fields', {
            tableName: table.name,
            fieldName: field['name'],
          }),
        );
      } else {
        duplicateFieldNames[field['name']] = true;
      }
    });

    const duplicateIndices: Record<string, boolean> = {};
    table.indices.forEach((index) => {
      if (duplicateIndices[index.name]) {
        issues.push(
          i18n.t('duplicate_index', {
            tableName: table.name,
            indexName: index.name,
          }),
        );
      } else {
        duplicateIndices[index.name] = true;
      }
    });

    table.indices.forEach((index) => {
      if (index.name.trim() === '') {
        issues.push(
          i18n.t('empty_index_name', {
            tableName: table.name,
          }),
        );
      }
      if (index.fields.length === 0) {
        issues.push(
          i18n.t('empty_index', {
            tableName: table.name,
          }),
        );
      }
    });

    if (!hasPrimaryKey) {
      issues.push(i18n.t('no_primary_key', { tableName: table.name }));
    }
  });

  const duplicateTypeNames: Record<string, boolean> = {};
  diagram.types?.forEach((type) => {
    if (type.name === '') {
      issues.push(i18n.t('type_with_no_name'));
    }

    if (duplicateTypeNames[type.name]) {
      issues.push(i18n.t('duplicate_types', { typeName: type.name }));
    } else {
      duplicateTypeNames[type.name] = true;
    }

    if (type.fields.length === 0) {
      issues.push(i18n.t('type_w_no_fields', { typeName: type.name }));
      return;
    }

    const duplicateFieldNames: Record<string, boolean> = {};
    type.fields.forEach((field) => {
      if (field['name'] === '') {
        issues.push(
          i18n.t('empty_type_field_name', {
            typeName: type.name,
          }),
        );
      }

      if (field['type'] === '') {
        issues.push(
          i18n.t('empty_type_field_type', {
            typeName: type.name,
          }),
        );
      } else if (field['type'] === 'ENUM' || field['type'] === 'SET') {
        if (!field.values || field.values.length === 0) {
          issues.push(
            i18n.t('no_values_for_type_field', {
              typeName: type.name,
              fieldName: field['name'],
              type: field['type'],
            }),
          );
        }
      }

      if (duplicateFieldNames[field['name']]) {
        i18n.t('duplicate_type_fields', {
          typeName: type.name,
          fieldName: field['name'],
        });
      } else {
        duplicateFieldNames[field['name']] = true;
      }
    });
  });

  const duplicateEnumNames: Record<string, boolean> = {};
  diagram.enums?.forEach((e) => {
    if (e.name === '') {
      issues.push(i18n.t('enum_w_no_name'));
    }

    if (duplicateEnumNames[e.name]) {
      issues.push(i18n.t('duplicate_enums', { enumName: e.name }));
    } else {
      duplicateEnumNames[e.name] = true;
    }

    if (e.values.length === 0) {
      issues.push(i18n.t('enum_w_no_values', { enumName: e.name }));
      return;
    }
  });

  const duplicateFKName: Record<string, boolean> = {};
  diagram.relationships?.forEach((r) => {
    if (duplicateFKName[r.name]) {
      issues.push(
        i18n.t('duplicate_reference', {
          refName: r.name,
        }),
      );
    } else {
      duplicateFKName[r.name] = true;
    }
  });

  const visitedTables = new Set();

  function checkCircularRelationships(tableId: number, visited: number[] = []) {
    if (visited.includes(tableId)) {
      issues.push(
        i18n.t('circular_dependency', {
          refName: diagram.tables?.[tableId]?.name,
        }),
      );
      return;
    }

    visited.push(tableId);
    visitedTables.add(tableId);

    diagram.relationships.forEach((r) => {
      if (r.startTableId === tableId && r.startTableId !== r.endTableId) {
        checkCircularRelationships(r.endTableId, [...visited]);
      }
    });
  }

  diagram.tables?.forEach((table) => {
    if (!visitedTables.has(table.id)) {
      checkCircularRelationships(table.id);
    }
  });

  return issues;
}
