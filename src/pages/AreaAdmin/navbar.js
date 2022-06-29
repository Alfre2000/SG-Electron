import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'

export const getNavItems = (user) => {
  let items = [
    { title: "Aggiungi dati", icon: faSquarePlus, links: [
      {name: 'Scheda controllo', link: '/area-admin/scheda-controllo/'},
      {name: 'Articolo', link: '/area-admin/articolo/'},
      {name: 'Scheda impianto', link: '/area-admin/scheda-impianto/'},
      {name: 'Analisi', link: '/area-admin/analisi/'},
      {name: 'Manutenzione', link: '/area-admin/manutenzione/'},
    ]},
  ];
  return items
} 