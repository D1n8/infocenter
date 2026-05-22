import CloseButton from 'components/IconButtons/CloseButton/CloseButton';

import styles from './Modal.module.scss';

type ModalType = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ isOpen, children, onClose }: ModalType) {
  if (!isOpen) {
    return;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <CloseButton onClick={onClose} className={styles.closeBtn} />
        {children}
      </div>
    </div>
  );
}

export default Modal;
