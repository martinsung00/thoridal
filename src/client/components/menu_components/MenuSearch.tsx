import React, { useState } from "react";
import styles from "../../styles/menu_components/MenuSearch.css";
import Modal from "react-modal";
import ModalContent from "./modal_components/search/Search";

export const Search: React.FunctionComponent<{}> = () => {
  const [show, toggleShow] = useState(false);

  return (
    <div>
      <Modal
        isOpen={show}
        shouldCloseOnOverlayClick={true}
        onRequestClose={function (): void {
          /* istanbul ignore next */
          toggleShow(!show);
        }}
        contentLabel="My dialog"
        id="modal-component"
        className={show ? styles.mymodal : "display-none"}
        overlayClassName={styles.myoverlay}
        closeTimeoutMS={0}
      >
        <div
          onClick={function (): void {
            toggleShow(!show);
          }}
          className={styles.closeModal}
          id="close-modal"
        >
          {"\u00d7"}
        </div>
        <ModalContent toggleShow={toggleShow.bind(this)} show={show} />
      </Modal>
      <div
        className={styles.root}
        id="menu-search"
        onClick={function () {
          toggleShow(!show);
        }}
      >
        <div className={styles.description}>Find a Trade</div>
        <div className={styles.searchLogo} />
        <div className={styles.decoration} />
      </div>
    </div>
  );
};
