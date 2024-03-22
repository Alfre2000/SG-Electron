import Input from "@components/form/Input";
import Form from "@components/form/Form";
import { URLS } from "urls";
import { z } from "@ui/../it-zod";
import { Cliente } from "@interfaces/global";

const schema = z.object({
  nome: z.string().min(1),
  piva: z.union([
    z
      .string()
      .regex(/^\d{11}$/, { message: "Partita IVA non valida" })
      .optional(),
    z.string().nullable(),
  ]),
  indirizzo: z.string().optional().nullable(),
  cap: z.string().optional().nullable(),
  città: z.string().optional().nullable(),
});

type ClienteFormProps = {
  initialData?: Cliente;
  disabled?: boolean;
};

function ClienteForm({ initialData, disabled = false }: ClienteFormProps) {
  return (
    <Form initialData={initialData} endpoint={URLS.CLIENTI} schema={schema} disabled={disabled}>
      <div className="grid grid-cols-2 divide-x-2 divide-gray-500 pt-3">
        <div className="space-y-4 my-auto mr-14">
          <Input name="nome" />
          <Input name="piva" label="Partita IVA:" />
        </div>
        <div className="space-y-4 pl-10">
          <Input name="indirizzo" />
          <Input name="cap" />
          <Input name="città" />
        </div>
      </div>
    </Form>
  );
}

export default ClienteForm;
