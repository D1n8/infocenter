import { createContext, useContext } from 'react';

import DiagramStore from '../DiagramStore';
import NotificationStore from '../NotificationStore';
import UserStore from '../UserStore';

export class RootStore {
  userStore: UserStore;
  diagramStore: DiagramStore;
  notificationStore: NotificationStore;

  constructor() {
    this.diagramStore = new DiagramStore();
    this.notificationStore = new NotificationStore();
    this.userStore = new UserStore(this.notificationStore);
  }
}

const rootStore = new RootStore();
export const RootStoreContext = createContext(rootStore);
export const useRootStore = () => useContext(RootStoreContext);
