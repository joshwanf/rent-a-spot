import { useModal } from "../../context/Modal";

export const DeleteOpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button onClick={handleClick}>{buttonText}</button>;
};
