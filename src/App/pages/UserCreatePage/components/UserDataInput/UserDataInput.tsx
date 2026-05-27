import Input from 'components/Input';

import styles from './UserDataInput.module.scss';

type UserDataInputType = {
  title: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

function UserDataInput({ title, value, onChange, type }: UserDataInputType) {
  return (
    <div className={styles.dataInput}>
      <p>{title}</p>
      <Input type={type} className={styles.input} value={value} onChange={onChange} />
    </div>
  );
}

export default UserDataInput;
