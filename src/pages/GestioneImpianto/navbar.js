import { faClipboardCheck, faToolbox, faChartLine, faClipboardList } from '@fortawesome/free-solid-svg-icons'

export const getNavItems = (user) => {
  let items = [
    { title: "Scheda controllo", icon: faClipboardCheck, links: [
      {name: 'Nuova scheda', link: '/manutenzione/record-lavorazione/'},
      {name: 'Schede in sospeso', link: '/manutenzione/record-lavorazione-in-sospeso/'},
    ]},
    { title: "Scheda impianto", icon: faClipboardList, links: [
      {name: 'Nuova scheda', link: '/manutenzione/record-scheda-impianto/'},
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
  if (!user.impianto?.nome.toLowerCase().includes('ossido')) {
    items.splice(2, 1)
    items[2].links.splice(0, 1)
  } else {
    items[0].links.splice(1, 1)
  }
  if (!user.impianto?.nome) {
    items = []
  }
  return items
} 