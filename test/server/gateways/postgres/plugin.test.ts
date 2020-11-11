import pg from "pg";
import { PostgresGateway } from "./../../../../src/server/gateways";
import { TRADE } from "./../../common";

describe("Postgres Gateway Tests", function () {
  jest.mock("pg");

  const db = new PostgresGateway();

  describe("Write Action", function () {
    beforeAll(function () {
      /* To-do: Convert this into a fake. This will not scale. */
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [{ id: TRADE.id }],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should write a trade to db and return an id", async function () {
      const result = await db.write(TRADE);

      expect(result.rows).toEqual([
        {
          id: TRADE.id,
        },
      ]);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(
        `INSERT INTO trades VALUES(${TRADE.id}, ${TRADE.ticker}, ${TRADE.company_name}, ${TRADE.reference_number}, ${TRADE.unit_price}, ${TRADE.quantity}, ${TRADE.total_cost}, ${TRADE.trade_type}, ${TRADE.note}, ${TRADE.created_at}, ${TRADE.trade_status}) RETURNING id`,
        [
          TRADE.id,
          TRADE.ticker,
          TRADE.company_name,
          TRADE.reference_number,
          -1,
          -1,
          -1,
          TRADE.trade_type,
          TRADE.note,
          TRADE.created_at,
          TRADE.trade_status,
        ]
      );
    });

    it("should throw an error if write action fails", async function () {
      pg.Client.prototype.query = jest.fn().mockImplementation(function () {
        throw new Error();
      });

      /* To-do: Spy on the logger invocation. */
      await expect(db.write(TRADE)).rejects.toThrow(Error);
    });
  });

  describe("Read Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(TRADE);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given an id", async function () {
      const result = await db.readById(TRADE.id);
      expect(result).toEqual(TRADE);
    });

    it("should throw an error if reading by id fails", async function () {
      pg.Client.prototype.query = jest.fn().mockImplementation(function () {
        throw new Error();
      });

      await expect(db.readById(TRADE.id)).rejects.toThrow(Error);
    });
  });

  describe("Read Action by Ticker", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(TRADE);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given a ticker", async function () {
      const result = await db.readByTicker(TRADE.ticker);
      expect(result).toEqual(TRADE);
    });

    it("should throw an error if reading by ticker fails", async function () {
      pg.Client.prototype.query = jest.fn().mockImplementation(function () {
        throw new Error();
      });

      await expect(db.readByTicker(TRADE.ticker)).rejects.toThrow(Error);
    });
  });

  describe("Read Action by Company Name", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(TRADE);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given a company name", async function () {
      const result = await db.readByCompany(TRADE.company_name);
      expect(result).toEqual(TRADE);
    });

    it("should throw an error if reading by company name fails", async function () {
      pg.Client.prototype.query = jest.fn().mockImplementation(function () {
        throw new Error();
      });

      /* To-do: Spy on the logger invocation. */
      await expect(db.readByCompany(TRADE.company_name)).rejects.toThrow(Error);
    });
  });

  describe("Read Action by Date", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(TRADE);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return a document given a date", async function () {
      const result = await db.readByDate(TRADE.created_at);
      expect(result).toEqual(TRADE);
    });

    it("should throw an error if write action fails", async function () {
      pg.Client.prototype.query = jest.fn().mockImplementation(function () {
        throw new Error();
      });

      await expect(db.readByDate(TRADE.created_at)).rejects.toThrow(Error);
    });
  });
});
