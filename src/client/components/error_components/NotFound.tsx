import React from "react";
import styles from "../../styles/error_components/NotFound.css";

interface Props {
  prevState: Function;
}

export const NotFoundPage: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.notFoundState}>
      <div>Trade Not Found</div>
      <div
        className={styles.notFound}
        id="try-again-button"
        onClick={function (
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) {
          props.prevState(event);
        }}
      >
        <div className={styles.notFoundTag}>Try Again</div>
      </div>
    </div>
  );
};
