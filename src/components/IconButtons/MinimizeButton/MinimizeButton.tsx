import classNames from 'classnames';

import styles from '../IconButton.module.scss';

function MinimizeButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
          d="M3.33333 11.6667H8.33333M8.33333 11.6667V16.6667M8.33333 11.6667L2.5 17.5M16.6667 8.33333H11.6667M11.6667 8.33333V3.33333M11.6667 8.33333L17.5 2.5"
          stroke="#171717"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default MinimizeButton;
