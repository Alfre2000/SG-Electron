import {
  faClipboardCheck,
  faClipboardList,
  faFileInvoice,
  faGear,
  faUserGear,
  faUserTag,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";

export const getNavItems = (user) => {
  let items = [
    {
      title: "Scheda controllo",
      icon: faFileInvoice,
      links: [
        { name: "Scheda controllo", link: "/area-admin/scheda-controllo/" },
      ],
    },
    {
      title: "Articolo",
      icon: faGear,
      links: [{ name: "Articolo", link: "/area-admin/articolo/" }],
    },
    {
      title: "Scheda impianto",
      icon: faClipboardList,
      links: [
        { name: "Scheda impianto", link: "/area-admin/scheda-impianto/" },
      ],
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
