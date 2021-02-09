import React from "react";
import renderer from "react-test-renderer";
import { Menu } from "../../../src/client/components/Menu";

describe("Menu Tests", function () {
  it("should render as is", function () {
    const container = renderer.create(<Menu />).toJSON();
    expect(container).toMatchSnapshot();
  });
});
