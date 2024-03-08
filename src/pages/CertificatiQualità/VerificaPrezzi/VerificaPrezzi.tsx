import React from "react";
import Wrapper from "../Wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/shadcn/Card";
import { Input } from "@components/shadcn/Input";
import { Button } from "@components/shadcn/Button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { getDatiBollaMago, getDatiEtichettaMago, getEntireLottoInformation } from "@api/mago";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/shadcn/Table";

function VerificaPrezzi() {
  const [nLotto, setNLotto] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [lotto, setLotto] = React.useState();
  const [cliente, setCliente] = React.useState();
  const prezziQuery = useQuery(URLS.INFO_PREZZI + cliente + "/", { enabled: !!cliente });

  const lottoQuery = useQuery(["mago_lotto", search], () => getEntireLottoInformation(search), { enabled: false });
  // console.log(prezziQuery.data);
  console.log(lottoQuery.data);

  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full mb-20">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Verifica Prezzi</h2>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <Card className="mb-4 max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex justify-between items-center relative">
              Ricerca Lotto SuperGalvanica
              <MagnifyingGlassIcon className="w-6 h-6 absolute right-0" />
            </CardTitle>
            <CardDescription>Inserisci il numero del lotto per verificare i prezzi dell'ordine.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-x-4">
            <Input placeholder="N° lotto" value={nLotto} onChange={(e) => setNLotto(e.target.value)} />
            <Button
              onClick={() => {
                setSearch(nLotto);
                lottoQuery.refetch();
              }}
            >
              Cerca
            </Button>
          </CardContent>
        </Card>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Articolo</TableHead>
              <TableHead>Prezzo Unitario</TableHead>
              <TableHead>Quantità</TableHead>
              <TableHead>Totale</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </div>
    </Wrapper>
  );
}

export default VerificaPrezzi;
