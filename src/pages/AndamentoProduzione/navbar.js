import { faChartLine, faMapLocationDot, faUserTie } from "@fortawesome/free-solid-svg-icons";

export const getNavItems = (user) => {
  let items = [
    {
      title: "Focus Cliente",
      icon: faUserTie,
      links: [{ name: "Focus Cliente", link: "/andamento-produzione/focus-cliente/" }],
    },
    {
      title: "Dashboards",
      icon: faChartLine,
      links: [{ name: "Dashboards", link: "/andamento-produzione/dashboards/" }],
    },
    {
      title: "Mappa Clienti",
      icon: faMapLocationDot,
      links: [{ name: "Mappa Clienti", link: "/andamento-produzione/mappa-clienti/" }],
    },
  ];
  return items;
};
