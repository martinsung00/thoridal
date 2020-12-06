import React from "react";
import styles from "../styles/Header.css";
import logo from "../logo/logo.svg";
import spyglass from "../logo/spyglass.svg";

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

  _handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      searchTerm: event.target.value,
    });
  }

  _handleSelect(event: React.FormEvent<HTMLSelectElement>) {
    this.setState({
      searchType: event.currentTarget.value,
    });
  }

  render() {
    return (
      <div>
        <div className={styles.head}>
          <div className={styles.title}>THORIDAL</div>
          <img src={logo} alt="Main Logo" className={styles.mainLogo} />
          <div className={styles.searchbar}>
            <img
              src={spyglass}
              alt="Search Icon"
              className={styles.searchIcon}
            />
            <div>
              <input
                type="text"
                placeholder="Search By"
                value={this.state.searchTerm}
                onChange={this._handleChange.bind(this)}
                className={styles.search}
              />
            </div>
            <div className={styles.searchType}>
              <select
                className={styles.sortBy}
                value={this.state.searchType}
                onChange={this._handleSelect.bind(this)}
                defaultValue="id"
              >
                <option value="id">ID</option>
                <option value="company">Company</option>
                <option value="ticker">Ticker</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
