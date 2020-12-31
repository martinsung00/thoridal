import React from "react";
import styles from "../styles/Menu.css";
import { Add } from "./menu_components/MenuAdd";
import { Delete } from "./menu_components/MenuDelete";
import { Update } from "./menu_components/MenuUpdate";
import { Search } from "./menu_components/MenuSearch";

interface Props {
  // To-do add props as needed
}

export const Menu: React.FunctionComponent<Props> = () => {
  return (
    <div className={styles.root}>
      <Add />
      <Search />
      <Delete />
      <Update />
    </div>
  );
};
