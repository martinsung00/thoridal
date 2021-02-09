import React from "react";
import styles from "../../styles/recent_trades_components/RecentTrades.css";
import { Trade } from "../../types/index";

interface Props {
  trades: Array<Trade> | [];
  handleDelete: Function;
  history: Boolean;
  errored: Boolean;
}

export const RecentTrades: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div>
      <br />
      {props.errored && (
        <div>
          <div className={styles.errorState}>
            Uh Oh.. Something Has Gone Terribly Wrong! Try Again Later!
          </div>
        </div>
      )}
      {!props.history && !props.errored && (
        <div>
          <div className={styles.errorState}>
            Could Not Find Any Trade History
          </div>
        </div>
      )}
      {props.history && !props.errored && (
        <div className={styles.root}>
          <div style={{ marginTop: "-4em" }}>
            {(props.trades as Trade[]).map((trade: Trade, index: number) => {
              return (
                <div key={index} className={styles.trade}>
                  <div className={styles.content}>
                    <div className={styles.info}>
                      {" "}
                      <div>
                        Trade ID:
                        <div className={styles.item}>{trade.id}</div>
                      </div>
                      <br />
                      <div>
                        Reference Number:
                        <div className={styles.item}>
                          {trade.reference_number}
                        </div>
                      </div>
                      <br />
                      <div>
                        Ticker:
                        <div className={styles.item}>{trade.ticker}</div>
                      </div>
                      <br />
                      <div>
                        Company Name:
                        <div className={styles.item}>{trade.company_name}</div>
                      </div>
                      <br />
                      <br />
                    </div>
                    <div className={styles.note}>
                      <div className={styles.comment}>{trade.note}</div>
                      <br />
                      <div className={styles.additionalInfo}>
                        <div className={styles.details}>
                          {trade.trade_action === "bought" ? "Bought" : "Sold"}
                        </div>
                        <div className={styles.details}>
                          {trade.trade_type === "short" ? "Short" : "Long"}
                        </div>
                        <div className={styles.details}>
                          {trade.trade_status ? "Fulfilled" : "Not Fulfilled"}
                        </div>
                        <div className={styles.details}>
                          {`${trade.created_at}`.slice(0, 10)}
                        </div>
                        <br />
                        <div className={styles.cost}>
                          <div className={styles.details}>
                            Total Cost: ${trade.total_cost}
                          </div>
                          <div className={styles.details}>
                            Unit Price: ${trade.unit_price}
                          </div>
                          <div className={styles.details}>
                            Quantity: {trade.quantity}
                          </div>
                        </div>
                        <div className={styles.controls}>
                          <div
                            className={styles.controlUpdate}
                            id="update-button"
                          >
                            {"\u21ea"}
                          </div>
                          <div
                            className={styles.controlDelete}
                            id="delete-button"
                            onClick={function (
                              event: React.MouseEvent<
                                HTMLDivElement,
                                MouseEvent
                              >
                            ) {
                              const id = trade.id;
                              props.handleDelete(event, index, id);
                            }}
                          >
                            {"\u2297"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
