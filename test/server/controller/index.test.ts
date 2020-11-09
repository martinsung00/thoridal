import Controller from "../../../src/server/controller/index";

describe("Controller Plugins", function () {
  it("should be a class constructor", function () {
    const th = new Controller();

    expect(th instanceof Controller).toEqual(true);
  });
});
