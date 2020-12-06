import React from "react";
import renderer from "react-test-renderer";
import App from "../../../src/client/components/App";

describe("App Tests", function () {
  it("should render hello world", function () {
    const container = renderer.create(<App />).toJSON();
    expect(container).toMatchSnapshot();
  });
});
