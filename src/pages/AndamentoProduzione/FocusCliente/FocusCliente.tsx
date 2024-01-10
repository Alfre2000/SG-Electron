import React from "react";
import Wrapper from "../Wrapper";
import { useQuery } from "react-query";
import { Clienti } from "../../../interfaces/global";
import { URLS } from "../../../urls";
import Error from "../../../components/Error/Error";
import Loading from "../../../components/Loading/Loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/shadcn/Card";

function FocusCliente() {
  const clientiQuery = useQuery<Clienti>({ queryKey: [URLS.CLIENTI] });
  console.log(clientiQuery.data);
  return (
    <Wrapper>
      <div className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-8">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
          Seleziona il cliente da analizzare
        </h2>
        {clientiQuery.isError && <Error />}
        {clientiQuery.isLoading && <Loading className="m-auto" />}
        {clientiQuery.isSuccess && (
          <div className="flex flex-col gap-4">
            {clientiQuery.data.map((cliente) => (
              <Card>
                <CardHeader>
                  <CardTitle>{cliente.nome}</CardTitle>
                  <CardDescription>You have 3 unread messages.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4"></CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default FocusCliente;
