import React from "react";
import axios, { AxiosResponse } from "axios";
import styles from "../../../../styles/menu_components/modal_components/delete/Delete.css";
import { ErrorPage } from "../../../error_components/Error";
import { NotFoundPage } from "../../../error_components/NotFound";

interface Props {
  toggleShow: Function;
  show: boolean;
}

interface State {
  current_page: "delete" | "not-found" | "errored" | "confirm";
  errored: boolean;
  deleteTerm: string;
  deleteType: string;
}

export default class ModalContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      current_page: "delete",
      errored: false,
      deleteTerm: "",
      deleteType: "id",
    };
  }

  public _prevState(): void {
    this.setState({
      errored: false,
      current_page: "delete",
    });
  }

  public _handleError(): void {
    this.setState({
      current_page: "errored",
      errored: true,
    });
  }

  public _handleSelect(event: React.ChangeEvent<HTMLSelectElement>): void {
    event.preventDefault();

    this.setState({
      deleteType: event.currentTarget.value,
    });
  }

  public _handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();

    this.setState({
      deleteTerm: event.target.value,
    });
  }

  public _handleDelete(event: React.FormEvent): void {
    event.preventDefault();

    const component = this;

    axios
      .delete(`/trade/${this.state.deleteType}/${this.state.deleteTerm}/delete`)

      .then(function (response: AxiosResponse) {
        if (response.data.rows.length === 0) {
          component.setState({
            errored: false,
            current_page: "not-found",
          });
        } else {
          component.setState({
            errored: false,
            current_page: "confirm",
          });
        }
      })
      .catch(function (error: Error) {
        console.error(error);
        component._handleError();
      });
  }

  render() {
    return (
      <div>
        {this.state.current_page === "errored" && this.state.errored && (
          <ErrorPage prevState={this._prevState.bind(this)} />
        )}
        {this.state.current_page === "not-found" && !this.state.errored && (
          <NotFoundPage prevState={this._prevState.bind(this)} />
        )}
        {this.state.current_page === "confirm" && !this.state.errored && (
          <div className={styles.root}>
            <div>The Desired Trade Has Been Deleted!</div>
            <div className={styles.back} onClick={this._prevState.bind(this)}>
              <div className={styles.backTag}>Back</div>
            </div>
          </div>
        )}
        {this.state.current_page === "delete" && !this.state.errored && (
          <div className={styles.root}>
            <div>Delete Trade By:</div>
            <select
              className={styles.deleteBy}
              defaultValue="id"
              id="update-by"
              value={this.state.deleteType}
              onChange={this._handleSelect.bind(this)}
            >
              <option value="id">ID</option>
              <option value="ticker">Ticker</option>
              <option value="company">Company Name</option>
              <option value="date">Date</option>
            </select>
            <input
              placeholder={this.state.deleteType === "date" ? "MM-DD-YYYY" : ""}
              required
              className={styles.searchBar}
              id="update-input"
              onChange={this._handleChange.bind(this)}
            ></input>
            <div
              className={styles.deleteButton}
              id="search-button"
              onClick={this._handleDelete.bind(this)}
            >
              <div className={styles.deleteButtonTag}>Delete</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
