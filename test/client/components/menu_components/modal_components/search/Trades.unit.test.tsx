import React from "react";
import renderer from "react-test-renderer";
import { Trades } from "../../../../../../src/client/components/menu_components/modal_components/search/Trades";
import { Trade } from "../../../../../../src/client/types/index";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

interface Props {
  trades: Array<Trade> | [];
  page: number;
  pages: number;
  handleDelete: Function;
}

describe("Modal Component Trades Tests", function () {
  const props: Props = {
    trades: [
      {
        id: "TEST",
        ticker: "TEST",
        company_name: "TEST",
        reference_number: "TEST",
        unit_price: 0.0,
        quantity: 0,
        total_cost: 0.0,
        trade_type: "short",
        note: "TEST",
        created_at: new Date("1995-12-17T03:24:00"),
        trade_status: false,
        trade_action: "bought",
      },
    ],
    page: 1,
    pages: 1,
    handleDelete: jest.fn(),
  };

  const propsV2: Props = {
    trades: [
      {
        id: "TEST",
        ticker: "TEST",
        company_name: "TEST",
        reference_number: "TEST",
        unit_price: 0.0,
        quantity: 0,
        total_cost: 0.0,
        trade_type: "long",
        note: "TEST",
        created_at: new Date(),
        trade_status: true,
        trade_action: "sold",
      },
    ],
    page: 1,
    pages: 1,
    handleDelete: jest.fn(),
  };

  it("should render the elements as is", function () {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<Trades {...props} />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should render the trade's elements with 'long' and 'Fulfilled'", function () {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<Trades {...propsV2} />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should render the grayed out version of the next button if the current trades are empty", function () {
    const alternateProps: Props = {
      trades: [],
      page: 1,
      pages: 1,
      handleDelete: jest.fn(),
    };
    const wrapper = shallow(<Trades {...alternateProps} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
    jest.resetAllMocks();
  });

  it("should render the the prev button if the current page is > 1", function () {
    const alternateProps: Props = {
      trades: [
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "bought",
        },
      ],
      page: 52,
      pages: 52,
      handleDelete: jest.fn(),
    };
    const wrapper = shallow(<Trades {...alternateProps} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
    jest.resetAllMocks();
  });

  it("should render the the next button if the trade length is > 1", function () {
    const alternateProps: Props = {
      trades: [
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "bought",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "bought",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "sold",
        },
      ],
      page: 1,
      pages: 2,
      handleDelete: jest.fn(),
    };

    const wrapper = shallow(<Trades {...alternateProps} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
    jest.resetAllMocks();
  });

  it("should render the the prev button if the current page is > 1", function () {
    const alternateProps: Props = {
      trades: [],
      page: 2,
      pages: 2,
      handleDelete: jest.fn(),
    };
    const wrapper = shallow(<Trades {...alternateProps} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
    jest.resetAllMocks();
  });

  describe("Delete Button", function () {
    it("should call the handle delete method", async function () {
      const flushPromises = () => new Promise(setImmediate);
      const wrapper = shallow(<Trades {...props} />);
      const spy = jest.spyOn<any, any>(props, "handleDelete");

      wrapper.find("#delete-button").simulate("click");
      await flushPromises();
      wrapper.update();

      expect(spy).toHaveBeenCalled();

      wrapper.unmount();
      jest.resetAllMocks();
    });
  });
});
