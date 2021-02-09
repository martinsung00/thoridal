import React from "react";
import renderer from "react-test-renderer";
import Header from "../../../src/client/components/Header";

describe("App Tests", function () {
  it("should render header", function () {
    const container = renderer.create(<Header />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
