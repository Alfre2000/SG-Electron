import Budget from "./images/budget.png";
import Inventory from "./images/inventory.png";
import WorkInProgress from "./images/work-in-progress.png";
import ToolBox from "./images/tool-box.png";
import Admin from "./images/admin.png";
import Certificate from "./images/certificate.png";
import Monitoring from "./images/monitoring.png";
import Database from "./images/database-storage.png";
import Chemistry from "./images/chemistry.png";
import Coding from "./images/coding.png";
import Warehouse from "./images/warehouse.png";
import { URLS } from "urls";

export const PROGRAMMI = {
    "Gestione Impianto": {name: 'Gestione Impianto', link: '/manutenzione/selezione-impianto/', icon: ToolBox},
    "Gestione Inventario": {name: 'Gestione Inventario', link: '#', icon: Inventory},
    "Gestione Preventivi": {name: 'Gestione Preventivi', link: '#', icon: Budget},
    "Magazzino": {name: 'Magazzino', link: '/magazzino/home/', icon: Warehouse},
    "Programma 5": {name: 'Programma 5', link: '#', icon: WorkInProgress},
    "Programma 6": {name: 'Programma 6', link: '#', icon: WorkInProgress},
    "Area Admin": {name: 'Area Admin', link: '/area-admin/scheda-controllo/', icon: Admin},
    "Certificati Qualità": {name: 'Certificati Qualità', link: '/certificati-qualita/record-certificato/', icon: Certificate},
    "Andamento Produzione": {name: 'Andamento Produzione', link: '/andamento-produzione/focus-cliente/', icon: Monitoring},
    "Database Documenti": {name: 'Database Documenti', link: '/documenti/visualizza/', icon: Database},
    "Correzione Bagni": {name: 'Correzione Bagni', link: '/correzione-bagni/gestisci-richieste/', icon: Chemistry, alertEndpoint: [URLS.RICHIESTE_CORREZIONE_BAGNO, {vecchie: true}]},
    "Developer": {name: 'Developer', link: '/developer/versioni-programma/', icon: Coding },
}

export type ProgrammiNames = keyof typeof PROGRAMMI;