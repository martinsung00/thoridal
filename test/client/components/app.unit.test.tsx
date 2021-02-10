import React from "react";
import renderer from "react-test-renderer";
import App from "../../../src/client/components/app";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Axios from "axios";
import MockAdapater from "axios-mock-adapter";
import { Trade } from "../../types/index";

configure({ adapter: new Adapter() });

describe("App Tests", function () {
  const flushPromises = () => new Promise(setImmediate);

  it("should render header and menu", function () {
    const container = renderer.create(<App />).toJSON();

    expect(container).toMatchSnapshot();
  });

  describe("Component Did Mount", function () {
    afterEach(function () {
      jest.resetAllMocks();
      jest.resetModules();
      MockAdapater.prototype.restore();
    });

    it("should make an api call to retrieve all trades", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = mount<App>(<App />);
      const spy = jest.spyOn(wrapper.instance(), "_setMetrics");

      // Result with trades
      mock.onGet("/trade/recent/find").reply(200, {
        rows: [
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
      });

      wrapper.setState({
        trades: [],
        net: 0,
        totalWeekTrades: 0,
        totalFulfilled: 0,
        totalUnfulfilled: 0,
        avgGainPerDay: 0,
        avgTradePerDay: 0,
        errored: false,
        history: true,
      });

      try {
        await wrapper.instance().componentDidMount();
        await flushPromises();
        wrapper.update();
      } catch (err) {
        console.log(err);
      } finally {
        expect(wrapper).toMatchSnapshot();
        expect(spy).toHaveBeenCalled();
      }

      mock.restore();
      wrapper.unmount();

      await done();
    });

    it("should set history to false if the result is empty", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = mount<App>(<App />);

      // Result with trades
      mock.onGet("/trade/recent/find").reply(200, {
        rows: [],
      });

      wrapper.setState({
        trades: [],
        net: 0,
        totalWeekTrades: 0,
        totalFulfilled: 0,
        totalUnfulfilled: 0,
        avgGainPerDay: 0,
        avgTradePerDay: 0,
        errored: false,
        history: true,
      });

      try {
        wrapper.instance().componentDidMount();
        await flushPromises();
        wrapper.update();
      } catch (err) {
        console.log(err);
      } finally {
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.state().history).toEqual(false);
      }

      mock.restore();
      wrapper.unmount();

      await done();
    });

    it("should call handle error if an error occurs", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = mount<App>(<App />);
      const spy = jest.spyOn(wrapper.instance(), "_handleError");

      // Result with trades
      mock.onGet("/trade/recent/find").reply(500);

      wrapper.setState({
        trades: [],
        net: 0,
        totalWeekTrades: 0,
        totalFulfilled: 0,
        totalUnfulfilled: 0,
        avgGainPerDay: 0,
        avgTradePerDay: 0,
        errored: false,
        history: true,
      });

      try {
        wrapper.instance().componentDidMount();
        await flushPromises();
        wrapper.update();
      } catch (err) {
        expect(wrapper).toMatchSnapshot();
        expect(spy).toHaveBeenCalled();
      }

      mock.restore();
      wrapper.unmount();

      await done();
    });
  });

  describe("Handle Delete Method", function () {
    const event = {
      currentTarget: {},
    } as React.MouseEvent<HTMLDivElement, MouseEvent>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should delete the desired trade", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = mount<App>(<App />);

      // Result with trades
      mock.onDelete(`/trade/id/TEST/delete`).reply(200, {
        rows: [
          {
            id: "TEST",
          },
        ],
      });

      wrapper.setState({
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
        net: 0,
        totalWeekTrades: 0,
        totalFulfilled: 0,
        totalUnfulfilled: 0,
        avgGainPerDay: 0,
        avgTradePerDay: 0,
        errored: false,
        history: true,
      });

      wrapper.instance()._handleDelete(event, 0, "TEST");
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().trades).toHaveLength(0);

      wrapper.unmount();
      mock.restore();

      await done();
    });

    it("should call handle error method if an error occurs", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<App>(<App />);
      const spy = jest.spyOn(wrapper.instance(), "_handleError");

      mock.onDelete("/trade/id/TEST/delete").reply(500);

      wrapper.setState({
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
        net: 0,
        totalWeekTrades: 0,
        totalFulfilled: 0,
        totalUnfulfilled: 0,
        avgGainPerDay: 0,
        avgTradePerDay: 0,
        errored: false,
        history: true,
      });

      try {
        wrapper.instance()._handleDelete(event, 0, "TEST");
        await flushPromises();
        wrapper.update();
      } catch (err) {
        expect(wrapper).toMatchSnapshot();
        expect(spy).toHaveBeenCalled();
      }

      wrapper.unmount();
      mock.restore();

      await done();
    });
  });

  describe("Set Metrics Method", function () {
    beforeEach(function () {
      jest.resetModules();
      jest.resetAllMocks();
    });

    it("should set the state with proper metrics", async function (done) {
      const wrapper = shallow<App>(<App />);
      const mockData: Array<Trade> = [
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 4.0,
          quantity: 1,
          total_cost: 4.0,
          trade_type: "long",
          note: "TEST",
          created_at: new Date(),
          trade_status: true,
          trade_action: "bought",
        },
        {
          id: "TEST",
          ticker: "TEST",
          company_name: "TEST",
          reference_number: "TEST",
          unit_price: 2.0,
          quantity: 1,
          total_cost: 2.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: true,
          trade_action: "sold",
        },
        {
          id: "TEST3",
          ticker: "TEST3",
          company_name: "TEST3",
          reference_number: "TEST3",
          unit_price: 0.0,
          quantity: 0,
          total_cost: 0.0,
          trade_type: "short",
          note: "TEST",
          created_at: new Date(),
          trade_status: false,
          trade_action: "bought",
        },
      ];

      wrapper.setState({
        trades: [],
        net: 0,
        totalWeekTrades: 0,
        totalFulfilled: 0,
        totalUnfulfilled: 0,
        avgGainPerDay: 0,
        avgTradePerDay: 0,
        errored: false,
        history: true,
      });

      wrapper.instance()._setMetrics(mockData);
      await flushPromises();
      wrapper.update();

      wrapper.unmount();

      await done();
    });
  });

  describe("Handle Error Method", function () {
    beforeEach(function () {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it("should set state to errored", async function (done) {
      const wrapper = shallow<App>(<App />);

      wrapper.instance()._handleError();
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().errored).toEqual(true);

      wrapper.unmount();

      await done();
    });
  });
});
