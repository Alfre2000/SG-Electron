import { searchOptions } from "../../../utils";
import { URLS } from "../../../urls";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { Manutenzione } from "@interfaces/global";
import Form from "@components/form/Form";
import { z } from "@ui/../it-zod";
import Input from "@components/form/Input";
import Hidden from "@components/form/Hidden";
import SearchSelect from "@components/form/SearchSelect";

const schema = z.object({
  nome: z.string().min(1),
  intervallo_pezzi: z.union([z.string().refine((s) => parseInt(s)), z.number()]).nullable().optional(),
  intervallo_giorni: z.union([z.string().refine((s) => parseInt(s)), z.number()]).nullable().optional(),
  attiva: z.union([z.string().refine((x) => x === "true" || x === "false"), z.boolean()]),
  impianto: z.number()
});

type ManutenzioneFormProps = {
  initialData?: Manutenzione;
  disabled?: boolean;
};

function ManutenzioneForm({ initialData, disabled = false }: ManutenzioneFormProps) {
  const impiantiQuery = useCustomQuery({ queryKey: URLS.IMPIANTI });
  return (
    <Form initialData={initialData} endpoint={URLS.MANUTENZIONI} schema={schema} disabled={disabled}>
      <div className="grid grid-cols-2 divide-x-2 divide-gray-500 pt-3">
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
    </Form>
  );
}

export default ManutenzioneForm;
