import { createContext, useContext } from 'react';

import UserStore from '../UserStore';

class RootStore {
  userStore: UserStore;

  constructor() {
    this.userStore = new UserStore();
  }
}

const rootStore = new RootStore();
const RootStoreContext = createContext(rootStore);

export const useRootStore = () => useContext(RootStoreContext);
