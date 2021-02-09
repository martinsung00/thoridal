import React from "react";
import axios from "axios";
import styles from "../../../../styles/menu_components/modal_components/update/UpdateForm.css";
import { Trade } from "../../../../types/index";

interface Props {
  onError: Function;
  nextState: Function;
  handleClose: Function;
  trades: Array<Trade>;
}

interface State {
  id: string;
  ticker: string;
  company_name: string;
  reference_number: string;
  unit_price: number;
  quantity: number;
  total_cost: number;
  trade_type: string;
  note: string;
  created_at: Date;
  trade_status: boolean;
  trade_action: string;
}

export default class Form extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const prevTrade = this.props.trades[0];

    this.state = {
      id: prevTrade.id,
      ticker: prevTrade.ticker,
      company_name: prevTrade.company_name,
      reference_number: prevTrade.reference_number,
      unit_price: prevTrade.unit_price,
      quantity: prevTrade.quantity,
      total_cost: prevTrade.total_cost,
      trade_type: prevTrade.trade_type,
      note: prevTrade.note,
      created_at: prevTrade.created_at,
      trade_status: prevTrade.trade_status,
      trade_action: prevTrade.trade_action,
    };
  }

  public _handleSelect(event: React.FormEvent<HTMLSelectElement>): void {
    event.preventDefault();

    this.setState({
      trade_type: event.currentTarget.value,
    });
  }

  public _handleTradeAction(event: React.FormEvent<HTMLSelectElement>): void {
    event.preventDefault();

    this.setState({
      trade_action: event.currentTarget.value,
    });
  }

  public _handleTradeStatus(event: React.FormEvent<HTMLSelectElement>): void {
    event.preventDefault();

    if (event.currentTarget.value === "fulfilled") {
      this.setState({
        trade_status: true,
      });
    } else {
      this.setState({
        trade_status: false,
      });
    }
  }

  public _handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const key = event.target.name;
    const value = event.target.value;

    event.preventDefault();

    if (Object.keys(this.state).includes(key)) {
      this.setState({
        ...this.state,
        [key]: value,
      });
    }
  }

  public _onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const component = this;
    const document: Trade = {
      id: this.state.id,
      ticker: this.state.ticker,
      company_name: this.state.company_name,
      reference_number: this.state.reference_number,
      unit_price: this.state.unit_price,
      quantity: this.state.quantity,
      total_cost: this.state.total_cost,
      trade_type: this.state.trade_type === "short" ? "short" : "long",
      note: this.state.note,
      created_at: new Date(),
      trade_status: this.state.trade_status,
      trade_action: this.state.trade_action === "sold" ? "sold" : "bought",
    };

    axios
      .put("/trade/user/write", document)
      .catch(function (error) {
        component.props.onError();
        throw error;
      })
      .then(function () {
        component.props.nextState();
      });
  }

  render() {
    const component = this;

    return (
      <div className={styles.form}>
        <form onSubmit={this._onSubmit.bind(this)} className="inputForm">
          <label className={styles.label}>
            ID:{"  "}
            <input
              disabled
              type="string"
              placeholder="e.g 1234ABC"
              required
              name="id"
              id="id"
              value={this.state.id}
              className={styles.inputBoxID}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Company Name:{"  "}
            <input
              type="string"
              placeholder="e.g abc"
              required
              name="company_name"
              id="company_name"
              value={this.state.company_name}
              className={styles.inputBoxCompany}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Ticker:{"  "}
            <input
              type="string"
              placeholder="e.g abc"
              required
              name="ticker"
              id="ticker"
              value={this.state.ticker}
              className={styles.inputBoxTicker}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Reference Number:{"  "}
            <input
              type="string"
              placeholder="e.g 1234ABC"
              required
              name="reference_number"
              id="reference_number"
              value={this.state.reference_number}
              className={styles.inputBoxRef}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Unit Price:{"  "}
            <input
              type="number"
              placeholder="e.g 19.99"
              required
              name="unit_price"
              id="unit_price"
              value={this.state.unit_price}
              className={styles.inputBoxUnitPrice}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Quantity:{"  "}
            <input
              type="number"
              placeholder="e.g 100"
              required
              name="quantity"
              id="quantity"
              value={this.state.quantity}
              className={styles.inputBoxQuantity}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Total Cost:{"  "}
            <input
              type="number"
              placeholder="e.g 199.99"
              required
              name="total_cost"
              id="total_cost"
              value={this.state.total_cost}
              className={styles.inputBoxTotal}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Trade Type:{"  "}
            <select
              onChange={this._handleSelect.bind(this)}
              value={this.state.trade_type}
              defaultValue="short"
              id="trade_type"
              className={styles.selectBoxType}
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Trade Status:{"  "}
            <select
              onChange={this._handleTradeStatus.bind(this)}
              value={
                this.state.trade_status === true ? "fulfilled" : "not-fulfilled"
              }
              defaultValue="not-fulfilled"
              id="trade_status"
              className={styles.selectBoxStatus}
            >
              <option value="fulfilled">Fulfilled</option>
              <option value="not-fulfilled">Not Fulfilled</option>
            </select>
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Trade Action:{"  "}
            <select
              onChange={this._handleTradeAction.bind(this)}
              value={this.state.trade_action}
              id="trade_action"
              className={styles.selectBoxAction}
            >
              <option value="bought">Bought</option>
              <option value="sold">Sold</option>
            </select>
          </label>
          <div className={styles.spacing} />
          <label className={styles.label}>
            Note:{"  "}
            <input
              type="string"
              placeholder="e.g Hello World"
              required
              name="note"
              id="note"
              value={this.state.note}
              className={styles.inputBoxNote}
              onChange={this._handleChange.bind(this)}
            />
          </label>
          <div className={styles.spacing} />
          <input className={styles.submit} type="submit" value="Submit" />
        </form>
        <div
          className={styles.cancel}
          id="cancel-button"
          onClick={function (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
          ): void {
            event.preventDefault();

            component.props.handleClose(event);
          }}
        >
          <div className={styles.cancelText}>Cancel</div>
        </div>
      </div>
    );
  }
}
