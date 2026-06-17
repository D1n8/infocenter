import classNames from 'classnames';
import type { ReactNode, InputHTMLAttributes } from 'react';

import styles from './Input.module.scss';

type InputType = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

function Input({ placeholder, className, type = 'text', icon, ...props }: InputType) {
  if (icon) {
    return (
      <div className={classNames(className, styles.inputWrapper)}>
        <span className={styles.icon}>{icon}</span>
        <input
          {...props}
          className={classNames(styles.input, styles.withIcon)}
          type={type}
          placeholder={placeholder}
        />
      </div>
    );
  }

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
