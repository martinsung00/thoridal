import * as React from "react";
import axios from "axios";
import styles from "../styles/App.css";
import { Trade } from "../types/index";
import Header from "./Header";
import { Menu } from "./Menu";
import { RecentTrades } from "./recent_trades_components/RecentTrades";
import { Metrics } from "./metrics_components/Metrics";

interface Props {
  // To-do: Specify prop types
}

interface State {
  // To-do: Add more state types
  trades: Array<Trade>;
  net: number;
  totalWeekTrades: number;
  totalFulfilled: number;
  totalUnfulfilled: number;
  avgGainPerDay: number;
  avgTradePerDay: number;
  errored: boolean;
  history: boolean;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      trades: [],
      net: 0,
      totalWeekTrades: 0,
      totalFulfilled: 0,
      totalUnfulfilled: 0,
      avgGainPerDay: 0,
      avgTradePerDay: 0,
      errored: false,
      history: true,
    };
  }

  componentDidMount() {
    const component = this;

    axios
      .get("/trade/recent/find")
      .then(function (response) {
        const data: Array<Trade> = response.data.rows;

        if (data.length && data.length > 0) {
          component._setMetrics(data);
        } else {
          component.setState({
            history: false,
          });
        }
      })
      .catch(function (err: Error) {
        console.error(err);
        component._handleError();
      });
  }

  public _setMetrics(data: Array<Trade>): void {
    let gain: number = 0;
    let fulfilled: number = 0;
    let unfulfilled: number = 0;

    for (let i = 0; i < data.length; i++) {
      if (!!data[i].trade_status) {
        const cost: number = Number(data[i].total_cost);

        data[i].trade_action === "bought" ? (gain -= cost) : (gain += cost);

        fulfilled++;
      } else {
        unfulfilled++;
      }
    }

    let total: number = Number(Number(gain).toFixed(2));
    let avgGain: number = Number(Number(gain / 7).toFixed(2));
    let avgTrade: number = Number(Number(data.length / 7).toFixed(2));
    const reversed: Array<Trade> = data.reverse();

    this.setState({
      trades: reversed,
      net: total,
      totalWeekTrades: data.length,
      totalFulfilled: fulfilled,
      totalUnfulfilled: unfulfilled,
      avgGainPerDay: avgGain,
      avgTradePerDay: avgTrade,
    });
  }

  public _handleError(): void {
    this.setState({
      errored: true,
    });
  }

  public _handleDelete(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    id: string
  ): void {
    event.preventDefault();

    const data: Array<Trade> = this.state.trades;
    const component = this;

    axios
      .delete(`/trade/id/${id}/delete`)
      .then(function () {
        component.setState({
          trades: data.splice(index, 1),
        });
      })
      .catch(function (error: Error) {
        console.error(error);
        component._handleError();
      });
  }

  render() {
    return (
      <div>
        <Header />
        <Menu />
        <br />
        <Metrics
          net={this.state.net}
          totalWeekTrades={this.state.totalWeekTrades}
          totalFulfilled={this.state.totalFulfilled}
          totalUnfulfilled={this.state.totalUnfulfilled}
          avgGainPerDay={this.state.avgGainPerDay}
          avgTradePerDay={this.state.avgTradePerDay}
        />
        <br />
        <div className={styles.title}>Recent Trade(s)</div>
        <br />
        <RecentTrades
          trades={this.state.trades.splice(0, 5)}
          handleDelete={this._handleDelete.bind(this)}
          history={this.state.history}
          errored={this.state.errored}
        />
      </div>
    );
  }
}
