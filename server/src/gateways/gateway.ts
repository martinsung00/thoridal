import winston from "winston";

export default abstract class Gateway {
  className: string;
  logger: winston.Logger;

  constructor() {
    /* You should be overriding this. */
    this.className = "<Gateway$ClassName>";

    const { combine, timestamp, json, prettyPrint, colorize } = winston.format;

    this.logger = winston.createLogger({
      /* RFC5424-compliant and supports level 4 and higher. Quite reliable. */
      level: "verbose",
      format: combine(timestamp(), json(), prettyPrint(), colorize()),
      transports: [new winston.transports.Console()],
    });
  }

  /* Return a heartbeat of base URI to logger transport. */
  public abstract pulse(): void;
}
