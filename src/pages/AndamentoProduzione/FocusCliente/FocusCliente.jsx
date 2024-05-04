import { useParams } from "react-router-dom";
import Wrapper from "@ui/wrapper/Wrapper";
import { useQuery } from "react-query";
import { URLS } from "../../../urls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shadcn/Tabs";
import Panoramica from "./tabs/Panoramica";
import Anagrafica from "./tabs/Anagrafica";
import Prezzi from "./tabs/Prezzi";
import Magazzino from "./tabs/Magazzino/Magazzino";

function FocusCliente() {
  const { cliente } = useParams();
  const clienteQuery = useQuery([URLS.CLIENTI + cliente + "/"]);
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
          {clienteQuery.data?.nome}
        </h2>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <Tabs defaultValue="panoramica">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="panoramica">Panoramica</TabsTrigger>
              <TabsTrigger value="anagrafica">Anagrafica</TabsTrigger>
              <TabsTrigger value="magazzino">Magazzino</TabsTrigger>
              <TabsTrigger value="prezzi">Prezzi</TabsTrigger>
            </TabsList>
            <div id="tabs-side" className="w-40"></div>
          </div>
          <TabsContent value="panoramica" className="space-y-4 mt-4">
            <Panoramica />
          </TabsContent>
          <TabsContent value="anagrafica">
            <Anagrafica />
          </TabsContent>
          <TabsContent value="prezzi">
            <Prezzi />
          </TabsContent>
          <TabsContent value="magazzino">
            <Magazzino />
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
}

export default FocusCliente;
