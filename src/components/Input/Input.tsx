import classNames from 'classnames';

import styles from './Input.module.scss';

type InputType = React.InputHTMLAttributes<HTMLInputElement> & {};

function Input({ placeholder, className, type = 'text', ...props }: InputType) {
  return (
    <input
      {...props}
      className={classNames(className, styles.input)}
      type={type}
      placeholder={placeholder}
    />
  );
}

export default Input;
