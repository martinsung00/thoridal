import * as React from "react";
import styles from "../../styles/metrics_compnent/Metrics.css";

interface Props {
  // To-do: Specify prop types
  net: number;
  totalWeekTrades: number;
  totalFulfilled: number;
  totalUnfulfilled: number;
  avgGainPerDay: number;
  avgTradePerDay: number;
}

export const Metrics: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Weekly Statistics</div>
      <div className={styles.left}>
        {props.net >= 0 && (
          <label className={styles.net}>
            NET GAIN: <div className={styles.gain}>+{props.net}</div>
          </label>
        )}
        {props.net < 0 && (
          <label className={styles.net}>
            NET LOSS: <div className={styles.loss}>{props.net}</div>
          </label>
        )}
        <div className={styles.divider} />
        <label className={styles.net}>
          TOTAL TRADES:{" "}
          <div className={styles.total}>{props.totalWeekTrades}</div>
        </label>
        <div className={styles.divider} />
        <div className={styles.divider} />
        <div className={styles.divider} />
        <label className={styles.secondary}>
          Total Completed Trades:{" "}
          <div className={styles.totalSecondary}>{props.totalFulfilled}</div>
        </label>
        <div className={styles.divider} />
        <label className={styles.secondary}>
          Total Pending Trades:{" "}
          <div className={styles.totalSecondary}>{props.totalUnfulfilled}</div>
        </label>
      </div>
      <div className={styles.right}>
        <label className={styles.perDay}>
          AVG GAIN PER DAY:{" "}
          <div className={styles.perDayTotal}>$ {props.avgGainPerDay}</div>
        </label>
        <div className={styles.divider} />
        <label className={styles.perDay}>
          AVG TRADE PER DAY:{" "}
          <div className={styles.perDayTotal}>{props.avgTradePerDay}</div>
        </label>
      </div>
    </div>
  );
};
