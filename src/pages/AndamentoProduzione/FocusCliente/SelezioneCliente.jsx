import Wrapper from "@ui/wrapper/Wrapper";
import { useQuery } from "react-query";
import { URLS } from "../../../urls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/shadcn/Card";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { searchOptions } from "../../../utils";
import { Button } from "../../../components/shadcn/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SelezioneCliente() {
  const navigate = useNavigate();
  const clientiQuery = useQuery({ queryKey: [URLS.CLIENTI] });
  const [cliente, setCliente] = useState();
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-8 min-w-96">
        <h2 className="text-center scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
          Focus Cliente
        </h2>
        <hr className="mb-2 text-gray-800 w-2/3 mx-auto relative -top-3" />
        <Card className="mt-10 w-[28rem]">
          <CardHeader>
            <CardTitle>Ricerca Cliente</CardTitle>
            <CardDescription>Seleziona il cliente da analizzare</CardDescription>
          </CardHeader>
          <CardContent>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
              Cliente
            </label>
            <SearchSelect
              options={searchOptions(clientiQuery.data, "nome")?.sort((a, b) => a.label.localeCompare(b.label))}
              label={false}
              inputProps={{ className: "text-left", value: cliente, onChange: (e) => setCliente(e) }}
            />
            <Button
              className="mt-8 disabled:cursor-not-allowed pointer-events-auto"
              disabled={!cliente}
              onClick={() => navigate(`/andamento-produzione/focus-cliente/${cliente.value}`)}
            >
              Analizza
            </Button>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

export default SelezioneCliente;
