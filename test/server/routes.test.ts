import { app } from "../../src/server/index";
import { Trade } from "../../src/server/types";
import { PostgresGateway } from "../../src/server/gateways/index";
import supertest from "supertest";

describe("Endpoints Behavior Test", function () {
  let module: { [port: string]: "" };

  beforeAll(function () {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterAll(function (done) {
    jest.resetAllMocks();
    jest.resetModules();
    delete process.env.PORT;
    done();
  });

  it("should reject falsy routes and return 404 not found", function (done) {
    supertest(app)
      .get("/falsy/route")
      .expect(404)
      .expect("Content-type", "text/html; charset=utf-8")
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should not use the default 3000 port if a custom port is provided", async function (done) {
    process.env.PORT = "5000";
    jest.isolateModules(function () {
      module = require("../../src/server/index");
    });
    expect(module.port).toEqual(5000);

    done();
  });
});

describe("PUT Endpoint Tests", function () {
  describe("Write Action", function () {
    jest.mock("../../src/server/gateways/index");

    const trade: Trade = {
      id: "abc",
      ticker: "ABC",
      company_name: "Test",
      reference_number: "12345",
      unit_price: 0,
      quantity: 0,
      total_cost: 0,
      trade_type: "long",
      note: "This is a test.",
      created_at: new Date(),
      trade_status: true,
      trade_action: "sold",
    };

    const updateTrade: Trade = {
      id: "abc",
      ticker: "DEF",
      company_name: "Update Test",
      reference_number: "67890",
      unit_price: 0,
      quantity: 0,
      total_cost: 0,
      trade_type: "short",
      note: "This is an updated test.",
      created_at: new Date(),
      trade_status: true,
      trade_action: "bought",
    };

    beforeEach(function () {
      jest.resetModules();
    });

    afterEach(function () {
      jest.resetAllMocks();
    });

    it("should create a new trade if ID is not in use and return a 200 OK status", async function (done) {
      PostgresGateway.prototype.read = jest.fn().mockResolvedValue({
        rows: [],
      });

      PostgresGateway.prototype.write = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });

      supertest(app)
        .put("/trade/user/write")
        .send(trade)
        .set("Accept", "application/json")
        .type("json")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          expect(PostgresGateway.prototype.read).toHaveBeenCalledTimes(1);
          expect(PostgresGateway.prototype.read).toHaveBeenCalledWith(trade.id);
          expect(PostgresGateway.prototype.write).toHaveBeenCalledTimes(1);
          done();
        });
    });

    it("should update an existing trade if ID is in use and return a 200 OK status", async function (done) {
      PostgresGateway.prototype.read = jest.fn().mockResolvedValue({
        rows: [{}, {}],
      });

      PostgresGateway.prototype.update = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });

      supertest(app)
        .put("/trade/user/write")
        .send(updateTrade)
        .set("Accept", "application/json")
        .type("json")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          expect(PostgresGateway.prototype.read).toHaveBeenCalledTimes(1);
          expect(PostgresGateway.prototype.read).toHaveBeenCalledWith(trade.id);
          expect(PostgresGateway.prototype.update).toHaveBeenCalledTimes(1);
          done();
        });
    });

    it("should return a status of 400 Bad supertest if supertest body is faulty", function (done) {
      const faultyBody: object = {};

      supertest(app)
        .put("/trade/user/write")
        .send(faultyBody)
        .set("Accept", "application/json")
        .type("json")
        .expect(400)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return a 500 Internal Server Error if the read method fails", async function (done) {
      PostgresGateway.prototype.read = jest
        .fn()
        .mockRejectedValueOnce(new Error("Fake Error"));

      supertest(app)
        .put("/trade/user/write")
        .send(trade)
        .set("Accept", "application/json")
        .type("json")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return a 500 Internal Server Error if the write method fails", async function (done) {
      PostgresGateway.prototype.read = jest.fn().mockResolvedValue({
        rows: [],
      });

      PostgresGateway.prototype.write = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .put("/trade/user/write")
        .send(trade)
        .set("Accept", "application/json")
        .type("json")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return a 500 Internal Server Error if the update method fails", async function (done) {
      PostgresGateway.prototype.read = jest.fn().mockResolvedValue({
        rows: [{}, {}],
      });

      PostgresGateway.prototype.update = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .put("/trade/user/write")
        .send(trade)
        .set("Accept", "application/json")
        .type("json")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });
});

