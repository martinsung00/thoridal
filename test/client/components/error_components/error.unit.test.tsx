import React from "react";
import renderer from "react-test-renderer";
import { ErrorPage } from "../../../../src/client/components/error_components/Error";
import { shallow, configure, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Error Page", function () {
  const flushPromises = () => new Promise(setImmediate);
  const props = {
    prevState: jest.fn(),
  };
  const event = {
    currentTarget: {},
  } as React.MouseEvent<HTMLInputElement>;

  afterAll(function () {
    jest.resetAllMocks();
  });

  it("should render the page as is", function (done) {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<ErrorPage {...props} />).toJSON();

    expect(container).toMatchSnapshot();

    done()
  });

  describe("return button", function () {
    it("should call the prevState method", async function (done) {
      const wrapper: ShallowWrapper<
        any,
        Readonly<{}>,
        React.Component<{}, {}, any>
      > = shallow(<ErrorPage {...props} />);
      const spy = jest.spyOn<any, any>(props, "prevState");

      event.preventDefault = jest.fn();

      wrapper.find("#return-button").simulate("click", event);
      await flushPromises();
      wrapper.update();

      expect(spy).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });
});
