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
    group: true,
  },
  {
    title: 'Table View',
    icon: 'list-outline',
    link: '/pages/analyzers/table',
  },
  {
    title: 'Tree View',
    icon: 'funnel',
    link: '/pages/analyzers/tree',
  },
  {
    title: 'Scans Management',
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
