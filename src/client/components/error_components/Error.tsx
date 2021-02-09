import React from "react";
import styles from "../../styles/error_components/Error.css";

interface Props {
  prevState: Function;
}

export const ErrorPage: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.errorState}>
      <div>Uh Oh.. Something Went Terribly Wrong!</div>
      <div className={styles.errorButton}>
        <div
          className={styles.errorButtonTag}
          id="return-button"
          onClick={function (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
          ) {
            props.prevState(event);
          }}
        >
          Go Back
        </div>
      </div>
    </div>
  );
};
