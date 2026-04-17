import styles from './OperationalManagement.module.scss'
import CorporateCulture from './Sections/CorporateCulture';
import Economy from './Sections/Economy';
import Production from './Sections/Production';
import Quality from './Sections/Quality';
import Safety from './Sections/Safety';

function OperationalManagement() {
    return ( 
        <div className={styles.operMan}>    
            <Production/>
            <Economy/>
            <Safety/>
            <Quality/>
            <CorporateCulture/>
        </div>
     );
}

export default OperationalManagement;