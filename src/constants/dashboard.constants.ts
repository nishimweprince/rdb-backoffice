import {
  faDatabase,
  faHouse,
  faUser,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

// MONTHS DATA
export const monthsData = () => {
  return [
    {
      month: 'January',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'February',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'March',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'April',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    { month: 'May', value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100 },
    {
      month: 'June',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'July',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'August',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'September',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'October',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'November',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
    {
      month: 'December',
      value: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    },
  ];
};

// STAFF DASHBOARD CARDS
export const staffDashboardCards = [
  {
    title: 'Applications',
    value: 100000,
    icon: faDatabase,
    change: '10',
    route: '/review-applications',
  },
  {
    title: 'Collaterals',
    value: 10,
    icon: faHouse,
    change: -5,
    route: 'review-collaterals',
  },
  {
    title: 'Foreign Accounts',
    value: 1,
    icon: faUser,
    change: 0,
    route: '/foreign-applicants',
  },
  {
    title: 'Users',
    value: 1000,
    icon: faUserGroup,
    change: 0,
    route: '/staff',
  },
];
