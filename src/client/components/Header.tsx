import React from "react";
import styles from "../styles/Header.css";
import logo from "../logo/logo.svg";

interface Props {
  // To-do: Specify prop types
}

interface State {
  // To-do: Add more state types
  searchType: string;
  searchTerm: string | undefined;
}

export default class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchType: "id",
      searchTerm: "",
    };
  }

  render() {
    return (
      <div>
        <div className={styles.root}>
          <div className={styles.title}>THORIDAL</div>
          <img src={logo} alt="Main Logo" className={styles.mainLogo} />
        </div>
      </div>
    );
  }
}
