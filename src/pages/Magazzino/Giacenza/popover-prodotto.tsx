import { UtilizzoProdotto } from "@interfaces/global";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { capitalize } from "utils";

const PopoverProdotto = ({ prodottoId }: { prodottoId: number }) => {
  const prodottoQuery = useQuery<UtilizzoProdotto>(URLS.UTILIZZO_PRODOTTO + prodottoId);
  if (!prodottoQuery.isSuccess) return null;
  const prodotto = prodottoQuery.data;
  const color =
    prodotto.scorta_magazzino + prodotto.scorta_ordinata < prodotto.scorta_minima ? "text-red-500" : "";
  const scorta_minima = prodotto.scorta_minima / prodotto.dimensioni_unitarie;
  const scorta_magazzino = prodotto.scorta_magazzino / prodotto.dimensioni_unitarie;
  const scorta_ordinata = prodotto.scorta_ordinata / prodotto.dimensioni_unitarie;
  const dimensioni =
    prodotto.unità_misura !== "pz" ? `da ${prodotto.dimensioni_unitarie} ${prodotto.unità_misura}` : "";
  const utilizzo_ultimo_mese = (prodotto.utilizzo_ultimo_mese / prodotto.dimensioni_unitarie).toFixed(1);
  const utilizzo_ultimo_trimestre = (prodotto.utilizzo_ultimo_trimestre / prodotto.dimensioni_unitarie).toFixed(1);
  const utilizzo_ultimo_anno = (prodotto.utilizzo_ultimo_anno / prodotto.dimensioni_unitarie).toFixed(1);
  return (
    <div>
      <span className="font-medium">{prodotto.nome}</span>
      <div className="flex justify-between items-center">
        <p className="text-muted text-sm">Descrizione: {prodotto.descrizione}</p>
        <p className="text-muted text-sm min-w-24 text-right">
          {prodotto.nome_unità} {dimensioni}
        </p>
      </div>
      <hr className="mb-3 mt-2" />
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-3 gap-2">
          <span className="col-span-2">Scorta minima:</span>
          <span className="text-center font-semibold">{scorta_minima}</span>
          <span className="col-span-2">Scorta magazzino:</span>
          <span className={`text-center font-semibold ${color}`}>{scorta_magazzino}</span>
          <span className="col-span-2">Scorta ordinata:</span>
          <span className="text-center font-semibold">{scorta_ordinata}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="col-span-2">Utilizzo ultimo mese:</span>
          <span className="text-center font-semibold">{utilizzo_ultimo_mese}</span>
          <span className="col-span-2">Utilizzo ultimo trimestre:</span>
          <span className="text-center font-semibold">{utilizzo_ultimo_trimestre}</span>
          <span className="col-span-2">Utilizzo ultimo anno:</span>
          <span className="text-center font-semibold">{utilizzo_ultimo_anno}</span>
        </div>
      </div>
      <hr className="mb-3 mt-2" />
      <div className="grid grid-cols-3 gap-2">
        <span>Utilizzato su:</span>
        <ul className="text-left col-span-2 font-semibold text-sm ml-11">
          {prodotto.impianti.map((impianto) => (
            <li key={impianto} className="list-disc">
              {impianto}
            </li>
          ))}
        </ul>
        {prodotto.dpi && prodotto.dpi.length > 0 && (
          <>
            <span>Dispositivi di Protezione Individuale:</span>
            <ul className="text-left col-span-2 font-semibold text-sm ml-11">
              {prodotto.dpi.map((dpi) => (
                <li key={dpi} className="list-disc">
                  {capitalize(dpi)}
                </li>
              ))}
            </ul>
          </>
        )}
        <span>Posizione magazzino:</span>
        <span className="col-span-2 font-semibold text-sm ml-8 relative top-0.5">
          {capitalize(prodotto.luogo)}
        </span>
      </div>
      <hr className="mb-3 mt-2" />
      <div className="grid grid-cols-3 gap-2">
        {prodotto.aspetto && (
          <>
            <span>Aspetto:</span>
            <span className="col-span-2 font-semibold text-sm ml-8">{capitalize(prodotto.aspetto)}</span>
          </>
        )}
        {prodotto.colore && (
          <>
            <span>Colore:</span>
            <span className="col-span-2 font-semibold text-sm ml-8">{capitalize(prodotto.colore)}</span>
          </>
        )}
        {prodotto.note && (
          <>
            <span>Note:</span>
            <span className="col-span-2 font-semibold text-sm ml-8">{capitalize(prodotto.note)}</span>
          </>
        )}
        {prodotto.densità_minima || prodotto.densità_massima ? (
          <>
            <span>Densità:</span>
            <span className="col-span-2 font-semibold text-sm ml-8">
              {!prodotto.densità_massima && (
                <>
                  &gt; {prodotto.densità_minima} gm/cm<sup>3</sup>
                </>
              )}
              {!prodotto.densità_minima && (
                <>
                  &lt; {prodotto.densità_massima} gm/cm<sup>3</sup>
                </>
              )}
              {prodotto.densità_minima && prodotto.densità_massima && (
                <>
                  {prodotto.densità_minima} - {prodotto.densità_massima} gm/cm<sup>3</sup>
                </>
              )}
            </span>
          </>
        ) : null}
        {prodotto.ph_minimo || prodotto.ph_massimo ? (
          <>
            <span>Ph:</span>
            <span className="col-span-2 font-semibold text-sm ml-8">
              {!prodotto.ph_massimo && (
                <>
                  &gt; {prodotto.ph_minimo}
                </>
              )}
              {!prodotto.ph_minimo && (
                <>
                  &lt; {prodotto.ph_massimo}
                </>
              )}
              {prodotto.ph_minimo && prodotto.ph_massimo && (
                <>
                  {prodotto.ph_minimo} - {prodotto.ph_massimo}
                </>
              )}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PopoverProdotto;
