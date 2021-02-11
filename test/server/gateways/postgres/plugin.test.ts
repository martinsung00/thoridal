import pg from "pg";
import { Trade } from "../../../../src/server/types";
import { PostgresGateway } from "./../../../../src/server/gateways";

describe("Postgres Gateway Tests", function () {
  jest.mock("pg", () => {
    const mClient = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
  });

  const date = new Date();
  const db = new PostgresGateway();
  const trade: Trade = {
    id: "abc",
    ticker: "ABC",
    company_name: "",
    reference_number: "",
    unit_price: 0,
    quantity: 0,
    total_cost: 0,
    trade_type: "long",
    note: "",
    created_at: date,
    trade_status: true,
    trade_action: "bought",
  };
  const logger = jest.spyOn(db.logger, "log");

  afterAll(function () {
    jest.resetModules();
  });

  describe("Write Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should write a trade to the database and return an id", async function (done) {
      const result = await db.write(trade);

      expect(result.rows).toEqual([
        {
          id: "abc",
        },
      ]);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(
        "INSERT INTO trades (id, ticker, company_name, reference_number, unit_price, quantity, total_cost, trade_type, note, created_at, trade_status, trade_action) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id",
        [
          trade.id,
          trade.ticker,
          trade.company_name,
          trade.reference_number,
          trade.unit_price,
          trade.quantity,
          trade.total_cost,
          trade.trade_type,
          trade.note,
          trade.created_at,
          trade.trade_status,
          trade.trade_action,
        ]
      );
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      /*
    Since the error message will always match what is thrown in the stub,
    it is wiser to test if Winston is able to log errors instead.
    */
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.write(trade);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Update Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should write a trade to the database and return an id", async function (done) {
      const result = await db.update(trade);

      expect(result.rows).toEqual([
        {
          id: "abc",
        },
      ]);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(
        "UPDATE trades SET ticker = $1, company_name = $2, reference_number = $3, unit_price = $4, quantity = $5, total_cost = $6, trade_type = $7, note = $8, created_at = $9, trade_status = $10, trade_action = $11, id = $12 WHERE id = $12 RETURNING id",
        [
          trade.ticker,
          trade.company_name,
          trade.reference_number,
          trade.unit_price,
          trade.quantity,
          trade.total_cost,
          trade.trade_type,
          trade.note,
          trade.created_at,
          trade.trade_status,
          trade.trade_action,
          trade.id,
        ]
      );
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      /*
    Since the error message will always match what is thrown in the stub,
    it is wiser to test if Winston is able to log errors instead.
    */
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.update(trade);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Read Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return document(s) with a given id", async function (done) {
      const result = await db.read(trade.id);

      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith("SELECT * FROM trades WHERE id = $1", [trade.id]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.read(trade.id);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Read First Five (Descending Order By Created At) Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [trade],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return document(s) with a given id", async function (done) {
      const result = await db.readFive();

      expect(result.rows[0].id).toEqual(trade.id);
      expect(pg.Client.prototype.query).toHaveBeenCalledWith(
        "SELECT * FROM trades WHERE created_at > now() - INTERVAL '1 week'"
      );
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.readFive();
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Read All Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue({
        rows: [trade],
      });
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return document(s) with a given id", async function (done) {
      const result = await db.readAll();

      expect(result.rows[0].id).toEqual(trade.id);
      expect(pg.Client.prototype.query).toHaveBeenCalledWith(
        "SELECT * FROM trades"
      );
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.readAll();
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Read Action by Ticker", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return document(s) with a given ticker", async function (done) {
      const result = await db.readByTicker(trade.ticker);

      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith("SELECT * FROM trades WHERE ticker = $1", [
        trade.ticker,
      ]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.readByTicker(trade.ticker);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Read Action by Company Name", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return document(s) with a given company name", async function (done) {
      const result = await db.readByCompany(trade.company_name);

      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith("SELECT * FROM trades WHERE company_name = $1", [
        "",
      ]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.readByCompany(trade.company_name);
      } catch (error) {
        expect(logger).toHaveBeenCalledTimes(1);
        expect(error.message).toBe("Fake Error");
        done();
      }
    });
  });

  describe("Read Action by Date", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return document(s) with a given date", async function (done) {
      const result = await db.readByDate(date);

      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith("SELECT * FROM trades WHERE created_at = $1", [
        date,
      ]);

      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.readByDate(date);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Read Action by Reference Number", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should return document(s) with a given reference number", async function (done) {
      const result = await db.readByReferenceNumber(trade.reference_number);

      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith(
        "SELECT * FROM trades WHERE reference_number = $1",
        [trade.reference_number]
      );
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.readByReferenceNumber(trade.reference_number);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  describe("Delete Action", function () {
    beforeAll(function () {
      pg.Client.prototype.query = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should delete a document with the given id", async function (done) {
      const result = await db.delete(trade.id);

      expect(result).toEqual(trade);
      expect(
        pg.Client.prototype.query
      ).toHaveBeenCalledWith("DELETE FROM trades WHERE id = $1 RETURNING id", [
        trade.id,
      ]);
      await done();
    });

    it("should create a log with Winston's logger if an error occurs", async function (done) {
      try {
        pg.Client.prototype.query = jest
          .fn()
          .mockRejectedValueOnce(new TypeError("Fake Error"));

        await db.delete(trade.id);
      } catch (error) {
        expect(error.message).toBe("Fake Error");
        expect(logger).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });
});
