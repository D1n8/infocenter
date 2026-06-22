import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокручиваем и само окно (window), и контейнер с контентом (если он скроллится отдельно)
    window.scrollTo(0, 0);

    // Если у вас скроллится не window, а тег main, нужно прокрутить его.
    // Если у тега main есть id="main-scroll-container", раскомментируйте код ниже:
    // const mainContent = document.getElementById('main-scroll-container');
    // if (mainContent) {
    //   mainContent.scrollTo(0, 0);
    // }
  }, [pathname]);

  return null; // Этот компонент ничего не рендерит, он только управляет поведением
}
