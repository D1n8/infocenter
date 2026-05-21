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
    mask: 'chart-list-settings/:sectionId',
    create: (sectionId: string) => `/chart-list-settings/${sectionId}`,
  },
  chartBuilder: {
    mask: 'chart-builder',
    create: () => '/chart-builder',
  },
};
