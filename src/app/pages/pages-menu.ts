import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Analyzers Management',
    icon: 'list-outline',
    link: '/pages/analyzers',
  },
  {
    title: 'Tasks',
    group: true,
  },
  {
    title: 'Scan an Observable',
    icon: 'search-outline',
    link: '/pages/scan/observable',
  },
  {
    title: 'Scan a File',
    icon: 'file-add-outline',
    link: '/pages/scan/file',
  },
];
