import Gateway from "../gateway";
import mongoose from "mongoose";

export default class MongoGateway extends Gateway {
  db: mongoose.Connection;

  constructor(dbName: string) {
    super("MongoGateway");

    this.className = this.constructor.name;

    mongoose.connect(`mongodb://localhost/${dbName}`, {
      useNewUrlParser: true,
    });

    const db = mongoose.connection;

    db.on("error", () =>
      this.logger.error(`${this.className} failed to connect.`)
    );

    db.once("open", () =>
      this.logger.info(`${this.className} connected successfully.`)
    );

    this.db = db;
  }

  public async write() {
    try {
      const t0 = performance.now();

      // To-do: add trade insertion.

      const t1 = performance.now();

      this.logger.debug(`${this.className} –– WRITE –– ${t1 - t0} ms.`);
    } catch (err) {
      // To-do: You'll need better error handling than that.
      throw err;
    }
  }
}
