import request from "supertest";
import { app } from "../../src/server/index";
import { Trade } from "../../src/server/types";
import { PostgresGateway } from "../../src/server/gateways/index";

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
    request(app)
      .get("/falsy/route")
      .expect(404)
      .expect("Content-type", "text/html; charset=utf-8")
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should not use the default 3000 port if a custom port is provided", async function () {
    process.env.PORT = "5000";
    jest.isolateModules(function () {
      module = require("../../src/server/index");
    });
    expect(module.port).toEqual(5000);
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
      created_at: "MM-DD-YYYY",
      trade_status: true,
    };

    beforeAll(function () {
      jest.resetModules();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should create a new trade and return a 200 OK status", async function (done) {
      PostgresGateway.prototype.write = jest.fn().mockResolvedValue({
        rows: [
          {
            id: "abc",
          },
        ],
      });

      request(app)
        .put(`/trade/user/write`)
        .send(trade)
        .set("Accept", "application/json")
        .type("json")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          expect(PostgresGateway.prototype.write).toHaveBeenCalledTimes(1);
          done();
        });
    });

    it("should reject a trade that has a duplicate id", async function (done) {
      jest.mock("pg");
      PostgresGateway.prototype.write = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      request(app)
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
  describe("GET by id Endpoint", function () {
    beforeAll(function () {
      jest.resetModules();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: job id, and return a 200 OK status", function (done) {
      const id: string = "1";

      request(app)
        .get(`/trade/id/${id}/find`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return with a status of 500 Internal Server Error when the database query fails", function (done) {
      PostgresGateway.prototype.read = jest
        .fn()
        .mockRejectedValue(new Error("Fake Error"));

      request(app)
        .get(`/trade/id/${"badRequest"}/find`)
        .expect("Content-type", /json/)
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
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: ticker, and return a 200 OK status", async function (done) {
      const ticker: string = "ABC";

      request(app)
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

      request(app)
        .get(`/trade/ticker/${"badRequest"}/find`)
        .expect("Content-type", /json/)
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
      jest.restoreAllMocks();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: company, and returns a 200 OK status", async function (done) {
      const company: string = "Test";

      request(app)
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

      request(app)
        .get(`/trade/company/${"badRequest"}/find`)
        .expect("Content-type", /json/)
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
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: date, and returns a 200 OK status", async function (done) {
      const date: string = "MM-DD-YYYY";

      request(app)
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

      request(app)
        .get(`/trade/date/${"badRequest"}/find`)
        .expect("Content-type", /json/)
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
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should retrieve trades by search parameter: date, and returns a 200 OK status", async function (done) {
      const reference: string = "Hello World";

      request(app)
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

      request(app)
        .get(`/trade/reference/${"Bad Request"}/find`)
        .expect("Content-type", /json/)
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });
});

describe("Delete Endpoints", function () {
  afterEach(function () {
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

    request(app)
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

    request(app)
      .delete(`/trade/id/${1}/delete`)
      .expect("Content-type", /json/)
      .expect(500)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});
