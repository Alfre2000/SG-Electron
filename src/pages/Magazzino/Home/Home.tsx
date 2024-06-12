import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign } from "@fortawesome/free-solid-svg-icons";
import InSospeso from "./in-sospeso";
import InEsaurimento from "./in-esaurimento";
import UltimiMovimenti from "./ultimi-movimenti";


function Home() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Magazzino</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo ultimo mese</CardTitle>
            <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.000 €</div>
            <p className="text-xs text-muted-foreground">+ 3000 € rispetto al mese precedente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo ultimo mese</CardTitle>
            <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.000 €</div>
            <p className="text-xs text-muted-foreground">+ 3000 € rispetto al mese precedente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo ultimo mese</CardTitle>
            <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.000 €</div>
            <p className="text-xs text-muted-foreground">+ 3000 € rispetto al mese precedente</p>
          </CardContent>
        </Card> */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ordini in Sospeso</CardTitle>
            <CardDescription>
              Lista di ordini che sono stati effettuati, ma che non sono ancora stati consegnati.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InSospeso />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Prodotti in Esaurimento</CardTitle>
            <CardDescription>
              Lista di prodotti la cui scorta in magazzino / ordinata è inferiore alla scorta minima.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InEsaurimento />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ultimi Movimenti</CardTitle>
            <CardDescription>Lista degli ultimi movimenti effettuati in magazzino.</CardDescription>
          </CardHeader>
          <CardContent>
            <UltimiMovimenti />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
