import Button from 'components/Button';
import styles from './Section.module.scss'

type SectionType = {
    title?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}

function Section({title, children, onClick}: SectionType) {
    return ( 
        <section className={styles.section}>
            <div className={styles.topContainer}>
                <p>{title}</p>
                <Button onClick={onClick} children={'Загрузить данные'}/>
            </div>
            {children}
        </section>
     );
}

export default Section;