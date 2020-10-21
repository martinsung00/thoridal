import { C } from "./../../src/server";

describe("Sample Test", function () {
  it("should pass harmlessly", function () {
    const c = new C();

    expect(c.getX()).toEqual(10);

    c.setX(20);
    expect(c.getX()).toEqual(20);
  });
});
