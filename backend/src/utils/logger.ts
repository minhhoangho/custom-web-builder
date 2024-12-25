import { isEmpty } from 'lodash';
import { format, transports, LoggerOptions } from 'winston';

const { combine, timestamp, printf, metadata, align, splat, errors } = format;
export const loggerOption: LoggerOptions = {
  format: combine(
    errors({ stack: true }),
    metadata(),
    timestamp(),
    align(),
    splat(),
    printf((info) => {
      const data = [info.timestamp, `[${info.level}]`, info.message];

      if (!isEmpty(info.metadata)) {
        data.push(JSON.stringify(info.metadata));
      }
      return data.join(' ');
    }),
  ),
  transports: [
    // new transports.File({
    //   filename: `${moment().format('YYYY-MM-DD')}.log`,
    //   dirname: path.join(__dirname, '../../../', loadConfig.logPath || 'logs'),
    //   level: loadConfig.logLevel || 'info',
    //   handleExceptions: true
    // })
    new transports.Console(),
  ],
};
