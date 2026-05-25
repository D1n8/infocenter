import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';

import styles from './Dropdown.module.scss';

export type DropdownOption = {
  value: string | number;
  label: string;
};

type DropdownProps = {
  id: string;
  options: DropdownOption[];
  value: string | number | null;
  onChange: (option: DropdownOption) => void;
  placeholder?: string;
};

function Dropdown({ id, options, value, onChange, placeholder = 'Выберите...' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: DropdownOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.customDropdown} ref={dropdownRef} id={id}>
      <div
        className={classNames(styles.dropdownHeader, isOpen ? 'open' : '')}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={classNames(selectedOption ? styles.dropdownValue : styles.dropdownPlaceholder)}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={classNames(styles.dropdownArrow, isOpen ? 'open' : '')}
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L7 7L13 1"
            stroke="#6B6B6B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option.value}
                className={classNames(
                  styles.dropdownItem,
                  option.value === value ? 'selected' : ''
                )}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className={classNames(styles.dropdownItem, styles.empty)}>Нет данных</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
