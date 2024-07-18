import React, { ReactNode } from "react";
import Modal from "react-modal";
import "./CustomModal.css";

interface CustomModalProps {
  isOpen: boolean;
  onAfterOpen?: () => void;
  onRequestClose: () => void;
  contentLabel: string;
  className?: string;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onAfterOpen,
  onRequestClose,
  contentLabel,
  className,
  children,
}) => {
  return (
    <Modal
      className={className}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
