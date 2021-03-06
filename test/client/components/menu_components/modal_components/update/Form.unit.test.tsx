import React from "react";
import renderer from "react-test-renderer";
import Form from "../../../../../../src/client/components/menu_components/modal_components/update/Form";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Axios from "axios";
import MockAdapater from "axios-mock-adapter";
import { Trade } from "../../../../../types/index";

configure({ adapter: new Adapter() });

interface Props {
  onError: Function;
  nextState: Function;
  handleClose: Function;
  trades: Array<Trade>;
}

describe("Modal Option Update: Modal Form Tests", function () {
  let wrapper;
  const type: "short" = "short";
  const date = new Date();
  const defaultState = {
    id: "",
    ticker: "",
    company_name: "",
    reference_number: "",
    unit_price: 0.0,
    quantity: 0,
    total_cost: 0.0,
    trade_type: "short",
    note: "",
    created_at: date,
    trade_status: false,
    trade_action: "bought",
  };
  const props: Props = {
    onError: jest.fn(),
    nextState: jest.fn(),
    handleClose: jest.fn(),
    trades: [
      {
        id: "TEST",
        ticker: "TEST",
        company_name: "TEST",
        reference_number: "TEST",
        unit_price: 1,
        quantity: 1,
        total_cost: 1,
        trade_type: type,
        note: "TEST",
        created_at: date,
        trade_status: false,
        trade_action: "bought",
      },
    ],
  };

  afterEach(function () {
    jest.resetAllMocks();
  });

  it("should render all appropriate elements as is", function () {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<Form {...props} />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should change state upon receiving an input in the form", function () {
    const changeEvent = {
      target: { value: "Test" },
      preventDefault: jest.fn(),
    };
    const changeEventNumeric = {
      target: { value: 1 },
      preventDefault: jest.fn(),
    };

    wrapper = shallow(<Form {...props} />);

    wrapper.setState(defaultState);

    wrapper.find("#id").simulate("change", changeEvent);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#company_name").simulate("change", changeEvent);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#ticker").simulate("change", changeEvent);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#reference_number").simulate("change", changeEvent);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#unit_price").simulate("change", changeEventNumeric);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#quantity").simulate("change", changeEventNumeric);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#total_cost").simulate("change", changeEventNumeric);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#note").simulate("change", changeEvent);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#trade_status").simulate("change", {
      currentTarget: { value: "long" },
      preventDefault: jest.fn(),
    });
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#trade_status").simulate("change", {
      currentTarget: { value: "short" },
      preventDefault: jest.fn(),
    });
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#trade_type").simulate("change", {
      currentTarget: { value: "fulfilled" },
      preventDefault: jest.fn(),
    });
    expect(wrapper).toMatchSnapshot();

    wrapper.find("#trade_type").simulate("change", {
      currentTarget: { value: "not-fulfilled" },
      preventDefault: jest.fn(),
    });
    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  describe("Handle Select Trade Status Method", function () {
    it("should set the state to the currently selected target value", function () {
      const eventFalse = {
        currentTarget: { value: "not-fulfilled" },
      } as React.FormEvent<HTMLSelectElement>;
      const eventTrue = {
        currentTarget: { value: "fulfilled" },
      } as React.FormEvent<HTMLSelectElement>;

      eventFalse.preventDefault = jest.fn();
      eventTrue.preventDefault = jest.fn();
      wrapper = shallow<Form>(<Form {...props} />);
      wrapper.setState(defaultState);

      wrapper.instance()._handleTradeStatus(eventFalse);

      expect(wrapper.state().trade_status).toEqual(false);
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleTradeStatus(eventTrue);

      expect(wrapper.state().trade_status).toEqual(true);
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();
    });
  });

  describe("Handle Select Trade Action Method", function () {
    const eventBought = {
      currentTarget: { value: "bought" },
    } as React.FormEvent<HTMLSelectElement>;
    const eventSold = {
      currentTarget: { value: "sold" },
    } as React.FormEvent<HTMLSelectElement>;

    beforeAll(function () {
      eventBought.preventDefault = jest.fn();
      eventSold.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should set the state to the currently selected target value", function () {
      wrapper = shallow<Form>(<Form {...props} />);
      wrapper.setState(defaultState);

      wrapper.instance()._handleTradeAction(eventBought);

      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleTradeAction(eventSold);

      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();
    });
  });

  describe("Handle Select Trade Type Method", function () {
    it("should set the state to the currently selected target value", function () {
      const eventLong = {
        currentTarget: { value: "long" },
      } as React.FormEvent<HTMLSelectElement>;
      const eventShort = {
        currentTarget: { value: "short" },
      } as React.FormEvent<HTMLSelectElement>;

      eventLong.preventDefault = jest.fn();
      eventShort.preventDefault = jest.fn();
      wrapper = shallow<Form>(<Form {...props} />);
      wrapper.setState(defaultState);

      wrapper.instance()._handleSelect(eventLong);

      expect(wrapper.state().trade_type).toEqual("long");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleSelect(eventShort);

      expect(wrapper.state().trade_type).toEqual("short");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();
    });
  });

  describe("Handle Change Method", function () {
    it("should set the state according to event", function () {
      const event = {
        target: { name: "id", value: "TEST" },
      } as React.ChangeEvent<HTMLInputElement>;
      const faultyEvent = {
        target: { value: "SHOULD NOT CHANGE" },
      } as React.ChangeEvent<HTMLInputElement>;

      event.preventDefault = jest.fn();
      faultyEvent.preventDefault = jest.fn();
      wrapper = shallow<Form>(<Form {...props} />);
      wrapper.setState(defaultState);

      wrapper.instance()._handleChange(event);

      expect(wrapper.state().id).toEqual("TEST");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleChange(faultyEvent);

      expect(wrapper.state().id).toEqual("TEST");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();
    });
  });

  describe("On Cancel", function () {
    it("should exit the modal", async function (done) {
      const flushPromises = () => new Promise(setImmediate);
      const event = {
        target: {},
      } as React.MouseEvent<HTMLDivElement, MouseEvent>;

      event.preventDefault = jest.fn();
      wrapper = shallow<Form>(<Form {...props} />);
      wrapper.setState(defaultState);

      wrapper.find("#cancel-button").simulate("click", event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.instance().props.handleClose).toHaveBeenCalled();

      wrapper.unmount();
      jest.resetAllMocks();

      done();
    });
  });

  describe("On Submit Method", function () {
    beforeEach(function () {
      jest.resetAllMocks();
    });

    it("should change call confirm ID and next state on success", async function (done) {
      const flushPromises = () => new Promise(setImmediate);
      const mock = new MockAdapater(Axios);
      const event = {
        currentTarget: {},
      } as React.FormEvent<HTMLFormElement>;

      // Set up mocks
      event.preventDefault = jest.fn();
      mock.onPut("/trade/user/write").reply(200, {
        rows: {
          id: "TESTING",
        },
      });
      wrapper = shallow<Form>(<Form {...props} />);

      // Set up state
      wrapper.setState({
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
        trade_action: "sold",
      });

      // Simulate event
      wrapper.instance()._onSubmit(event);
      await flushPromises();
      wrapper.update();

      // Test
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.instance().props.nextState).toHaveBeenCalled();

      // Post test cleanup
      wrapper.unmount();
      jest.resetAllMocks();
      mock.restore();

      done();
    });

    it("should change call confirm ID and next state on success (alternate trade status and trade type)", async function (done) {
      const flushPromises = () => new Promise(setImmediate);
      const mock = new MockAdapater(Axios);
      const event = {
        currentTarget: {},
      } as React.FormEvent<HTMLFormElement>;

      // Set up mocks
      event.preventDefault = jest.fn();
      mock.onPut("/trade/user/write").reply(200, {
        rows: {
          id: "TESTING",
        },
      });
      wrapper = shallow<Form>(<Form {...props} />);

      // Set up state
      wrapper.setState({
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
        trade_action: "bought",
      });

      // Simulate event
      wrapper.instance()._onSubmit(event);
      await flushPromises();
      wrapper.update();

      // Test
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.instance().props.nextState).toHaveBeenCalled();

      // Post test cleanup
      wrapper.unmount();
      jest.resetAllMocks();
      mock.restore();

      done();
    });

    it("should change state to error state when the api call fails", async function (done) {
      const mock = new MockAdapater(Axios);
      const event = {
        currentTarget: {},
      } as React.FormEvent<HTMLFormElement>;

      // Set up mocks
      event.preventDefault = jest.fn();
      mock.onPut("/trade/user/write").reply(500);
      wrapper = shallow<Form>(<Form {...props} />);
      // Set up state
      wrapper.setState({
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
      });

      // Simulate event
      wrapper.instance()._onSubmit(event);

      // Test
      expect(wrapper).toMatchSnapshot();

      // Post test cleanup
      wrapper.unmount();
      jest.resetAllMocks();
      mock.restore();

      done();
    });
  });
});
