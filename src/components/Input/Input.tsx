import classNames from 'classnames';

import styles from './Input.module.scss';

type InputType = React.InputHTMLAttributes<InputType> & {};

function Input({ placeholder, className, type = 'text' }: React.InputHTMLAttributes<InputType>) {
  return (
    <input className={classNames(className, styles.input)} type={type} placeholder={placeholder} />
  );
}

export default Input;
