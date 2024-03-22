import { UserContextType, useUserContext } from "@contexts/UserContext";
import {
  faClipboardCheck,
  faFileInvoice,
  faGear,
  faUserGear,
  faUserTag,
  faWrench,
  faMapLocationDot,
  faUserTie,
  faToolbox,
  faChartLine,
  faClipboardList,
  faCertificate,
  faDatabase,
  faFileCircleCheck,
  faListCheck,
  faTags,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";

const navbarGestioneImpianto = (user: UserContextType["user"]["user"]) => {
  let items = [
    {
      title: "Scheda controllo",
      icon: faClipboardCheck,
      links: [
        { name: "Nuova scheda", link: "/manutenzione/record-lavorazione/" },
        { name: "Schede in sospeso", link: "/manutenzione/record-lavorazione-in-sospeso/" },
      ],
    },
    {
      title: "Scheda impianto",
      icon: faClipboardList,
      links: [{ name: "Nuova scheda", link: "/manutenzione/record-scheda-impianto/" }],
    },
    {
      title: "Manutenzioni",
      icon: faToolbox,
      links: [
        { name: "Fissaggio", link: "/manutenzione/fissaggio/" },
        { name: "Manutenzioni", link: "/manutenzione/manutenzioni/" },
        { name: "Analisi", link: "/manutenzione/analisi/" },
      ],
    },
    {
      title: "Informazioni",
      icon: faChartLine,
      links: [{ name: "Prossime Manutenzioni", link: "/manutenzione/prossime/" }],
    },
  ];
  // Se non è l'impianto Ossido, rimuovi le manutenzioni e aggiungi la scheda dell'ossido
  if (!user.impianto?.nome.toLowerCase().includes("ossido")) {
    items.splice(2, 1); // Remove Manutenzioni
    items[2].links.splice(0, 1); // Remove Prossime Manutenzioni
    items.pop(); // Remove Informazioni
  } else {
    items[0].links.splice(1, 1); // Remove Schede in sospeso
    items.splice(0, 0, {
      title: "Scheda valvole",
      icon: faClipboardCheck,
      links: [{ name: "Nuova scheda", link: "/manutenzione/record-lavorazione-ossido/" }],
    });
  }
  if (!user.impianto?.nome) {
    items = [];
  }
  return items;
};

const navbarCertificatiQualità = (user: UserContextType["user"]["user"]) => {
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

const navbarAndamentoProduzione = () => {
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
      title: "Impianti",
      icon: faIndustry,
      links: [{ name: "Impianti", link: "/andamento-produzione/impianti/" }],
    },
    {
      title: "Mappa Clienti",
      icon: faMapLocationDot,
      links: [{ name: "Mappa Clienti", link: "/andamento-produzione/mappa-clienti/" }],
    },
  ];
  return items;
};

const navbarAreaAdmin = () => {
  let items = [
    {
      title: "Scheda controllo",
      icon: faFileInvoice,
      links: [{ name: "Scheda controllo", link: "/area-admin/scheda-controllo/" }],
    },
    {
      title: "Articolo",
      icon: faGear,
      links: [{ name: "Articolo", link: "/area-admin/articolo/" }],
    },
    {
      title: "Analisi",
      icon: faClipboardCheck,
      links: [{ name: "Analisi", link: "/area-admin/analisi/" }],
    },
    {
      title: "Manutenzione",
      icon: faWrench,
      links: [{ name: "Manutenzione", link: "/area-admin/manutenzione/" }],
    },
    {
      title: "Cliente",
      icon: faUserTag,
      links: [{ name: "Cliente", link: "/area-admin/cliente/" }],
    },
    {
      title: "Operatore",
      icon: faUserGear,
      links: [{ name: "Operatore", link: "/area-admin/operatore/" }],
    },
  ];
  return items;
};

export const useGetNavItems = () => {
  const user = useUserContext();
  const currentUrl = window.location.hash
  let navFn;
  switch (currentUrl.split("/")[1]) {
    case "manutenzione":
      navFn = navbarGestioneImpianto;
      break;
    case "certificati-qualita":
      navFn = navbarCertificatiQualità;
      break;
    case "andamento-produzione":
      navFn = navbarAndamentoProduzione;
      break;
    case "area-admin":
      navFn = navbarAreaAdmin;
      break;
    default:
      navFn = () => [];
      break;
  }
  const items = navFn(user.user.user);
  return items;
};

export const useGetTitle = () => {
  const user = useUserContext();
  const currentUrl = window.location.hash
  switch (currentUrl.split("/")[1]) {
    case "manutenzione":
      return `Gestione ${user?.user?.user?.impianto?.nome || "Impianti"}`;;
    case "certificati-qualita":
      return "Certificati Qualità";
    case "andamento-produzione":
      return "Andamento Produzione";
    case "area-admin":
      return "Area Admin";
    default:
      return "";
  }
};
