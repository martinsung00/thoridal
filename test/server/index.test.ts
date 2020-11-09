import request from "supertest";
import app from "../../src/server/index";
import port from "../../src/server/port";
// import enviornment from "../../src/server/enviornment";

describe("App server", function () {
  const oldPORT = process.env;
  beforeEach(function () {
    jest.resetModules();
    process.env = { ...oldPORT };
  });

  afterEach(function (done) {
    jest.resetAllMocks();
    process.env = oldPORT;
    done();
  });

  it("should use the enviornment port if a port is provided", async function () {
    jest.mock("../../src/server/index");
    jest.mock("../../src/server/enviornment", function () {
      process.env.PORT = '5000';
      return process.env.PORT;
    });

    app.listen = jest.fn(function (port) {
      return port;
    });

    const response = await app.listen(port);

    expect(response).toEqual(5000);
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

  it("should return 200 OK for the id get route", function (done) {
    request(app)
      .get("/trade/id/find/id")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should return 200 OK for the ticker get route", function (done) {
    request(app)
      .get("/trade/ticker/find/ticker")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should return 200 OK for the company get route", function (done) {
    request(app)
      .get("/trade/company/find/company")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("should return 200 OK for the date get route", function (done) {
    request(app)
      .get("/trade/date/find/date")
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});
