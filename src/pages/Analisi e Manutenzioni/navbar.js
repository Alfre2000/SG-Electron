import { faClipboardCheck, faToolbox, faChartLine, faUserPlus } from '@fortawesome/free-solid-svg-icons'
const electron = window.require('electron');

export const getNavItems = (user) => {
  let items = [
    { title: "Scheda controllo", icon: faClipboardCheck, links: [
      {name: 'Nuova Scheda', link: '/manutenzione/record-lavorazione/'},
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
    { title: "Admin", icon: faUserPlus, links: [
      {name: "Nuova Scheda Controllo", link: '/manutenzione/scheda-controllo/'},
      {name: 'Pannello Amministratore', action: () => electron.ipcRenderer.invoke('open-admin')},
    ]}
  ];
  if (!user.impianto?.nome.toLowerCase().includes('ossido')) {
    items.splice(1, 1)
    items[1].links.splice(0, 1)
  }
  if (!user.is_staff) {
    items.pop()
  }
  if (!user.impianto?.nome) {
    items = []
  }
  return items
} 