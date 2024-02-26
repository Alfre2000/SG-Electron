import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { URLS } from "urls";
import { useQuery } from "react-query";
import Wrapper from "../Wrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/shadcn/Card";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Icon } from "leaflet";

function MappaClienti() {
  const fatturatoQuery = useQuery(URLS.CLIENTI_MAPPA);
  const clientiQuery = useQuery(URLS.CLIENTI);

  const milanPosition = [45.4642, 9.19];
  const superPosition = [45.5401604, 9.169639];

  const zoomLevel = 6;
  return (
    <Wrapper>
      <div className="my-8 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-8 min-w-96 w-full">
        <h2 className="text-left scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
          Mappa Clienti
        </h2>
        <hr className="mb-2 text-gray-800 w-64 mr-auto relative -top-3" />
        <Card className="min-h-[70vh]">
          <CardHeader>
            <CardTitle>Mappa dei Clienti</CardTitle>
            <CardDescription>
              Naviga la mappa e clicca sui marcatori per leggere informazioni aggiuntive sul cliente selezionato.
              <br />
              Vegnono mostrati solo i clienti con un fatturato negli ultimi 12 mesi maggiore di 500 €.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientiQuery.isError && <Error />}
            {clientiQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {clientiQuery.isSuccess && fatturatoQuery.isSuccess && (
              <MapContainer
                center={milanPosition}
                zoom={zoomLevel}
                style={{ height: "55vh", width: "100%", border: "1px solid #d3dae6", borderRadius: "10px" }}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                {clientiQuery.data
                  .filter((cl) => cl.latitudine && cl.longitudine)
                  .filter((cl) => fatturatoQuery.data.find((f) => f.articolo__cliente === cl.id))
                  .map((cliente) => (
                    <Marker
                      key={cliente.id}
                      position={[cliente.latitudine, cliente.longitudine]}
                      icon={
                        new Icon({
                          iconUrl:
                            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                        })
                      }
                    >
                      <Popup>
                        <PopupCliente
                          cliente={cliente}
                          fatturato={fatturatoQuery.data.find((f) => f.articolo__cliente === cliente.id).fatturato}
                        />
                      </Popup>
                    </Marker>
                  ))}
                <Marker
                  position={superPosition}
                  icon={
                    new Icon({
                      iconUrl:
                        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                    })
                  }
                >
                  <Popup>
                    <span className="text-[#013691] font-semibold">SuperGalvanica</span>
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

export default MappaClienti;

const PopupCliente = ({ cliente, fatturato }) => {
  const fatturatoStyled = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(fatturato);
  return (
    <div className="w-64">
      <div>
        <h3 className="text-[#013691] font-semibold">{cliente.nome}</h3>
        <i className="text-xs mt-1">
          {cliente.indirizzo}, {cliente.città}
        </i>
        <p>
          Fatturato ultimi 12 mesi: <span className="font-semibold">{fatturatoStyled}</span>
        </p>
      </div>
    </div>
  );
};
