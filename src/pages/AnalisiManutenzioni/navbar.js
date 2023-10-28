import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

export const getNavItems = (user) => {
  let items = [
    { title: "Prossime", icon: faCalendarCheck, links: [
      {name: 'Prossime', link: '/analisi-manutenzioni/prossime-manutenzioni/'},
    ]},
  ];
  return items
} 