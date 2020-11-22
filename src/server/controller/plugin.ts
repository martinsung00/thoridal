import Gateway from "../gateways/gateway";
import { PostgresGateway } from "../gateways/index";
import { Trade } from "../types";

export default class Controller extends Gateway {
  db: PostgresGateway;

  constructor() {
    super("Controller");

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
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async update(
    body: Trade
  ): Promise<{
    rows: Array<{ id: string }>;
  }> {
    try {
      const id = await this.db.update(body);
      return id;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async delete(
    id: string
  ): Promise<{
    rows: Array<{ id: string }>;
  }> {
    try {
      const response = await this.db.delete(id);
      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async read(
    id: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    try {
      const response = await this.db.read(id);
      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async readByTicker(
    ticker: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    try {
      const response = await this.db.readByTicker(ticker);
      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async readByCompany(
    company: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    try {
      const response = await this.db.readByCompany(company);
      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }
  public async readByReferenceNumber(
    refNum: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    try {
      const response = await this.db.readByReferenceNumber(refNum);
      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public async readByDate(
    date: string
  ): Promise<{
    rows: Array<Trade>;
  }> {
    try {
      const response = await this.db.readByDate(date);
      return response;
    } catch (err) {
      this.logger.log("error", "Error:", err);

      throw err;
    }
  }

  public generateDate(): string {
    const today: Date = new Date();
    const dd: String = String(today.getDate()).padStart(2, "0");
    const mm: String = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy: String = String(today.getFullYear());
    const date: string = `${mm}-${dd}-${yyyy}`;

    return date;
  }
}
