import React from "react";
import renderer from "react-test-renderer";
import ModalContent from "../../../../../../src/client/components/menu_components/modal_components/delete/Delete";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Axios from "axios";
import MockAdapater from "axios-mock-adapter";

configure({ adapter: new Adapter() });

describe("Menu Option Delete: Modal Delete Tests", function () {
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

  it("should render an errored page", function (done) {
    const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

    wrapper.setState({
      current_page: "errored",
      errored: true,
      deleteTerm: "",
      deleteType: "id",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();

    done();
  });

  it("should render a confirmation page", function (done) {
    const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

    wrapper.setState({
      current_page: "confirm",
      errored: false,
      deleteTerm: "",
      deleteType: "id",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();

    done();
  });

  it("should render a not found page", function (done) {
    const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

    wrapper.setState({
      current_page: "not-found",
      errored: false,
      deleteTerm: "",
      deleteType: "id",
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
        current_page: "delete",
        errored: false,
        deleteTerm: "",
        deleteType: "id",
      });

      // Simulate event
      wrapper.instance()._handleChange(event);

      expect(wrapper.state().deleteTerm).toEqual("TEST");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Select Method", function () {
    // Set up events
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
      // Add prevent default as mock
      eventTicker.preventDefault = jest.fn();
      eventCompany.preventDefault = jest.fn();
      eventDate.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should set the state according to event", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "delete",
        errored: false,
        deleteTerm: "",
        deleteType: "id",
      });

      // Check initial state rendering
      expect(wrapper).toMatchSnapshot();

      // Simulate event
      wrapper.instance()._handleSelect(eventTicker);

      // Test
      expect(wrapper.state().deleteType).toEqual("ticker");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleSelect(eventCompany);

      expect(wrapper.state().deleteType).toEqual("company");
      expect(wrapper).toMatchSnapshot();

      wrapper.instance()._handleSelect(eventDate);

      expect(wrapper.state().deleteType).toEqual("date");
      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Error Method", function () {
    it("should set state to errored", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "delete",
        errored: false,
        deleteTerm: "",
        deleteType: "id",
      });

      wrapper.instance()._handleError();

      expect(wrapper.state().errored).toEqual(true);
      expect(wrapper.state().current_page).toEqual("errored");

      wrapper.unmount();

      done();
    });
  });

  describe("Handle delete Method", function () {
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

    it("should render not found if nothing matches the query", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      mock.onDelete("/trade/id/TEST/delete").reply(200, {
        rows: [],
      });

      wrapper.setState({
        current_page: "delete",
        errored: false,
        deleteTerm: "TEST",
        deleteType: "id",
      });

      wrapper.instance()._handleDelete(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().current_page).toEqual("not-found");

      wrapper.unmount();
      mock.restore();

      done();
    });

    it("should delete the desired trade", async function (done) {
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
        current_page: "delete",
        errored: false,
        deleteTerm: "TEST",
        deleteType: "id",
      });

      wrapper.instance()._handleDelete(event);
      await flushPromises();
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().current_page).toEqual("confirm");

      wrapper.unmount();
      mock.restore();

      done();
    });

    it("should throw an error if an error occurs", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      mock.onDelete("/trade/id/TEST/delete").reply(500);

      wrapper.setState({
        current_page: "delete",
        errored: false,
        deleteTerm: "TEST",
        deleteType: "id",
      });

      try {
        wrapper.instance()._handleDelete(event);
        await flushPromises();
        wrapper.update();
      } catch (err) {
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.state().current_page).toEqual("errored");
        expect(wrapper.state().errored).toEqual(true);
      }

      wrapper.unmount();
      mock.restore();

      done();
    });
  });

  describe("Prev State Method", function () {
    it("should change current page back to delete", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "errored",
        errored: true,
        deleteTerm: "TEST",
        deleteType: "id",
      });

      wrapper.instance()._prevState();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().current_page).toEqual("delete");
      expect(wrapper.state().errored).toEqual(false);

      wrapper.unmount();

      done();
    });
  });
});
