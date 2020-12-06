import React from "react";
import renderer from "react-test-renderer";
import Header from "../../../src/client/components/Header";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("App Tests", function () {
  it("should render header", function () {
    const container = renderer.create(<Header />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should change the current state when typing in the search bar", async function () {
    const wrapper = shallow(<Header />);
    const event = {
      preventDefault() {},
      target: { value: "Hello World" },
    };

    wrapper.setState({
      searchType: "id",
      searchTerm: "",
    });

    wrapper.find("input").simulate("change", event);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state()).toEqual({
      searchType: "id",
      searchTerm: "Hello World",
    });

    wrapper.unmount();
  });

  it("should change the current state when selecting search types", async function () {
    const wrapper = shallow(<Header />);
    const event = {
      preventDefault() {},
      currentTarget: { value: "company" },
    };

    wrapper.setState({
      searchType: "id",
      searchTerm: "",
    });

    wrapper.find("select").simulate("change", event);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state()).toEqual({
      searchType: "company",
      searchTerm: "",
    });

    wrapper.unmount();
  });
});
