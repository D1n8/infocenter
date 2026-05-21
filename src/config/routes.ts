export const routes = {
  main: {
    mask: '/',
    create: () => '/',
  },
  auth: {
    mask: 'auth',
    create: () => '/auth',
  },
  chartListSettings: {
    mask: '/operational-management/chart-list-settings/:sectionId',
    create: (sectionId: string) => `/operational-management/chart-list-settings/${sectionId}`,
  },
  chartBuilder: {
    mask: 'chart-builder',
    create: () => '/chart-builder',
  },
  operationalManagement: {
    mask: 'operational-management',
    create: () => '/operational-management',
  },
};
