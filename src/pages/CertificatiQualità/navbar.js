import { faCertificate, faDatabase, faFileCircleCheck, faListCheck, faTags } from "@fortawesome/free-solid-svg-icons";

export const getNavItems = (user) => {
  let items = [
    {
      title: "Certificati qualità",
      icon: faCertificate,
      links: [{ name: "Certificati Qualità", link: "/certificati-qualita/record-certificato/" }],
    },
    {
      title: "Verifica Prezzi",
      icon: faListCheck,
      links: [{ name: "Verifica Prezzi", link: "/certificati-qualita/verifica-prezzi/" }],
    },
    {
      title: "Etichette MTA",
      icon: faTags,
      links: [{ name: "Etichette MTA", link: "/certificati-qualita/etichette-mta/" }],
    },
    {
      title: "Database",
      icon: faDatabase,
      links: [{ name: "Database", link: "/certificati-qualita/database-certificati/" }],
    },
    {
      title: "Modelli Certificati",
      icon: faFileCircleCheck,
      links: [{ name: "Modelli Certificati", link: "/certificati-qualita/certificato/" }],
    },
  ];
  if (!user.is_staff) {
    items.pop(); // Remove Modelli Certificati
  }
  return items;
};
