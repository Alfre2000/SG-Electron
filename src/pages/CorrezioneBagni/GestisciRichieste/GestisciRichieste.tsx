import Wrapper from "@ui/wrapper/Wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import React from "react";


function GestisciRichieste() {
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full relative">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">
            Richieste Correzione Bagni
          </h2>
        </div>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <Card>
        <CardHeader>
          <CardTitle>Nuova richiesta</CardTitle>
          <CardDescription>Inserire le informazioni relative alla correzione del bagno necessaria.</CardDescription>

        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
      </div>
    </Wrapper>
  );
}

export default GestisciRichieste;
