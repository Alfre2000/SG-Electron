import useImpiantoQuery from "@hooks/useImpiantoQuery/useImpiantoQuery";
import React from "react";
import { URLS } from "urls";
import { isDateRecent } from "utils";
import { parseProssimeManutenzioni } from "../parsers";
import { capitalize } from "@utils/main";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useImpianto } from "@contexts/UserContext";
const { motion } = require("framer-motion");

const alert = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1 },
};
const alerts = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Allarmi() {
  const impianto = useImpianto();
  const schedaImpiantoQuery = useImpiantoQuery({ queryKey: URLS.ULTIMA_SCHEDA_IMPIANTO });
  const isSchedaImpiantoOld = schedaImpiantoQuery.data?.id && !isDateRecent(schedaImpiantoQuery.data.data, 8);

  const richiesteQuery = useImpiantoQuery({ queryKey: [URLS.RICHIESTE_CORREZIONE_BAGNO, { eseguita: "false" }] });
  const today = new Date().toISOString().split("T")[0];
  const missingBarre = useImpiantoQuery(
    { queryKey: [URLS.BARRE, { inizio: today, empty: true, finita: false }] },
    {
      select: (data) => data.results.filter((barra) => isDateRecent(barra.inizio, 3)),
      refetchInterval: 1000 * 60
    }
  );

  const avvisiQuery = useImpiantoQuery(
    { queryKey: URLS.PAGINA_PROSSIME },
    { select: parseProssimeManutenzioni, refetchInterval: 1000 * 60 * 5 } // 5 minutes
  );

  const isSuccessful = schedaImpiantoQuery.isSuccess && richiesteQuery.isSuccess && avvisiQuery.isSuccess;
  if (!isSuccessful) return null;

  const allarmi = [];
  if (isSchedaImpiantoOld) {
    allarmi.push({
      title: "Attenzione:",
      message: "Compilare la scheda dell'impianto !",
      link: "/manutenzione/record-scheda-impianto/",
    });
  }
  richiesteQuery.data?.results?.forEach((richiesta) => {
    allarmi.push({
      title: "Attenzione:",
      message: "Richiesta correzione bagno",
      link: `/manutenzione/richiesta-correzione-bagno/${richiesta.id}`,
    });
  });
  avvisiQuery.data?.late?.forEach((operazione) => {
    allarmi.push({
      title: `${capitalize(operazione.tipologia)} da effettuare:`,
      message: operazione.nome,
      link: operazione.link,
    });
  });
  const enabled = [2, 8].includes(impianto);
  if (enabled && missingBarre.data?.length > 0) {
    const single = missingBarre.data?.length === 1;
    allarmi.push({
      title: single ? "Barra mancante:" : "Barre mancanti:",
      message: (
        <span className="font-normal">
          Inserire il codice del foglio giallo per {single ? "la barra" : "le barre"}: <br />
          {missingBarre.data?.map((barra) => (
            <span key={barra.id} className="font-semibold">
              {barra.codice.split("-").at(-1)}{" "}
              {barra.articolo ? (
                <>
                  {" "}
                  <span className="mx-3">-</span>
                  {barra.articolo}{" "}
                </>
              ) : null}
              <span className="mx-3">-</span> Iniziata alle: {barra.inizio.split("T")[1].slice(0, 5)}
              <br />
            </span>
          ))}
        </span>
      ),
      link: "",
    });
  }
  return (
    <motion.div variants={alerts} initial="hidden" animate="show">
      {allarmi.map((allarme) => (
        <motion.div variants={alert} key={allarme.link}>
          <Alert variant="danger" className="py-2 mb-2 text-left pl-[7%] inline-flex items-center w-full">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-10"></FontAwesomeIcon>
            <div className="w-[30%]">{allarme.title}</div>
            <b className="pl-4 w-[55%] pr-2">{allarme.message}</b>
            {allarme.link === "" ? null : (
              <Link to={allarme.link}>
                <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
              </Link>
            )}
          </Alert>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Allarmi;
