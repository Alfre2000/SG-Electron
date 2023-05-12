import Budget from "./images/budget.png";
import Inventory from "./images/inventory.png";
import WorkInProgress from "./images/work-in-progress.png";
import ToolBox from "./images/tool-box.png";
import Admin from "./images/admin.png";
import Certificate from "./images/certificate.png";

export const PROGRAMMI = {
    "Gestione Impianto": {name: 'Gestione Impianto', link: '/manutenzione/selezione-impianto/', icon: ToolBox},
    "Gestione Inventario": {name: 'Gestione Inventario', link: '#', icon: Inventory},
    "Gestione Preventivi": {name: 'Gestione Preventivi', link: '#', icon: Budget},
    "Programma 4": {name: 'Programma 4', link: '#', icon: WorkInProgress},
    "Programma 5": {name: 'Programma 5', link: '#', icon: WorkInProgress},
    "Programma 6": {name: 'Programma 6', link: '#', icon: WorkInProgress},
    "Area Admin": {name: 'Area Admin', link: '/area-admin/scheda-controllo/', icon: Admin},
    "Certificati Qualità": {name: 'Certificati Qualità', link: '/certificati-qualita/record-certificato/', icon: Certificate},
}