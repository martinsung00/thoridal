import request from "supertest";
import app from "../../src/server/routes";
import { Trade } from "../../src/server/types";

describe("PUT Endpoint", function () {
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
    created_at: "MM/DD/YYYY",
    trade_status: true,
  };

  it("should create a new trade when calling PUT", async function (done) {
    request(app)
      .put(`/trade/user/write`)
      .send(trade)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe("GET Endpoints", () => {
  it("should retrieve trades by search parameter: job ID", function (done) {
    const jobID = "abc";

    request(app)
      .get(`/trade/${jobID}/find`)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should retrieve trades by search parameter: ticker", async function (done) {
    const ticker = "ABC";

    request(app)
      .get(`/trade/${ticker}/find`)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should retrieve trades by search parameter: company", async function (done) {
    const company = "Test";

    request(app)
      .get(`/trade/${company}/find`)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should retrieve trades by search parameter: date", async function (done) {
    const date = "MM/DD/YYYY";

    request(app)
      .get(`/trade/${date}/find`)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});
