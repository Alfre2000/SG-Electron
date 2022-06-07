import { faClipboardCheck, faToolbox, faChartLine } from '@fortawesome/free-solid-svg-icons'

export const getNavItems = (user) => {
  let items = [
    { title: "Scheda controllo", icon: faClipboardCheck, links: [
      {name: 'Nuova Scheda', link: '/manutenzione/scheda/'},
    ]},
    { title: "Manutenzioni", icon: faToolbox, links: [
        {name: 'Fissaggio', link: '/manutenzione/fissaggio/'},
        {name: 'Manutenzioni', link: '/manutenzione/manutenzioni/'},
        {name: 'Analisi', link: '/manutenzione/analisi/'},
        {name: 'Ricerca Database', link: '/manutenzione/ricerca/'},
    ]},
    { title: "Informazioni", icon: faChartLine, links: [
        {name: 'Prossime Manutenzioni', link: '/manutenzione/prossime/'},
        {name: 'Andamento Produzione', link: '/manutenzione/produzione/'},
    ]},
  ];
  if (!user.impianto.toLowerCase().includes('ossido')) {
    items.splice(1, 1)
    items[1].links.splice(0, 1)
  }
  return items
} 