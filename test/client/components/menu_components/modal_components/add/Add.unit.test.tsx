import React from "react";
import renderer from "react-test-renderer";
import ModalContent from "../../../../../../src/client/components/menu_components/modal_components/add/Add";
import { shallow, configure, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Axios from "axios";
import MockAdapater from "axios-mock-adapter";

configure({ adapter: new Adapter() });

describe("Menu Option Add: Modal Content Tests", function () {
  // Fake Props for testing purposes
  const props = {
    toggleShow: jest.fn(),
    show: true,
  };

  afterEach(function () {
    props.show = true;
  });

  it("should render all appropriate elements as is", function () {
    const container:
      | renderer.ReactTestRendererJSON
      | renderer.ReactTestRendererJSON[]
      | null = renderer.create(<ModalContent {...props} />).toJSON();

    expect(container).toMatchSnapshot();
  });

  it("should change pages according to the current page state", function () {
    const wrapper: ShallowWrapper<
      any,
      Readonly<{}>,
      React.Component<{}, {}, any>
    > = shallow(<ModalContent {...props} />);

    wrapper.setState({
      current_page: "checkout",
      errored: false,
      trade_id: "",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.setState({
      current_page: "confirm",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.setState({
      current_page: "failed",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.setState({
      current_page: "undo-confirm",
    });

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  describe("Confirm Page", function () {
    let wrapper: ShallowWrapper<
      any,
      Readonly<{}>,
      React.Component<{}, {}, any>
    >;

    beforeEach(function () {
      wrapper = shallow(<ModalContent {...props} />);
    });

    afterEach(function () {
      wrapper.unmount();
    });

    it("should undo the recent add action", function (preventDefault) {
      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trade_id: "abc",
      });

      wrapper.find("#undo-button").simulate("click", { preventDefault });

      expect(wrapper).toMatchSnapshot();
    });

    it("should close the modal", function (preventDefault) {
      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trade_id: "abc",
      });

      wrapper.find("#close-button").simulate("click", { preventDefault });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("Undo Confirmation Page", function () {
    it("should close the modal", function (preventDefault) {
      const wrapper: ShallowWrapper<
        any,
        Readonly<{}>,
        React.Component<{}, {}, any>
      > = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "undo-confirm",
        errored: false,
        trade_id: "abc",
      });

      wrapper.find("#close-button").simulate("click", { preventDefault });

      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();
    });
  });

  describe("Failed Page", function () {
    it("should return to the previous state", function (done) {
      const wrapper: ShallowWrapper<
        any,
        Readonly<{}>,
        React.Component<{}, {}, any>
      > = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "failed",
        errored: true,
        trade_id: "",
      });

      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Next State Method", function () {
    it("should change the current state", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "checkout",
        errored: false,
        trade_id: "",
      });

      wrapper.instance()._nextState();

      expect(wrapper.state()).toEqual({
        current_page: "confirm",
        errored: false,
        trade_id: "",
      });

      wrapper.unmount();

      done();
    });
  });

  describe("Previous State Method", function () {
    const event = {
      currentTarget: {},
    } as React.MouseEvent<HTMLInputElement>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should change the current state", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trade_id: "",
      });

      wrapper.instance()._prevState(event);

      expect(wrapper.state()).toEqual({
        current_page: "checkout",
        errored: false,
        trade_id: "",
      });

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Eror Method", function () {
    it("should change the current state", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.instance()._handleError();

      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Eror Method", function () {
    it("should change the current state", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.instance()._handleError();

      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();

      done();
    });
  });

  describe("Confirm ID Method", function () {
    it("should change the current state", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const testID = "test";

      wrapper.setState({
        current_page: "checkout",
        errored: false,
        trade_id: "",
      });

      wrapper.instance()._confirmID(testID);

      expect(wrapper.state()).toEqual({
        current_page: "checkout",
        errored: false,
        trade_id: "test",
      });

      wrapper.unmount();

      done();
    });
  });

  describe("Confirm Undo Method", function () {
    it("should change the current state to undo-confirm", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trade_id: "",
      });

      wrapper.instance()._handleUndoConfirm();

      expect(wrapper.state()).toEqual({
        current_page: "undo-confirm",
        errored: false,
        trade_id: "",
      });

      wrapper.unmount();

      done();
    });
  });

  describe("Handle Undo Method", function () {
    const flushPromises = () => new Promise(setImmediate);
    const event = {
      currentTarget: {},
    } as React.FormEvent<HTMLInputElement>;

    beforeAll(function () {
      event.preventDefault = jest.fn();
    });

    afterAll(function () {
      jest.resetAllMocks();
    });

    it("should change state to failed if the trade ID is missing", function (done) {
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "checkout",
        errored: false,
        trade_id: "",
      });

      wrapper.instance()._handleUndo(event);

      expect(wrapper.state()).toEqual({
        current_page: "failed",
        errored: true,
        trade_id: "",
      });

      wrapper.unmount();

      done();
    });

    it("should change state failed if server encounters an error", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);
      const spy = jest.spyOn<any, any>(wrapper.instance(), "_handleError");

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trade_id: "TEST",
      });

      mock.onDelete("/trade/id/TEST/delete").reply(500);

      try {
        wrapper.instance()._handleUndo(event);
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

    it("should change state to undo confirmation if delete is successful", async function (done) {
      const mock = new MockAdapater(Axios);
      const wrapper = shallow<ModalContent>(<ModalContent {...props} />);

      wrapper.setState({
        current_page: "confirm",
        errored: false,
        trade_id: "TEST",
      });

      mock
        .onDelete("/trade/id/TEST/delete")
        .reply(200, { data: { rows: [{ id: "TEST" }] } });

      wrapper.instance()._handleUndo(event);

      expect(wrapper).toMatchSnapshot();

      wrapper.unmount();
      mock.restore();

      done();
    });
  });
});
