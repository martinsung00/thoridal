import React from "react";
import styles from "../../../../styles/menu_components/modal_components/update/UpdateSearch.css";

interface Props {
  // To do: Add props as needed
  handleChange: Function;
  handleSelect: Function;
  handleSearch: Function;
  updateBy: string;
}

export const Search: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.root}>
      <div>Update Trade By:</div>
      <select
        className={styles.searchBy}
        defaultValue="id"
        id="update-by"
        value={props.updateBy}
        onChange={function (event: React.ChangeEvent<HTMLSelectElement>) {
          props.handleSelect(event);
        }}
      >
        <option value="id">ID</option>
        <option value="ticker">Ticker</option>
        <option value="company">Company Name</option>
        <option value="date">Date</option>
      </select>
      <input
        placeholder={props.updateBy === "date" ? "MM-DD-YYYY" : ""}
        required
        className={styles.searchBar}
        id="update-input"
        onChange={function (event: React.ChangeEvent<HTMLInputElement>) {
          props.handleChange(event);
        }}
      ></input>
      <div
        className={styles.searchButton}
        id="search-button"
        onClick={function (
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) {
          props.handleSearch(event);
        }}
      >
        <div className={styles.searchButtonTag}>Search</div>
      </div>
    </div>
  );
};
