import { faChartLine, faEuroSign, faUserTie } from "@fortawesome/free-solid-svg-icons";

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
      title: "Dashboard Ricavi",
      icon: faEuroSign,
      links: [{ name: "Dashboard Ricavi", link: "/andamento-produzione/dashboard-ricavi/" }],
    },
  ];
  return items;
};
