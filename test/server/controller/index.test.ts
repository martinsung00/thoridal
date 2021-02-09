import Controller from "../../../src/server/controller/index";

describe("Controller Plugins Tests", function () {
  it("should be a class constructor", function () {
    const controller = new Controller();

    expect(controller instanceof Controller).toEqual(true);
  });
});
