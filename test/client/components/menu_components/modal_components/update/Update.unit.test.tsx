import React from "react";
import renderer from "react-test-renderer";
import ModalContent from "../../../../../../src/client/components/menu_components/modal_components/update/Update";
import { shallow, configure, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Axios from "axios";
import MockAdapater from "axios-mock-adapter";

configure({ adapter: new Adapter() });

describe("Menu Option Update: Modal Update Tests", function () {
  let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
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

  it("should render the update form", function (done) {
    wrapper = shallow(<ModalContent {...props} />);
    wrapper.setState({
      current_page: "update-form",
      errored: false,
      trades: [{}],
      searchTerm: "",
      updateBy: "id",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();

    done();
  });

  it("should render the not found page", function (done) {
    wrapper = shallow(<ModalContent {...props} />);
    wrapper.setState({
      current_page: "not-found",
      errored: false,
      trades: [{}],
      searchTerm: "",
      updateBy: "id",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();

    done();
  });

  it("should render the confirm page", function (done) {
    wrapper = shallow(<ModalContent {...props} />);
    wrapper.setState({
      current_page: "confirm",
      errored: false,
      trades: [{}],
      searchTerm: "",
      updateBy: "id",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();

    done();
  });

  it("should render the error page", function (done) {
    wrapper = shallow(<ModalContent {...props} />);
    wrapper.setState({
      current_page: "failed",
      errored: true,
      trades: [{}],
      searchTerm: "",
      updateBy: "id",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();

    done();
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

    it("should set the state according to event", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "find",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      // Simulate event
      wrapper.instance()._handleChange(event);

      expect(wrapper.state().searchTerm).toEqual("TEST");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
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

    it("should set the state according to event", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "find",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      // Check initial state rendering
      expect(wrapper).toMatchSnapshot();

      // Simulate event
      wrapper.instance()._handleSelect(eventTicker);

      // Test
      expect(wrapper.state().updateBy).toEqual("ticker");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleSelect(eventCompany);

      expect(wrapper.state().updateBy).toEqual("company");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleSelect(eventDate);

      expect(wrapper.state().updateBy).toEqual("date");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Error Method", function () {
    it("should set the state to errored", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "find",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      // Simulate event
      wrapper.instance()._handleError();

      expect(wrapper.state().errored).toEqual(true);
      expect(wrapper.state().current_page).toEqual("failed");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Next State Method", function () {
    it("should proceed to the update form if current page is find", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "find",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      // Simulate event
      wrapper.instance()._nextState();

      expect(wrapper.state().current_page).toEqual("update-form");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });

    it("should proceed to the update form if current page is find", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "update-form",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      // Simulate event
      wrapper.instance()._nextState();

      expect(wrapper.state().current_page).toEqual("confirm");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Previous State Method", function () {
    const event = {
      target: {},
    } as React.MouseEvent<HTMLDivElement, MouseEvent>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should set state back to find", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      wrapper.instance()._prevState(event);

      expect(wrapper.state().current_page).toEqual("find");
      expect(wrapper.state().errored).toEqual(false);
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Close Method", function () {
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

    it("close the modal and set state to find", async function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      wrapper.instance()._handleClose(event);
      await flushPromises();

      expect(wrapper.state().current_page).toEqual("find");
      expect(wrapper.instance().props.toggleShow).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
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

    it("should not allow an search command without a query", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn<any, any>(wrapper.instance(), "_handleNotFound");

      mock.onGet("/trade/id/TEST/find").reply(200, {
        rows: [{ id: "TEST" }],
      });

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trades: [],
        searchTerm: "",
        updateBy: "id",
      });

      wrapper.instance()._handleSearch(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().current_page).toEqual("not-found");

      wrapper.unmount();
      mock.restore();

      done();
    });

    it("should set state to not found if api get responds with an empty array", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn<any, any>(wrapper.instance(), "_handleNotFound");

      mock.onGet("/trade/id/TEST/find").reply(200, {
        rows: [],
      });

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trades: [],
        searchTerm: "TEST",
        updateBy: "id",
      });

      wrapper.instance()._handleSearch(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().current_page).toEqual("not-found");

      wrapper.unmount();
      mock.restore();

      done();
    });

    it("should set state Trades with the get response", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn<any, any>(wrapper.instance(), "_nextState");

      mock.onGet("/trade/id/TEST/find").reply(200, {
        rows: [{ id: "TEST" }],
      });

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trades: [],
        searchTerm: "TEST",
        updateBy: "id",
      });

      wrapper.instance()._handleSearch(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().trades[0].id).toEqual("TEST");

      wrapper.unmount();
      mock.restore();

      done();
    });

    it("should set state with the get response", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn<any, any>(wrapper.instance(), "_nextState");

      mock.onGet("/trade/id/TEST/find").reply(200, {
        rows: [{ id: "TEST" }],
      });

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trades: [],
        searchTerm: "TEST",
        updateBy: "id",
      });

      wrapper.instance()._handleSearch(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.state().trades[0].id).toEqual("TEST");

      wrapper.unmount();
      mock.restore();

      done();
    });

    it("should call handle error method if the request fails", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn<any, any>(wrapper.instance(), "_handleError");

      mock.onGet("/trade/id/TEST/find").reply(500);

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trades: [],
        searchTerm: "TEST",
        updateBy: "id",
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

      done();
    });
  });
});
