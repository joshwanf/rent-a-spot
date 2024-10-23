import { useModal } from "../../context/Modal";

interface Props {
  modalComponent: JSX.Element;
  buttonText: string;
  onButtonClick?: () => void;
  onModalClose?: () => void;
  className?: string;
}

export const DeleteOpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  className,
}: Props) => {
  const { setModalContent, setOnModalClose } = useModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return (
    <button className={className} onClick={handleClick}>
      {buttonText}
    </button>
  );
};
