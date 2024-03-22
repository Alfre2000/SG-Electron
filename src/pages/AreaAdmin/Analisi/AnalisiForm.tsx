import { searchOptions } from "../../../utils";
import { URLS } from "../../../urls";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { Analisi } from "@interfaces/global";
import Form from "@components/form/Form";
import { z } from "@ui/../it-zod";
import Input from "@components/form/Input";
import Hidden from "@components/form/Hidden";
import SearchSelect from "@components/form/SearchSelect";
import TabellaNestedItems from "@components/form/TabellaNestedItems";
import Fieldset from "@components/form/Fieldset";

const schema = z.object({
  nome: z.string().min(1),
  intervallo_pezzi: z
    .union([z.string().refine((s) => parseInt(s)), z.number()])
    .nullable()
    .optional(),
  intervallo_giorni: z
    .union([z.string().refine((s) => parseInt(s)), z.number()])
    .nullable()
    .optional(),
  attiva: z.union([z.string().refine((x) => x === "true" || x === "false"), z.boolean()]),
  impianto: z.number(),
  parametri: z.array(
    z.object({
      nome: z.string().min(1),
      minimo: z.union([z.string().refine((s) => parseInt(s)), z.number()]),
      ottimo: z.union([z.string().refine((s) => parseInt(s)), z.number()]),
      massimo: z.union([z.string().refine((s) => parseInt(s)), z.number()]),
    })
  ),
});

type AnalisiFormProps = {
  initialData?: Analisi;
  disabled?: boolean;
};

function AnalisiForm({ initialData, disabled = false }: AnalisiFormProps) {
  const impiantiQuery = useCustomQuery({ queryKey: URLS.IMPIANTI });
  return (
    <Form initialData={initialData} endpoint={URLS.ANALISI} schema={schema} disabled={disabled}>
      <div className="grid grid-cols-2 divide-x-2 divide-gray-500 pt-3 pb-4">
        <div className="space-y-4 my-auto mr-14">
          <Input name="nome" />
          <SearchSelect name="impianto" options={searchOptions(impiantiQuery.data, "nome")} />
        </div>
        <div className="space-y-4 pl-10">
          <Input name="intervallo_pezzi" type="number" />
          <Input name="intervallo_giorni" type="number" />
        </div>
        <Hidden name="attiva" value={true} />
      </div>
      <Fieldset title="Parametri">
        <TabellaNestedItems
          name="parametri"
          colonne={[
            { name: "nome" },
            { name: "minimo", type: "number" },
            { name: "ottimo", type: "number" },
            { name: "massimo", type: "number" },
          ]}
        />
      </Fieldset>
    </Form>
  );
}

export default AnalisiForm;
