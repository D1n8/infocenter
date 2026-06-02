import classNames from 'classnames';
import CloseButton from 'components/IconButtons/CloseButton/CloseButton';

import styles from './Modal.module.scss';

type ModalType = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'small' | 'large';
};

function Modal({ isOpen, children, onClose, size = 'large' }: ModalType) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={classNames(styles.content, styles[size])}>
        <CloseButton onClick={onClose} className={styles.closeBtn} />
        {children}
      </div>
    </div>
  );
}

export default Modal;
