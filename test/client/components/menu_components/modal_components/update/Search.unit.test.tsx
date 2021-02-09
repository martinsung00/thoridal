import React from "react";
import renderer from "react-test-renderer";
import { Search } from "../../../../../../src/client/components/menu_components/modal_components/update/Search";
import { shallow, configure, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Modal Option Update: Modal Search Tests", function () {
  const props = {
    handleChange: jest.fn(),
    handleSelect: jest.fn(),
    handleSearch: jest.fn(),
    updateBy: "id",
  };

  afterEach(function () {
    jest.resetAllMocks();
  });

  it("should render the elements as is", function () {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<Search {...props} />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should render a placeholder if update by is set to date", async function (done) {
    const alternateProps = {
      handleChange: jest.fn(),
      handleSelect: jest.fn(),
      handleSearch: jest.fn(),
      updateBy: "date",
    };
    const wrapper = shallow(<Search {...alternateProps} />);

    expect(wrapper).toMatchSnapshot();

    done();
  });

  it("should call props' handle select method when a select event occurs", async function (done) {
    const event = {
      currentTarget: { value: "ticker" },
    } as React.ChangeEvent<HTMLSelectElement>;
    const wrapper: ShallowWrapper = shallow<any>(<Search {...props} />);
    const spy = jest.spyOn<any, any>(props, "handleSelect");
    const flushPromises = () => new Promise(setImmediate);

    event.preventDefault = jest.fn();

    wrapper.find("#update-by").simulate("change", event);
    await flushPromises();
    wrapper.update();

    expect(spy).toHaveBeenCalled();

    done();
  });

  it("should change update by state depending on current input value", async function (done) {
    const event = {
      target: { value: "ticker" },
    } as React.ChangeEvent<HTMLInputElement>;
    const wrapper: ShallowWrapper = shallow<any>(<Search {...props} />);
    const spy = jest.spyOn<any, any>(props, "handleChange");
    const flushPromises = () => new Promise(setImmediate);

    event.preventDefault = jest.fn();

    wrapper.find("#update-input").simulate("change", event);
    await flushPromises();
    wrapper.update();

    expect(spy).toHaveBeenCalled();

    done();
  });

  it("should call the search method upon pressing the search button", async function (done) {
    const event = {
      target: {},
    } as React.MouseEvent<HTMLDivElement, MouseEvent>;
    const wrapper: ShallowWrapper = shallow<any>(<Search {...props} />);
    const spy = jest.spyOn<any, any>(props, "handleSearch");
    const flushPromises = () => new Promise(setImmediate);

    event.preventDefault = jest.fn();

    wrapper.find("#search-button").simulate("click", event);
    await flushPromises();
    wrapper.update();

    expect(spy).toHaveBeenCalled();

    done();
  });
});
