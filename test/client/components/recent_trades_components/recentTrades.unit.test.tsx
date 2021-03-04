import React from "react";
import renderer from "react-test-renderer";
import { RecentTrades } from "../../../../src/client/components/recent_trades_components/RecentTrades";
import { shallow, configure, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Trade } from "../../../../src/client/types/index";

configure({ adapter: new Adapter() });

describe("Error Page", function () {
  const date = new Date("1995-12-17T03:24:00");
  const testTrades: Array<Trade> | [] = [
    {
      id: "TESTING",
      ticker: "TESTING",
      company_name: "TESTING",
      reference_number: "TESTING",
      unit_price: 1.0,
      quantity: 1,
      total_cost: 1.0,
      trade_type: "short",
      note: "TESTING",
      created_at: date,
      trade_status: false,
      trade_action: "bought",
    },
  ];

  const testTradesV2: Array<Trade> | [] = [
    {
      id: "TESTING",
      ticker: "TESTING",
      company_name: "TESTING",
      reference_number: "TESTING",
      unit_price: 1.0,
      quantity: 1,
      total_cost: 1.0,
      trade_type: "long",
      note: "TESTING",
      created_at: date,
      trade_status: true,
      trade_action: "sold",
    },
  ];

  const props = {
    trades: testTrades,
    handleDelete: jest.fn(),
    history: true,
    errored: false,
  };

  const propsV2 = {
    trades: testTradesV2,
    handleDelete: jest.fn(),
    history: true,
    errored: false,
  };

  const propsErrored = {
    trades: testTrades,
    handleDelete: jest.fn(),
    history: true,
    errored: true,
  };

  const propsNoHistory = {
    trades: [],
    handleDelete: jest.fn(),
    history: false,
    errored: false,
  };

  afterAll(function () {
    jest.resetAllMocks();
  });

  it("should render the page as is", function () {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<RecentTrades {...props} />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should render the trade's elements with 'long' and 'Fulfilled'", function () {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<RecentTrades {...propsV2} />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should render something has gone wrong text", function () {
    const wrapper: ShallowWrapper<
      any,
      Readonly<{}>,
      React.Component<{}, {}, any>
    > = shallow(<RecentTrades {...propsErrored} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  it("should render no trade history found text", function () {
    const wrapper: ShallowWrapper<
      any,
      Readonly<{}>,
      React.Component<{}, {}, any>
    > = shallow(<RecentTrades {...propsNoHistory} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  describe("delete button", function () {
    const flushPromises = () => new Promise(setImmediate);
    const event = {
      currentTarget: {},
    } as React.MouseEvent<HTMLInputElement>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should call handleDelete method", async function (done) {
      const wrapper: ShallowWrapper<
        any,
        Readonly<{}>,
        React.Component<{}, {}, any>
      > = shallow(<RecentTrades {...props} />);
      const spy = jest.spyOn<any, any>(props, "handleDelete");

      wrapper.find("#delete-button").simulate("click", event);
      await flushPromises();
      wrapper.update();

      expect(spy).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });
});
