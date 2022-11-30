import { faCertificate, faFileCircleCheck } from '@fortawesome/free-solid-svg-icons'

export const getNavItems = (user) => {
  let items = [
    { title: "Certificati qualità", icon: faCertificate, links: [
      {name: 'Certificati Qualità', link: '/certificati-qualita/record-certificato/'},
    ]},
    { title: "Modelli Certificati", icon: faFileCircleCheck, links: [
        {name: 'Modelli Certificati', link: '/certificati-qualita/certificato/'},
      ]},
  ];
  return items
} 