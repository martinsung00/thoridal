import Gateway from "./../gateway";
import { Pool, PoolClient, QueryResult } from "pg";
import { Trade } from "./../../types";
import { TRANSACTIONS } from "./constants";
import VAULT from "./../../../../vault/dev.json";

export default class PostgresGateway extends Gateway {
  pool: Pool;

  constructor() {
    super("PostgresGateway");

    // To-do: Read these from environment.
    const { user, host, database, password, port } = VAULT;

    this.pool = new Pool({
      user,
      host,
      database,
      password,
      port,
    });
  }

  public async read(id: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE id = $1`;

      const response: QueryResult = await client.query(queryText, [id]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      // To-do: We should be handling this according to the design.
      await client.query(TRANSACTIONS.ROLLBACK);
      this.logger.log('error', 'Id lookup failed');
      throw err;
    } finally {
      client.release();
    }
  }

  public async readByTicker(ticker: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE ticker = $1`;

      const response: QueryResult = await client.query(queryText, [ticker]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      await client.query(TRANSACTIONS.ROLLBACK);
      this.logger.log('error', 'Ticker lookup failed');
      throw err;
    } finally {
      client.release();
    }
  }

  public async readByCompany(company: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE company_name = $1`;

      const response: QueryResult = await client.query(queryText, [company]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      await client.query(TRANSACTIONS.ROLLBACK);
      this.logger.log('error', 'Company lookup failed');
      throw err;
    } finally {
      client.release();
    }
  }

  public async readByDate(date: string): Promise<any> {
    const client: PoolClient = await this.pool.connect();

    try {
      const queryText: string = `SELECT * FROM trades WHERE created_at = $1`;

      const response: QueryResult = await client.query(queryText, [date]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      await client.query(TRANSACTIONS.ROLLBACK);
      this.logger.log('error', 'Date lookup failed');
    } finally {
      client.release();
    }
  }

  public async write(
    document: Trade
  ): Promise<{
    rows: Array<{ id: string }>;
  }> {
    const client: PoolClient = await this.pool.connect();

    try {
      const {
        id,
        ticker,
        company_name,
        reference_number,
        unit_price,
        quantity,
        total_cost,
        trade_type,
        note,
        created_at,
        trade_status,
      } = document;

      const queryText: string = `INSERT INTO trades (id, ticker, company_name, reference_number, unit_price, quantity, total_cost, trade_type, note, created_at, trade_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`;

      const response: QueryResult = await client.query(queryText, [
        id,
        ticker,
        company_name,
        reference_number,
        unit_price,
        quantity,
        total_cost,
        trade_type,
        note,
        created_at,
        trade_status,
      ]);

      await client.query(TRANSACTIONS.COMMIT);

      return response;
    } catch (err) {
      // To-do: We should be handling this according to the design.
      this.logger.log('error', 'Write Failed');
      await client.query(TRANSACTIONS.ROLLBACK);
      throw err;
    } finally {
      client.release();
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
