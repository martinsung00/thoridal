import Thoridal from "../../src/server/thoridal/plugins";

describe("Thoridal Plugins", function () {
  it("should be a class constructor", function () {
    const th = new Thoridal();

    expect(th instanceof Thoridal).toEqual(true);
  });
});
