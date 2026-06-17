import classNames from 'classnames';

import styles from '../IconButton.module.scss';

function MaximizeButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={classNames(styles.emptyBtn, className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 2.5H17.5M17.5 2.5V7.5M17.5 2.5L11.6667 8.33333M7.5 17.5H2.5M2.5 17.5V12.5M2.5 17.5L8.33333 11.6667"
          stroke="#171717"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default MaximizeButton;
