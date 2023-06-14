import { faChartLine } from "@fortawesome/free-solid-svg-icons";

export const getNavItems = (user) => {
  let items = [
    {
      title: "Dashboards",
      icon: faChartLine,
      links: [
        { name: "Dashboards", link: "/andamento-produzione/dashboards/" },
      ],
    },
  ];
  return items;
};
