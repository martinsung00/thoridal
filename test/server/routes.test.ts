import request from "supertest";
import app from "../../src/server/routes";
import { Trade } from "../../src/server/types";

describe("PUT Endpoint", function () {
  const trade: Trade = {
    id: "1",
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

  it("should create a new trade when calling PUT", async function (done) {
    request(app)
      .put(`/trade/user/write`)
      .send(trade)
      .set("Accept", "application/json")
      .type("json")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should return an empty result the trade id is already in use", async function (done) {
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

describe("GET Endpoints", function () {
  describe("GET by id Endpoint", function () {
    it("should retrieve trades by search parameter: job id", function (done) {
      const id = "1";

      request(app)
        .get(`/trade/id/find/${id}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return an empty result the searched parameter is incorrect", function (done) {
      const badRequest = -20;

      request(app)
        .get(`/trade/id/find/${badRequest}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        })
    });
  });

  describe("GET by ticker Endpoint", function () {
    it("should retrieve trades by search parameter: ticker", async function (done) {
      const ticker = "ABC";

      request(app)
        .get(`/trade/ticker/find/${ticker}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return an empty result the searched parameter is incorrect", async function (done) {
      const badRequest = -20;

      request(app)
        .get(`/trade/ticker/find/${badRequest}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET by company name Endpoint", function () {
    it("should retrieve trades by search parameter: company", async function (done) {
      const company = "Test";

      request(app)
        .get(`/trade/company/find/${company}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return an empty result the searched parameter is incorrect", async function (done) {
      const badRequest = -20;

      request(app)
        .get(`/trade/company/find/${badRequest}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("GET by date Endpoint", function () {
    it("should retrieve trades by search parameter: date", async function (done) {
      const date = "MM-DD-YYYY";

      request(app)
        .get(`/trade/date/find/${date}`)
        .expect("Content-type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should return an empty result the searched parameter is incorrect", async function (done) {
      const badRequest = -20;

      request(app)
        .get(`/trade/date/find/${badRequest}`)
        .expect("Content-type", "application/json; charset=utf-8")
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });
});
