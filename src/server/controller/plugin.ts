import { PostgresGateway } from "../gateways/index";
import { Trade } from "../types";

export default class Controller {
  db: PostgresGateway;

  constructor() {
    this.db = new PostgresGateway();
  }

  public async write(body: Trade): Promise<{}> {
    try {
      const id = await this.db.write(body);
      return id;
    } catch (error) {
      throw error;
    }
  }

  public async read(id: string): Promise<Trade> {
    try {
      const trade = await this.db.read(id);
      return trade;
    } catch (error) {
      throw error;
    }
  }

  public async readByTicker(ticker: string): Promise<Trade> {
    try {
      const trade = await this.db.readByTicker(ticker);
      return trade;
    } catch (error) {
      throw error;
    }
  }

  public async readByCompany(company: string): Promise<Trade> {
    try {
      const trade = await this.db.readByCompany(company);
      return trade;
    } catch (error) {
      throw error;
    }
  }

  public async readByDate(date: string): Promise<Trade> {
    try {
      const trade = await this.db.readByDate(date);
      return trade;
    } catch (error) {
      throw error;
    }
  }
}
