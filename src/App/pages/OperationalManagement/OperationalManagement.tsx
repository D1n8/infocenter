import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { diagramStore } from 'store/DiagramStore';
import { useRootStore } from 'store/RootStore/RootStore';

import Culture from './Sections/Culture';
import Economy from './Sections/Economy';
import Production from './Sections/Production';
import Quality from './Sections/Quality';
import Safety from './Sections/Safety';

const OperationalManagement = observer(() => {
  const { userStore } = useRootStore();
  useEffect(() => {
    diagramStore.fetchDashboardData();

    return () => {
      diagramStore.resetStore();
    };
  }, []);

  return (
    <>
      {userStore.hasBlockAccess('production') && <Production />}
      {userStore.hasBlockAccess('culture') && <Culture />}
      {userStore.hasBlockAccess('economy') && <Economy />}
      {userStore.hasBlockAccess('safety') && <Safety />}
      {userStore.hasBlockAccess('quality') && <Quality />}
    </>
  );
});

export default OperationalManagement;
