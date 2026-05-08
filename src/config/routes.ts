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
    mask: 'chart-list-settings',
    create: () => '/chart-list-settings',
  },
  chartBuilder: {
    mask: 'chart-builder',
    create: () => '/chart-builder',
  },
};
