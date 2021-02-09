import React from "react";
import renderer from "react-test-renderer";
import { Search } from "../../../../src/client/components/menu_components/MenuSearch";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
describe("Menu Option Search Tests", function () {
  it("should render hello world", function () {
    const container = renderer.create(<Search />).toJSON();
    expect(container).toMatchSnapshot();
  });

  it("should open the modal on click & close the modal on clicking the close button", function () {
    const wrapper = shallow(<Search />);

    // Simulate opening the modal
    wrapper.find("#menu-search").simulate("click");
    expect(wrapper).toMatchSnapshot();

    // Simulate closing the modal
    wrapper.find("#close-modal").simulate("click");
    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });
});
