import { useModal } from "../../context/Modal";

import "../../css/OpenModalMenuItem.css";

/**
 *
 * @param {object} props
 * @param {any} [props.modalComponent]
 * @param {string} [props.itemText]
 * @param {() => void} [props.onItemClick]
 * @param {() => void} [props.onModalClose]
 * @returns
 */
function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <li onClick={onClick} className="openModalMenuItem">
      {itemText}
    </li>
  );
}

export default OpenModalMenuItem;
