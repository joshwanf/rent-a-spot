import { useModal } from "../context/Modal";

const OpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  testId,
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return (
    <button onClick={onClick} data-testid={testId || ""}>
      {buttonText}
    </button>
  );
};
export default OpenModalButton;
