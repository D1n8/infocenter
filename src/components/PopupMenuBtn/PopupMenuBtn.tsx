import styles from './PopupMenuBtn.module.scss';

type PopupMenuType = {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
};

function PopupMenuBtn({ onClick, icon, text }: PopupMenuType) {
  return (
    <button onClick={onClick} className={styles.popupBtn}>
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default PopupMenuBtn;
