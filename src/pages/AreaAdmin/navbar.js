import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'

export const getNavItems = (user) => {
  let items = [
    { title: "Aggiungi dati", icon: faSquarePlus, links: [
      {name: 'Scheda Controllo', link: '/area-admin/scheda-controllo/'},
      {name: 'Articolo', link: '/area-admin/articolo/'},
    ]},
  ];
  return items
} 