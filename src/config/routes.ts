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
  adminUsersManage: {
    mask: 'users-manage',
    create: () => '/settings/users-manage',
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
