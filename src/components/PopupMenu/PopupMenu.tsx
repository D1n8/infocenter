import styles from './PopupMenu.module.scss';

type PopupMenuType = {
  children: React.ReactNode;
};

function PopupMenu({ children, ...props }: PopupMenuType) {
  return (
    <div {...props} className={styles.popupMenu}>
      {children}
    </div>
  );
}

export default PopupMenu;
