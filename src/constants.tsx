import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEuro,
  faFlagCheckered,
  faIndustry,
  faRightToBracket,
  faTruckArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const MESI = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export const STATUS = [
  {
    value: "PL",
    label: "Ricezione",
    icon: <FontAwesomeIcon icon={faRightToBracket} />,
  },
  {
    value: "IL",
    label: "In Lavorazione",
    icon: <FontAwesomeIcon icon={faIndustry} />,
  },
  {
    value: "L",
    label: "Completato",
    icon: <FontAwesomeIcon icon={faFlagCheckered} />,
  },
  {
    value: "C",
    label: "Consegnato",
    icon: <FontAwesomeIcon icon={faTruckArrowRight} />,
  },
  {
    value: "F",
    label: "Fatturato",
    icon: <FontAwesomeIcon icon={faEuro} />,
  },
];
