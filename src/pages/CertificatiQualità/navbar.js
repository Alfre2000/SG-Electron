import { faCertificate, faFileCircleCheck, faTags } from '@fortawesome/free-solid-svg-icons'

export const getNavItems = (user) => {
  let items = [
    { title: "Certificati qualità", icon: faCertificate, links: [
      {name: 'Certificati Qualità', link: '/certificati-qualita/record-certificato/'},
    ]},
    { title: "Modelli Certificati", icon: faFileCircleCheck, links: [
        {name: 'Modelli Certificati', link: '/certificati-qualita/certificato/'},
      ]},
    { title: "Etichette MTA", icon: faTags, links: [
        {name: 'Etichette MTA', link: '/certificati-qualita/etichette-mta/'},
      ]},
  ];
  return items
} 