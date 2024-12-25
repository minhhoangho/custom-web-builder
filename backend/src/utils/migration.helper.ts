import * as _ from 'lodash';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';
import envConfig from 'src/configs';

export class MigrationHelper {
  public static intIdPrimary(): TableColumnOptions {
    return {
      name: 'id',
      type: 'int',
      isPrimary: true,
      isNullable: false,
      isGenerated: true,
      generationStrategy: 'increment',
    };
  }

  private static getDBType(): string {
    return envConfig.db.type;
  }

  private static _isPostgres(): boolean {
    return envConfig.db.type === 'postgres';
  }

  private static _getTimeStampType(): string {
    let timestampType = 'timestamp';

    if (this._isPostgres()) {
      timestampType = 'timestamptz';
    }
    return timestampType;
  }

  public static uuidPrimary(
    { name = 'id' } = { name: 'id' },
  ): TableColumnOptions {
    let type = 'varchar';

    if (this._isPostgres()) {
      type = 'uuid';
    }

    return {
      name,
      type,
      isPrimary: true,
      isNullable: false,
      length: '36',
      generationStrategy: 'uuid',
    };
  }

  public static uuid({
    name,
    isNullable = true,
    isUnique = false,
  }): TableColumnOptions {
    return {
      name,
      type: 'uuid',
      isNullable,
      isUnique,
    };
  }

  public static timestamps(): TableColumnOptions[] {
    const columns: TableColumnOptions[] = [
      {
        name: 'created_at',
        type: this._getTimeStampType(),
        length: '6',
        default: 'CURRENT_TIMESTAMP(6)',
      },
      {
        name: 'updated_at',
        type: this._getTimeStampType(),
        length: '6',
        isNullable: true,
        default: 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
      },
    ];
    return columns;
  }

  public static datetime({
    name,
    isNullable = true,
    isUnique = false,
    defaultValue = null,
  }): TableColumnOptions {
    return {
      name,
      isNullable,
      isUnique,
      default: defaultValue,
      type: this._getTimeStampType(),
    };
  }

  public static boolean({
    name,
    isNullable = true,
    isUnique = false,
    defaultValue = null,
  }): TableColumnOptions {
    return {
      name,
      isNullable,
      isUnique,
      default: defaultValue,
      type: 'boolean',
    };
  }

  public static timestampsWithDelete(): TableColumnOptions[] {
    return [...this.timestamps(), this.softDeleteTimestamp()];
  }

  public static varchar({
    name,
    length = 255,
    isPrimary = false,
    isNullable = true,
    isUnique = false,
    defaultValue = null,
  }: {
    name: string;
    length?: number;
    isPrimary?: boolean;
    isNullable?: boolean;
    isUnique?: boolean;
    defaultValue?: string | null;
  }): TableColumnOptions {
    return {
      name,
      length: length.toString(),
      isPrimary,
      isNullable,
      isUnique,
      default: !_.isNull(defaultValue) ? `'${defaultValue}'` : null,
      type: 'varchar',
    };
  }

  public static text({
    name,
    isNullable = true,
    defaultValue = null,
  }: {
    name: string;
    isNullable?: boolean;
    defaultValue?: string | null;
  }): TableColumnOptions {
    return {
      name,
      isNullable,
      type: 'text',
      default: !_.isNull(defaultValue) ? `'${defaultValue}'` : null,
    };
  }

  public static integer({
    name,
    isPrimary = false,
    isNullable = false,
    isUnique = false,
    defaultValue = null,
  }: {
    name: string;
    length?: number;
    isPrimary?: boolean;
    isNullable?: boolean;
    isUnique?: boolean;
    defaultValue?: any;
  }): TableColumnOptions {
    return {
      name,
      isPrimary,
      isNullable,
      isUnique,
      default: !_.isNull(defaultValue) ? `'${defaultValue}'` : null,
      type: 'int',
    };
  }

  public static tinyInteger({
    name,
    isNullable = false,
    isUnique = false,
    defaultValue = null,
  }: {
    name: string;
    isNullable?: boolean;
    isUnique?: boolean;
    defaultValue?: any;
  }): TableColumnOptions {
    return {
      name,
      isNullable,
      isUnique,
      default: !_.isNull(defaultValue) ? `'${defaultValue}'` : null,
      type: 'tinyint',
    };
  }

  public static float({
    name,
    isNullable = true,
    defaultValue = null,
  }: {
    name: string;
    isNullable?: boolean;
    defaultValue?: number;
  }): TableColumnOptions {
    return {
      name,
      isNullable,
      default: defaultValue,
      type: 'float',
    };
  }

  public static enum({
    name,
    enum: enumVals,
    isNullable = false,
  }): TableColumnOptions {
    return {
      name,
      enum: enumVals,
      isPrimary: false,
      isNullable,
      type: 'enum',
    };
  }

  public static jsonb({
    name,
    isNullable = true,
    defaultValue = null,
  }): TableColumnOptions {
    return {
      name,
      isPrimary: false,
      isNullable,
      type: 'jsonb', // this type is for postgres database
      default: defaultValue,
    };
  }

  public static json({
    name,
    isNullable = true,
    defaultValue = null,
  }): TableColumnOptions {
    return {
      name,
      isPrimary: false,
      isNullable,
      type: 'json',
      default: defaultValue,
    };
  }

  public static softDeleteTimestamp(): TableColumnOptions {
    return {
      name: 'deleted_at',
      type: this._getTimeStampType(),
      length: '6',
      isNullable: true,
      default: null,
    };
  }

  public static userInteractionFields(): TableColumnOptions[] {
    return [
      {
        name: 'created_by',
        type: 'int',
        isNullable: true,
        default: null,
      },
      {
        name: 'updated_by',
        type: 'int',
        isNullable: true,
        default: null,
      },
    ];
  }

  public static userInteractionFieldSoftDelete(): TableColumnOptions {
    return {
      name: 'deleted_by',
      type: 'int',
      isNullable: true,
      default: null,
    };
  }

  public static userInteractionFieldsWithSoftDelete(): TableColumnOptions[] {
    return [
      ...this.userInteractionFields(),
      this.userInteractionFieldSoftDelete(),
    ];
  }
}