describe("GET Endpoints Tests", function () {
  const trade: Trade = {
    id: "abc",
    ticker: "ABC",
    company_name: "Test",
    reference_number: "12345",
    unit_price: 0,
    quantity: 0,
    total_cost: 0,
    trade_type: "long",
    note: "This is a test.",
    created_at: new Date(),
    trade_status: true,
    trade_action: "bought",
  };

  afterEach(function () {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe("GET all", function () {
    beforeEach(function () {
      jest.resetModules();
      PostgresGateway.prototype.readAll = jest.fn().mockResolvedValue(trade);
    });

    afterEach(function () {
      jest.resetAllMocks();
    });

    it("should retrieve all trades, and return a 200 OK status", async function (done) {
      supertest(app)
        .get("/trade/all/find")
        .expect(200)
        .expect("Content-type", /json/)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fails", async function (done) {
      PostgresGateway.prototype.readAll = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .get("/trade/all/find")
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET first five", function () {
    beforeEach(function () {
      jest.resetModules();
      PostgresGateway.prototype.readFive = jest.fn().mockResolvedValue(trade);
    });

    afterEach(function () {
      jest.resetAllMocks();
    });

    it("should retrieve the first five trades and return a 200 OK status", async function (done) {
      supertest(app)
        .get("/trade/recent/find")
        .expect(200)
        .expect("Content-type", /json/)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fails", async function (done) {
      PostgresGateway.prototype.readFive = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .get("/trade/recent/find")
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET by id Endpoint", function () {
    beforeEach(function () {
      jest.resetModules();
      PostgresGateway.prototype.read = jest.fn().mockResolvedValue(trade);
    });

    afterEach(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: ticker, and return a 200 OK status", async function (done) {
      const id: string = "abc";

      supertest(app)
        .get(`/trade/id/${id}/find`)
        .expect(200)
        .expect("Content-type", /json/)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fails", async function (done) {
      PostgresGateway.prototype.read = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .get(`/trade/id/${"badsupertest"}/find`)
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET by ticker Endpoint Tests", function () {
    beforeAll(function () {
      jest.resetModules();
      PostgresGateway.prototype.readByTicker = jest
        .fn()
        .mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: ticker, and return a 200 OK status", async function (done) {
      const ticker: string = "ABC";

      supertest(app)
        .get(`/trade/ticker/${ticker}/find`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fails", async function (done) {
      PostgresGateway.prototype.readByTicker = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .get(`/trade/ticker/${"badsupertest"}/find`)
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET by company name Endpoint Tests", function () {
    beforeAll(function () {
      jest.resetModules();
      PostgresGateway.prototype.readByCompany = jest
        .fn()
        .mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: company, and returns a 200 OK status", async function (done) {
      const company: string = "Test";

      supertest(app)
        .get(`/trade/company/${company}/find`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fails", async function (done) {
      PostgresGateway.prototype.readByCompany = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .get(`/trade/company/${"badsupertest"}/find`)
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET by date Endpoint Tests", function () {
    beforeAll(function () {
      jest.resetModules();
      PostgresGateway.prototype.readByDate = jest.fn().mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: date, and returns a 200 OK status", async function (done) {
      const date: string = "MM-DD-YYYY";

      supertest(app)
        .get(`/trade/date/${date}/find`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fail", async function (done) {
      PostgresGateway.prototype.readByDate = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .get(`/trade/date/${"badsupertest"}/find`)
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET by reference number Endpoint Tests", function () {
    beforeAll(function () {
      jest.resetModules();
      PostgresGateway.prototype.readByReferenceNumber = jest
        .fn()
        .mockResolvedValue(trade);
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: date, and returns a 200 OK status", async function (done) {
      const reference: string = "Hello World";

      supertest(app)
        .get(`/trade/reference/${reference}/find`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fail", async function (done) {
      PostgresGateway.prototype.readByReferenceNumber = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      supertest(app)
        .get(`/trade/reference/${"Bad supertest"}/find`)
        .expect("Content-type", "text/html; charset=utf-8")
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });
});

describe("Delete Endpoints", function () {
  afterAll(function () {
    jest.resetAllMocks();
  });

  it("should delete a trade and return a status of 200 OK", function (done) {
    PostgresGateway.prototype.delete = jest.fn().mockResolvedValue({
      rows: [
        {
          id: "abc",
        },
      ],
    });

    supertest(app)
      .delete(`/trade/id/${1}/delete`)
      .expect(200)
      .expect("Content-type", /json/)
      .end(function (err) {
        if (err) return done(err);
        expect(PostgresGateway.prototype.delete).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it("should return with a status of 500 Internal Server Error when the database query fail", async function (done) {
    PostgresGateway.prototype.delete = jest
      .fn()
      .mockRejectedValue(new Error("Fake Error"));

    supertest(app)
      .delete(`/trade/id/${1}/delete`)
      .expect("Content-type", "text/html; charset=utf-8")
      .expect(500)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});
