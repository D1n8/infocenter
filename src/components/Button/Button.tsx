import classNames from 'classnames';

import styles from './Button.module.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button {...props} className={classNames(styles.btn, className)}>
      {children}
    </button>
  );
};

export default Button;
