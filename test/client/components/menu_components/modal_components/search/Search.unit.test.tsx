import React from "react";
import renderer from "react-test-renderer";
import ModalContent from "../../../../../../src/client/components/menu_components/modal_components/search/Search";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Axios from "axios";
import MockAdapater from "axios-mock-adapter";

configure({ adapter: new Adapter() });

describe("Menu Option Search: Modal Search Tests", function () {
  const props = {
    show: true,
    toggleShow: jest.fn(),
  };

  it("should render the elements as is", function (done) {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<ModalContent {...props} />).toJSON();

    expect(container).toMatchSnapshot();
    done();
  });

  describe("Handle Search Method", function () {
    const flushPromises = () => new Promise(setImmediate);
    const event = {
      target: {},
    } as React.MouseEvent<HTMLDivElement, MouseEvent>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should set state Trades with the get response", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      mock.onGet("/trade/id/TEST/find").reply(200, {
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
            created_at: "TEST",
            trade_status: false,
          },
        ],
      });

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "TEST",
        searchType: "id",
        trades: [],
      });

      wrapper.instance()._handleSearch(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().trades[0].id).toEqual("TEST");

      wrapper.unmount();
      mock.restore();

      await done();
    });

    it("should render not found if nothing matches the query", async function (done) {
      const flushPromises = () => new Promise(setImmediate);
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      mock.onGet("/trade/id/TEST/find").reply(200, {
        rows: [],
      });

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "TEST",
        searchType: "id",
        trades: [],
      });

      wrapper.instance()._handleSearch(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();
      mock.restore();

      await done();
    });

    it("should call handle error method if an error occurs", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn<any, any>(wrapper.instance(), "_handleError");

      mock.onGet("/trade/id/TEST/find").reply(500);

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "TEST",
        searchType: "id",
        trades: [],
      });

      try {
        wrapper.instance()._handleSearch(event);
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

  describe("Handle Delete Method", function () {
    const flushPromises = () => new Promise(setImmediate);
    const event = {
      currentTarget: { id: "TEST" },
    } as React.MouseEvent<HTMLDivElement, MouseEvent>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should delete the trade from the database and the current state", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      mock.onDelete("/trade/id/TEST/delete").reply(200, {
        rows: [
          {
            id: "TEST",
          },
        ],
      });

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "TEST",
        searchType: "id",
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
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn(wrapper.instance(), "_handleError");

      mock.onDelete("/trade/id/TEST/delete").reply(500);

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "TEST",
        searchType: "id",
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

  describe("Component Did Mount", function () {
    const flushPromises = () => new Promise(setImmediate);

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should make an api call to retrieve all trades", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      mock.onGet("/trade/all/find").reply(200, {
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
        current_page: "search",
        errored: false,
        searchTerm: "TEST",
        searchType: "id",
        trades: [],
      });

      wrapper.instance().componentDidMount();
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();

      mock.restore();
      wrapper.unmount();

      await done();
    });

    it("should render No Previous Trade History if component did mount retrieves an empty array", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      mock.onGet("/trade/all/find").reply(200, {
        rows: [],
      });

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "TEST",
        searchType: "id",
        trades: [],
      });

      wrapper.instance().componentDidMount();
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();

      mock.restore();
      wrapper.unmount();

      await done();
    });
  });

  describe("Handle Change Method", function () {
    const event = {
      target: { value: "TEST" },
    } as React.ChangeEvent<HTMLInputElement>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should set the state according to event", async function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "",
        searchType: "id",
        trades: [],
      });

      // Simulate event
      wrapper.instance()._handleChange(event);

      expect(wrapper.state().searchTerm).toEqual("TEST");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      await done();
    });
  });

  describe("Handle Error Method", function () {
    it("should set state to errored", async function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "",
        searchType: "id",
        trades: [],
      });

      wrapper.instance()._handleError();

      expect(wrapper.state().errored).toEqual(true);

      wrapper.unmount();
      await done();
    });
  });

  describe("Handle Select Method", function () {
    const eventTicker = {
      currentTarget: { value: "ticker" },
    } as React.ChangeEvent<HTMLSelectElement>;
    const eventCompany = {
      currentTarget: { value: "company" },
    } as React.ChangeEvent<HTMLSelectElement>;
    const eventDate = {
      currentTarget: { value: "date" },
    } as React.ChangeEvent<HTMLSelectElement>;

    beforeAll(function () {
      eventTicker.preventDefault = jest.fn();
      eventCompany.preventDefault = jest.fn();
      eventDate.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should set the state according to event", async function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "search",
        errored: false,
        searchTerm: "",
        searchType: "id",
        trades: [],
      });

      // Check initial state rendering
      expect(wrapper).toMatchSnapshot();

      // Simulate event
      wrapper.instance()._handleSelect(eventTicker);

      // Test
      expect(wrapper.state().searchType).toEqual("ticker");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleSelect(eventCompany);

      expect(wrapper.state().searchType).toEqual("company");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleSelect(eventDate);

      expect(wrapper.state().searchType).toEqual("date");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      await done();
    });
  });
});
