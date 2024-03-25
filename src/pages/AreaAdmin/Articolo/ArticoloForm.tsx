import { searchOptions } from "../../../utils";
import { URLS } from "../../../urls";
import Form from "@components/form/Form";
import { z } from "@ui/../it-zod";
import Input from "@components/form/Input";
import Hidden from "@components/form/Hidden";
import { ArticoloCreate } from "@interfaces/global";
import { useQuery } from "react-query";
import SearchSelect from "@components/form/SearchSelect";
import Fieldset from "@components/form/Fieldset";
import TabellaNestedItems from "@components/form/TabellaNestedItems";

const schema = z.object({
  nome: z.string().min(1),
  codice: z.string().min(1),
  descrizione: z.string().optional().nullable(),
  cliente: z.string(),
  impianto: z.number(),
  scheda_controllo: z.string().optional().nullable(),
  richieste: z.array(
    z.object({
      lavorazione: z.string(),
      punto: z.number(),
      spessore_minimo: z.number().nullable().optional(),
      spessore_massimo: z.number().nullable().optional(),
    })
  ),
  specifica_it: z.string().optional().nullable(),
  specifica_en: z.string().optional().nullable(),
  traversino: z.number().optional().nullable(),
  pezzi_per_telaio: z.number().optional().nullable(),
  peso: z.number().optional().nullable(),
  superficie: z.number().optional().nullable(),
  immagini_supporto: z.array(
    z.object({
      titolo: z.string(),
      documento: z.string(),
    })
  ),
  documenti_supporto: z.array(
    z.object({
      titolo: z.string(),
      documento: z.string(),
    })
  ),
});

type ArticoloFormProps = {
  initialData?: ArticoloCreate;
  disabled?: boolean;
  campoScheda?: boolean;
};

function ArticoloForm({ initialData, disabled = false, campoScheda = true }: ArticoloFormProps) {
  const impiantiQuery = useQuery({ queryKey: URLS.IMPIANTI });
  const clienteQuery = useQuery({ queryKey: URLS.CLIENTI });
  const schedeControlloQuery = useQuery({ queryKey: URLS.SCHEDE_CONTROLLO });
  const lavorazioniQuery = useQuery({ queryKey: URLS.LAVORAZIONI });
  const traversiniQuery = useQuery({ queryKey: URLS.TRAVERSINI });
  return (
    <Form initialData={initialData} endpoint={URLS.ARTICOLI} schema={schema} disabled={disabled}>
      <div className="grid grid-cols-2 divide-x-2 divide-gray-500 pt-3">
        <div className="space-y-3 my-auto mr-14">
          <Input name="nome" />
          <Input name="codice" />
          <Input name="descrizione" />
        </div>
        <div className="space-y-3 pl-10">
          <SearchSelect inputColumns={7} name="cliente" options={searchOptions(clienteQuery.data, "nome")} />
          <SearchSelect inputColumns={7} name="impianto" options={searchOptions(impiantiQuery.data, "nome")} />
          {campoScheda !== false && (
            <SearchSelect
              inputColumns={7}
              name="scheda_controllo"
              options={searchOptions(schedeControlloQuery.data, "nome")}
            />
          )}
        </div>
      </div>
      <Fieldset title="lavorazioni richieste" className="mt-4">
        <TabellaNestedItems
          name="richieste"
          // sortBy={["lavorazione", "punto"]}
          colonne={[
            { name: "lavorazione", type: "select", options: searchOptions(lavorazioniQuery.data, "nome") },
            { name: "punto", type: "number" },
            { name: "spessore_minimo", type: "number", label: "Spessore minimo (µm)" },
            { name: "spessore_massimo", type: "number", label: "Spessore massimo (µm)" },
          ]}
        />
      </Fieldset>
      <Fieldset title="Informazioni Certificato" className="mt-4 space-y-3">
        <Input name="specifica_it" label="Specifica IT:" inputColumns={10} />
        <Input name="specifica_en" label="Specifica EN:" inputColumns={10} />
        <div className="grid grid-cols-2 gap-x-20 mb-3">
          <SearchSelect
            inputColumns={8}
            name="traversino"
            options={searchOptions(traversiniQuery.data, "codice")}
            inputClassName="ml-3"
          />
          <Input inputColumns={7} name="pezzi_per_telaio" type="number" />
        </div>
      </Fieldset>
      <Fieldset title="Caratteristiche Fisiche" className="mt-4">
        <div className="flex justify-evenly items-center mb-3">
          <Input name="peso" label="Peso (kg):" type="number" />
          <Input name="superficie" label="Superficie (dm²):" inputColumns={6} type="number" />
        </div>
      </Fieldset>
      <Fieldset title="Immagini di Supporto" className="mt-4">
        <TabellaNestedItems
          name="immagini_supporto"
          colonne={[{ name: "titolo" }, { name: "documento", type: "file" }]}
        />
      </Fieldset>
      <Fieldset title="Documenti di Supporto" className="mt-4">
        <TabellaNestedItems
          name="documenti_supporto"
          colonne={[{ name: "titolo" }, { name: "documento", type: "file" }]}
        />
      </Fieldset>
    </Form>
  );
}

export default ArticoloForm;
