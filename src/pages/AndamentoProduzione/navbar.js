import { faChartLine, faEuroSign } from "@fortawesome/free-solid-svg-icons";

export const getNavItems = (user) => {
  let items = [
    {
      title: "Dashboards",
      icon: faChartLine,
      links: [
        { name: "Dashboards", link: "/andamento-produzione/dashboards/" },
      ],
    },
    {
      title: "Dashboard Ricavi",
      icon: faEuroSign,
      links: [
        { name: "Dashboard Ricavi", link: "/andamento-produzione/dashboard-ricavi/" },
      ],
    },
  ];
  return items;
};
