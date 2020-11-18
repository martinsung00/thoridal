import { PostgresGateway } from "../gateways/index";
import { Trade } from "../types";

export default class Controller {
  db: PostgresGateway;

  constructor() {
    this.db = new PostgresGateway();
  }

  public async write(
    body: Trade
  ): Promise<{
    rows: Array<{ id: string }>;
  }> {
    try {
      const id = await this.db.write(body);
      return id;
    } catch (err) {
      this.db.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async read(id: string): Promise<object> {
    try {
      const response = await this.db.read(id);
      return response;
    } catch (err) {
      this.db.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async readByTicker(ticker: string): Promise<object> {
    try {
      const response = await this.db.readByTicker(ticker);
      return response;
    } catch (err) {
      this.db.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async readByCompany(company: string): Promise<object> {
    try {
      const response = await this.db.readByCompany(company);
      return response;
    } catch (err) {
      this.db.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async readByDate(date: string): Promise<object> {
    try {
      const response = await this.db.readByDate(date);
      return response;
    } catch (err) {
      this.db.logger.log("error", "Error:", err);

      throw err;
    }
  }
}
