import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { toast } from "sonner";
import { Button } from "@components/shadcn/Button";
import { useMutation, useQueryClient } from "react-query";
import { apiDelete } from "@api/apiV2";
import { WithID } from "@interfaces/global";

type DeleteProps<TData> = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  record: TData;
  endpoint: string;
  onSuccess?: (data?: TData[]) => void;
};

function Delete<TData extends WithID>({ isOpen, setIsOpen, record, endpoint, onSuccess }: DeleteProps<TData>) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(() => apiDelete(endpoint + record.id + "/"), {
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success("Record eliminato con successo!");
      queryClient.invalidateQueries(endpoint);
      if (onSuccess) onSuccess();
  },
    onError: () => {
      setIsOpen(false);
      toast.error("Errore durante l'eliminazione del record");
    },
  });
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="font-semibold text-xl">Sei sicuro di volerlo eliminare ?</DialogTitle>
            <DialogDescription>
              Questa azione non può essere annullata.
              <br /> Una volta eliminato il record non sarà più recuperabile.
            </DialogDescription>
          </DialogHeader>
          <hr />
          <DialogFooter>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()}>
              Elimina
            </Button>
            <DialogClose asChild>
              <Button>Annulla</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Delete;
