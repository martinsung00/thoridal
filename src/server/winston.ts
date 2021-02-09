import winston from "winston";

export default abstract class WinstonLogger {
  className: string;
  logger: winston.Logger;

  constructor(className: string = "<Gateway$ClassName>") {
    this.className = className;

    const { combine, timestamp, json, prettyPrint, colorize } = winston.format;

    this.logger = winston.createLogger({
      /* RFC5424-compliant and supports level 4 and higher. Quite reliable. */
      level: "verbose",
      format: combine(timestamp(), json(), prettyPrint(), colorize()),
      transports: [new winston.transports.Console()],
    });
  }
}
