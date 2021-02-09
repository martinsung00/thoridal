import React from "react";
import axios from "axios";
import styles from "../../../../styles/menu_components/modal_components/add/Add.css";
import Form from "./Form";
import { ErrorPage } from "../../../error_components/Error";

interface Props {
  toggleShow: Function;
  show: boolean;
}

interface State {
  current_page: "checkout" | "confirm" | "failed" | "undo-confirm";
  errored: boolean;
  trade_id: string;
}

export default class ModalContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      current_page: "checkout",
      errored: false,
      trade_id: "",
    };
  }

  // Misc. + Helper Functions

  public _nextState(): void {
    this.setState({
      current_page: "confirm",
    });
  }

  public _prevState(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    event.preventDefault();

    this.setState({
      errored: false,
      current_page: "checkout",
      trade_id: "",
    });
  }

  public _confirmID(tradeID: string): void {
    this.setState({
      trade_id: tradeID,
    });
  }

  // Handle Action Methods

  public _handleError(): void {
    this.setState({
      errored: true,
      current_page: "failed",
    });
  }

  public _handleUndoConfirm(): void {
    this.setState({
      current_page: "undo-confirm",
      trade_id: "",
    });
  }

  public _handleClose(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    event.preventDefault();

    this.props.toggleShow(!this.props.show);
  }

  public _handleUndo(event: React.FormEvent): void {
    const component = this;

    event.preventDefault();

    if (!this.state.trade_id.length) {
      this._handleError();
    } else {
      axios
        .delete(`/trade/id/${this.state.trade_id}/delete`)
        .then(function () {
          component._handleUndoConfirm();
        })
        .catch(function (error: Error) {
          console.error(error);
          component._handleError();
        });
    }
  }

  render() {
    return (
      <div>
        {this.state.errored && this.state.current_page === "failed" && (
          <ErrorPage prevState={this._prevState.bind(this)} />
        )}
        {!this.state.errored && this.state.current_page === "checkout" && (
          <Form
            onError={this._handleError.bind(this)}
            nextState={this._nextState.bind(this)}
            handleClose={this._handleClose.bind(this)}
            confirmID={this._confirmID.bind(this)}
          />
        )}
        {!this.state.errored && this.state.current_page === "confirm" && (
          <div className={styles.confirmState}>
            <div>Trade Successfully Added!</div>
            <div
              className={styles.undoButton}
              id="undo-button"
              onClick={this._handleUndo.bind(this)}
            >
              <div className={styles.undoButtonTag}>Undo</div>
            </div>
            <div
              className={styles.okButton}
              id="close-button"
              onClick={this._handleClose.bind(this)}
            >
              <div className={styles.okButtonTag}>Confirm</div>
            </div>
          </div>
        )}
        {!this.state.errored && this.state.current_page === "undo-confirm" && (
          <div className={styles.undoConfirmState}>
            <div>Trade Successfully Removed</div>
            <div
              className={styles.undoConfirm}
              id="close-button"
              onClick={this._handleClose.bind(this)}
            >
              <div className={styles.undoConfirmTag}>Confirm</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
