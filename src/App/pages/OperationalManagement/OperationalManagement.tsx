import CorporateCulture from './Sections/CorporateCulture';
import Economy from './Sections/Economy';
import Production from './Sections/Production';
import Quality from './Sections/Quality';
import Safety from './Sections/Safety';

function OperationalManagement() {
  return (
    <>
      <Production />
      <Economy />
      <Safety />
      <Quality />
      <CorporateCulture />
    </>
  );
}

export default OperationalManagement;
