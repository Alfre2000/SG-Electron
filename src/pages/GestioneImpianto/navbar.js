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
  // Se non è l'impianto Ossido, rimuovi le manutenzioni e aggiungi la scheda dell'ossido
  if (!user.impianto?.nome.toLowerCase().includes('ossido')) {
    items.splice(2, 1) // Remove Manutenzioni
    items[2].links.splice(0, 1) // Remove Prossime Manutenzioni
  } else {
    items[0].links.splice(1, 1) // Remove Schede in sospeso
    items.splice(0, 0, { title: "Scheda valvole", icon: faClipboardCheck, links: [
      {name: 'Nuova scheda', link: '/manutenzione/record-lavorazione-ossido/'},
    ]})
  }
  if (!user.impianto?.nome) {
    items = []
  }
  return items
} 