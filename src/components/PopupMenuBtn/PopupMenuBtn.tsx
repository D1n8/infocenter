import styles from './PopupMenuBtn.module.scss';

type PopupMenuType = {
  icon: React.ReactNode;
  text: string;
};

function PopupMenuBtn({ icon, text }: PopupMenuType) {
  return (
    <button className={styles.popupBtn}>
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default PopupMenuBtn;
