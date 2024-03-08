import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/shadcn/Card";
import { Label } from "../../../../components/shadcn/Label";
import { Input } from "../../../../components/shadcn/Input";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { URLS } from "../../../../urls";
import Loading from "../../../../components/Loading/Loading";
import Error from "../../../../components/Error/Error";
import { Separator } from "../../../../components/shadcn/Separator";
import { Textarea } from "../../../../components/shadcn/Textarea";
import { Button } from "../../../../components/shadcn/Button";
import { Form, FormField, FormControl } from "../../../../components/shadcn/Form";
import { apiUpdate } from "../../../../api/apiV2";
import { getErrors } from "../../../../api/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const apiKey = localStorage.getItem("GoogleMapsAPIKey");
const prod = process.env.NODE_ENV === "production";
// const prod = true;

const formDefaults = (data) => {
  if (!data) return {};
  const contatti = data.contatti;
  const qualità = contatti.find((c) => c.ruolo === "Responsabile Qualità") || {};
  const commerciale = contatti.find((c) => c.ruolo === "Responsabile Commerciale") || {};
  const dirigente = contatti.find((c) => c.ruolo === "Dirigente") || {};
  return {
    note: data.note,
    qualità__nome: qualità.nome,
    qualità__telefono: qualità.telefono,
    qualità__email: qualità.email,
    qualità__note: qualità.note,
    commerciale__nome: commerciale.nome,
    commerciale__telefono: commerciale.telefono,
    commerciale__email: commerciale.email,
    commerciale__note: commerciale.note,
    dirigente__nome: dirigente.nome,
    dirigente__telefono: dirigente.telefono,
    dirigente__email: dirigente.email,
    dirigente__note: dirigente.note,
  };
};

function Anagrafica() {
  const { cliente } = useParams();
  const clienteQuery = useQuery([URLS.CLIENTI + cliente + "/"]);
  const location = { lat: clienteQuery.data?.latitudine, lng: clienteQuery.data?.longitudine };
  const form = useForm({ defaultValues: formDefaults(clienteQuery.data) });

  const updateMutation = useMutation((data) => apiUpdate(URLS.CLIENTI + cliente + "/anagrafica/", data), {
    onSuccess: () => {
      toast.success("Anagrafica aggiornata");
    },
    onError: (error) => {
      const errors = getErrors(error);
      console.log(errors);
      toast.error("Si è verificato un errore.");
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(updateMutation.mutate)}>
        <div className="grid gap-4 grid-cols-5 py-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Anagrafica {clienteQuery.data?.nome}</CardTitle>
              <CardDescription>Modificare i dati anagrafici direttamente da Mago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Nome</Label>
                <Input disabled value={clienteQuery.data?.nome} />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Partita IVA</Label>
                <Input disabled value={clienteQuery.data?.piva} />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Città</Label>
                <Input disabled value={clienteQuery.data?.città} />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Indirizzo</Label>
                <Input disabled value={clienteQuery.data?.indirizzo} />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>CAP</Label>
                <Input disabled value={clienteQuery.data?.cap} />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex">
                <CardTitle>Posizione</CardTitle>
                <div className="ml-auto text-sm font-semibold">
                  {(clienteQuery.data?.distanza_super / 1000).toFixed()} km di distanza
                </div>
              </div>
              <CardDescription>Visualizza la posizione del cliente su Google Maps</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[400px] pb-4">
              {!apiKey ? (
                <Error message="Google Maps API Key non impostata" />
              ) : !prod ? (
                <Error message="Google Maps non disponibile in development" />
              ) : !!location.lat && !!location.lng ? (
                <LoadScript googleMapsApiKey={apiKey}>
                  <GoogleMap center={location} zoom={12} mapContainerClassName="w-full h-full">
                    <Marker position={location} />
                  </GoogleMap>
                </LoadScript>
              ) : (
                <Loading className="m-auto top-36 relative" />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle>Contatti in {clienteQuery.data?.nome}</CardTitle>
              <CardDescription>
                Modifica e salva i dati relativi alle persone di riferimento per il cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-4">
              <Separator />
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-2">Responsabile Qualità</h4>
              <div className="flex justify-between gap-2 my-2">
                <FormField
                  control={form.control}
                  name="qualità__nome"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Nome e Cognome" {...field} />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualità__telefono"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Recapito Telefonico" {...field} />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualità__email"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="qualità__note"
                render={({ field }) => (
                  <FormControl>
                    <Textarea placeholder="Informazioni aggiuntive" className="mb-4" {...field} />
                  </FormControl>
                )}
              />
              <Separator />
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-2">Responsabile Commerciale</h4>
              <div className="flex justify-between gap-2 my-2">
                <FormField
                  control={form.control}
                  name="commerciale__nome"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Nome e Cognome" {...field} />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commerciale__telefono"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Recapito Telefonico" {...field} />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commerciale__email"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="commerciale__note"
                render={({ field }) => (
                  <FormControl>
                    <Textarea placeholder="Informazioni aggiuntive" className="mb-4" {...field} />
                  </FormControl>
                )}
              />
              <Separator />
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-2">Dirigente</h4>
              <div className="flex justify-between gap-2 my-2">
                <FormField
                  control={form.control}
                  name="dirigente__nome"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Nome e Cognome" {...field} />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dirigente__telefono"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Recapito Telefonico" {...field} />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dirigente__email"
                  render={({ field }) => (
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dirigente__note"
                render={({ field }) => (
                  <FormControl>
                    <Textarea placeholder="Informazioni aggiuntive" className="mb-4" {...field} />
                  </FormControl>
                )}
              />
              <Separator />
              <div className="flex justify-end">
                <Button className="mt-4" type="submit">
                  Salva
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle>Note</CardTitle>
              <CardDescription>Informazioni aggiuntive sul cliente</CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-4">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormControl>
                    <Textarea rows={5} placeholder="Informazioni aggiuntive" {...field} />
                  </FormControl>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="mt-4">
                  Salva
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}

export default Anagrafica;
