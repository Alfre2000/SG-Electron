import React from "react";
import SearchSelect, { Option } from "./SearchSelect";
import { searchOptions } from "utils";
import useImpiantoQuery from "@hooks/useImpiantoQuery/useImpiantoQuery";
import { URLS } from "urls";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@components/shadcn/Dialog";
import { Label } from "@components/shadcn/Label";
import { Input } from "@components/shadcn/Input";
import { Button } from "@components/shadcn/Button";
import { apiGet } from "@api/api";
import { Alert } from "@components/shadcn/Alert";

function OperatoreInput() {
  const operatoriQuery = useImpiantoQuery({ queryKey: URLS.OPERATORI });
  const [operatore, setOperatore] = React.useState<Option | null>(null);
  const [codice, setCodice] = React.useState("");
  const [error, setError] = React.useState("");

  const checkPassword = React.useCallback(() => {
    apiGet(URLS.OPERATORI + operatore?.value + "/").then((res) => {
      if (res.codice === codice) {
        onClose();
      } else {
        setError("Codice errato !");
        setTimeout(() => setError(""), 1000 * 5); // 5 seconds
      }
    });
  }, [operatore, codice]);
  const onClose = () => {
    setOperatore(null);
    setError("");
    setCodice("");
  };

  React.useEffect(() => {
    const enterClick = (e: KeyboardEvent) => {
      if (e.key === "Enter" && operatore !== null) {
        e.preventDefault();
        checkPassword();
      }
    };
    document.addEventListener("keydown", enterClick);
    return () => {
      document.removeEventListener("keydown", enterClick);
    };
  }, [operatore, checkPassword]);
  return (
    <>
      <SearchSelect
        name="operatore"
        options={searchOptions(operatoriQuery.data, "nome")}
        label={false}
        onChange={(option) => setOperatore(option)}
      />
      <Dialog open={!!operatore} onOpenChange={onClose}>
        <DialogContent className="w-md">
          <DialogHeader>
            <DialogTitle>Inserire il codice operatore</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Operatore</Label>
              <Input
                id="name"
                value={operatore?.label}
                disabled
                className="text-foreground opacity-100 bg-slate-100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="codice">Codice</Label>
              <Input
                id="codice"
                type="password"
                autoFocus
                value={codice}
                onChange={(e) => setCodice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="justify-beween">
            {error ? (
              <Alert
                variant="destructive"
                className="my-auto mr-auto py-1.5 text-sm bg-red-600/80 w-40 text-white"
              >
                {error}
              </Alert>
            ) : (
              <div></div>
            )}
            <Button onClick={checkPassword}>Conferma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OperatoreInput;
