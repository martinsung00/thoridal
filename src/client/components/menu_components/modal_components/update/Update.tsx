import React from "react";
import axios, { AxiosResponse } from "axios";
import styles from "../../../../styles/menu_components/modal_components/update/Update.css";
import Form from "./Form";
import { Search } from "./Search";
import { ErrorPage } from "../../../error_components/Error";
import { NotFoundPage } from "../../../error_components/NotFound";
import { Trade } from "../../../../types/index";

interface Props {
  // Add props when necessary
  toggleShow: Function;
  show: boolean;
}

interface State {
  current_page:
    | "find"
    | "failed"
    | "update-form"
    | "not-found"
    | "failed"
    | "confirm";
  errored: boolean;
  trades: Array<Trade>;
  searchTerm: string;
  updateBy: string;
}

export default class ModalContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      current_page: "find",
      errored: false,
      trades: [],
      searchTerm: "",
      updateBy: "id",
    };
  }

  // Intelligently proceed to the next correct page. If somehow current page is altered without permission, it will default to error page
  public _nextState(): void {
    if (this.state.current_page === "find") {
      this.setState({
        current_page: "update-form",
      });
    } else if (this.state.current_page === "update-form") {
      this.setState({
        current_page: "confirm",
      });
    } else {
      this._handleError();
    }
  }

  public _prevState(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();

    this.setState({
      errored: false,
      current_page: "find",
    });
  }

  public _handleError(): void {
    this.setState({
      errored: true,
      current_page: "failed",
    });
  }

  public _handleNotFound(): void {
    this.setState({
      current_page: "not-found",
    });
  }

  public _handleClose(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    event.preventDefault();
    this.setState({
      current_page: "find",
    });
    this.props.toggleShow(!this.props.show);
  }

  public _handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();

    this.setState({
      searchTerm: event.target.value,
    });
  }

  public _handleSelect(event: React.ChangeEvent<HTMLSelectElement>): void {
    event.preventDefault();

    this.setState({
      updateBy: event.currentTarget.value,
    });
  }

  public _handleSearch(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    event.preventDefault();

    const component = this;
    const query = this.state.searchTerm;
    const type = this.state.updateBy;

    // If no input was made and submit is pressed
    if (!query.length || query.length === 0) {
      component._handleNotFound();
      return;
    }

    axios
      .get(`/trade/${type}/${query}/find`)
      .then(function (response: AxiosResponse) {
        const data: Array<Trade> = response.data.rows;

        if (!data.length || data.length === 0) {
          component._handleNotFound();
        } else {
          component.setState({
            trades: data,
          });
          component._nextState();
        }
      })
      .catch(function (error) {
        console.error(error);
        component._handleError();
      });
  }

  render() {
    return (
      <div>
        {this.state.errored && this.state.current_page === "failed" && (
          <ErrorPage prevState={this._prevState.bind(this)} />
        )}
        {!this.state.errored && this.state.current_page === "not-found" && (
          <NotFoundPage prevState={this._prevState.bind(this)} />
        )}
        {!this.state.errored && this.state.current_page === "find" && (
          <Search
            handleChange={this._handleChange.bind(this)}
            handleSelect={this._handleSelect.bind(this)}
            handleSearch={this._handleSearch.bind(this)}
            updateBy={this.state.updateBy}
          />
        )}
        {!this.state.errored && this.state.current_page === "update-form" && (
          <Form
            onError={this._handleError.bind(this)}
            nextState={this._nextState.bind(this)}
            handleClose={this._handleClose.bind(this)}
            trades={this.state.trades}
          />
        )}
        {!this.state.errored && this.state.current_page === "confirm" && (
          <div className={styles.confirmState}>
            <div>Trade Successfully Updated!</div>
            <div
              className={styles.confirm}
              onClick={this._handleClose.bind(this)}
            >
              <div className={styles.confirmTag}>Confirm</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
