export enum ErrorCode {
  // Common error code
  UNAUTHORIZED = 'ER-0401',
  INTERNAL_SERVER_ERROR = 'ER-0500',
  NOT_FOUND = 'ER-0404',
  INVALID_PARAMETER = 'ER-0600',
  BAD_REQUEST = 'ER-0400',
  UNPROCESSABLE_ENTITY = 'ER-0422',

  // Form error code
  FIELD_REQUIRED = 'FI-0001',
  FIELD_TYPE = 'FO-0002',
  FIELD_ONLY = 'FO-0003',
  FIELD_TYPE_RANGE = 'FO-0004',
  FIELD_UNKNOWN = 'FO-0005',
  STRING_LENGTH = 'FO-0006',

  // ID
  INVALID_ID = 'ID-0001',

  // User
  EXPIRED_PASSWORD = 'PD-0001',
  INVALID_RESET_PASSWORD_TOKEN = 'PD-0002',
  EMAIL_EXISTED = 'EM-0001',
}
