import Gateway from "../../../src/server/gateways/gateway";

describe("Gateway Tests", function () {
  jest.mock("winston");

  /* We can't directly instantiate abstract classes. */
  class ThinGateway extends Gateway {}
  const gateway = new ThinGateway();

  // To-do: we need to ensure that we call winston.verbose() here.P
  it("should be able to emit a pulse to logger", function () {
    gateway.pulse();
  });
});
