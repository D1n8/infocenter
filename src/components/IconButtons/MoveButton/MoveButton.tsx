import classNames from 'classnames';

import styles from '../IconButton.module.scss';

function MoveButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={classNames(styles.emptyBtn, className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 15L2 12L5 9M2 12H22M15 5L12 2L9 5M12 2V22M9 19L12 22L15 19M19 15L22 12L19 9"
          stroke="#A3A3A3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default MoveButton;
