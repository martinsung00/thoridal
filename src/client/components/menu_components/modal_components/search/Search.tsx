import React from "react";
import axios, { AxiosResponse } from "axios";
import styles from "../../../../styles/menu_components/modal_components/search/Search.css";
import { Trade } from "../../../../types/index";
import { Trades } from "./Trades";

interface Props {
  toggleShow: Function;
  show: boolean;
}

interface State {
  current_page: "search" | "confirm" | "failed";
  errored: boolean;
  searchTerm: string;
  searchType: string;
  trades: Array<Trade> | [];
  page: number;
  pages: number;
}

export default class ModalContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      current_page: "search",
      errored: false,
      searchTerm: "",
      searchType: "id",
      trades: [],
      page: 1,
      pages: 0,
    };
  }

  componentDidMount(): void {
    const component = this;

    axios
      .get("/trade/all/find")
      .then(function (response) {
        const data: Array<Trade> = response.data.rows;

        component.setState(
          {
            trades: data.reverse(),
            errored: false,
          },
          function () {
            const pages = Math.ceil(component.state.trades.length / 10);

            component.setState({
              pages: pages,
            });
          }
        );
      })
      .catch(function (error: Error) {
        console.error(error);
        component._handleError();
      });
  }

  public _handleSelect(event: React.ChangeEvent<HTMLSelectElement>): void {
    event.preventDefault();

    this.setState({
      searchType: event.currentTarget.value,
    });
  }

  public _handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();

    this.setState({
      searchTerm: event.target.value,
    });
  }

  public _handleDelete(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    id: string
  ): void {
    event.preventDefault();

    const component = this;

    axios
      .delete(`/trade/id/${id}/delete`)
      .then(function () {
        component.state.trades.splice(index, 1);
        const data = component.state.trades;
        component.setState({
          trades: data,
        });
      })
      .catch(function (error: Error) {
        console.error(error);
        component._handleError();
      });
  }

  public _handleError(): void {
    this.setState({
      errored: true,
    });
  }

  public _handleSearch(event: React.FormEvent): void {
    event.preventDefault();

    const component = this;
    const type = this.state.searchType;
    const term = this.state.searchTerm;

    axios
      .get(`/trade/${type}/${term}/find`)
      .then(function (response: AxiosResponse) {
        const data: Array<Trade> = response.data.rows;
        component.setState({
          trades: data,
          errored: false,
        });
      })
      .catch(function (error) {
        console.error(error);
        component._handleError();
      });
  }

  render() {
    return (
      <div>
        <div>
          <input
            placeholder="Search Here!"
            required
            className={styles.searchBar}
            id="search-by"
            value={this.state.searchTerm}
            onChange={this._handleChange.bind(this)}
          ></input>
          <div className={styles.searchType}>
            <select
              className={styles.searchBy}
              value={this.state.searchType}
              defaultValue="id"
              onChange={this._handleSelect.bind(this)}
            >
              <option value="id">ID</option>
              <option value="ticker">Ticker</option>
              <option value="company">Company</option>
              <option value="date">Date</option>
            </select>
          </div>
          {this.state.searchTerm.length > 0 && (
            <div
              className={styles.searchButton}
              onClick={this._handleSearch.bind(this)}
            >
              Search
            </div>
          )}
          {this.state.searchTerm.length <= 0 && (
            <div className={styles.searchButtonGray}>Search</div>
          )}
        </div>
        <div className={styles.divider} />
        {this.state.trades.length > 0 && (
          <Trades
            page={this.state.page}
            pages={this.state.pages}
            trades={this.state.trades}
            handleDelete={this._handleDelete.bind(this)}
          />
        )}
        {this.state.trades.length === 0 && (
          <div className={styles.noHistory}>No Previous Trade History</div>
        )}
      </div>
    );
  }
}
