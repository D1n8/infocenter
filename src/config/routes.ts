export const routes = {
  main: {
    mask: '/',
    create: () => '/',
  },
  auth: {
    mask: 'auth',
    create: () => '/auth',
  },
  profile: {
    mask: 'profile',
    create: () => '/profile',
  },
  settings: {
    mask: 'settings',
    create: () => '/settings',
  },
  adminUsersList: {
    mask: 'users-list',
    create: () => '/settings/users-list',
  },
  adminUserManage: {
    mask: 'user-manage/:id',
    create: (id: string) => `/settings/user-manage/${id}`,
  },
  chartListSettings: {
    mask: '/operational-management/chart-list-settings/:sectionId',
    create: (sectionId: string) => `/operational-management/chart-list-settings/${sectionId}`,
  },
  chartBuilder: {
    mask: '/operational-management/chart-builder',
    create: () => '/operational-management/chart-builder',
  },
  operationalManagement: {
    mask: 'operational-management',
    create: () => '/operational-management',
  },
};
