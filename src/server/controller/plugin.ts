import { PostgresGateway } from "../gateways";
import Gateway from "../gateways/gateway";
import { Trade } from "../types";

/* To-do: We'll need to further abstract Gateway. */
export default class Controller extends Gateway {
  db: PostgresGateway;

  constructor() {
    super("Controller");
    this.db = new PostgresGateway();
  }

  public async write(
    trade: Trade
  ): Promise<{
    rows: Array<{
      id: string;
    }>;
  }> {
    try {
      return await this.db.write(trade);
    } catch (err) {
      this.logger.verbose({ err });
      throw err;
    }
  }

  public async read(id: string): Promise<Trade> {
    try {
      return await this.db.readById(id);
    } catch (err) {
      this.logger.verbose({ err });
      throw err;
    }
  }
}
