import React from "react";
import renderer from "react-test-renderer";
import { Add } from "../../../../src/client/components/menu_components/MenuAdd";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Menu Option Add Tests", function () {
  it("should render the appropriate react elements", function () {
    const container = renderer.create(<Add />).toJSON();
    expect(container).toMatchSnapshot();
  });

  it("should open the modal on click & close the modal on clicking the close button", function () {
    const wrapper = shallow(<Add />);

    // Simulate opening the modal
    wrapper.find("#menu-add").simulate("click");
    expect(wrapper).toMatchSnapshot();

    // Simulate closing the modal
    wrapper.find("#close-modal").simulate("click");
    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });
});
