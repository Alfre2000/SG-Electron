import { apiUpdate } from "@api/apiV2";
import { Documento } from "@interfaces/global";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "sonner";
import { URLS } from "urls";

type InputNomeProps = {
  documento: Documento;
};

function InputNome({ documento }: InputNomeProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(documento.nome);

  const handleBlur = () => {
    setIsEditing(false);
    if (editedText === documento.nome) {
      return;
    }
    apiUpdate(`${URLS.DOCUMENTI}${documento.id}/`, { nome: editedText })
      .then(() => {
        queryClient.setQueryData<Documento[] | undefined>(URLS.DOCUMENTI, (oldData) => {
          return oldData?.map((doc) => {
            if (doc.id === documento.id) {
              return { ...doc, nome: editedText };
            }
            return doc;
          });
        });
        toast.success("Nome del file modificato");
      })
      .catch(() => {
        toast.error("Si è verificato un errore");
        setEditedText(documento.nome);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value);
  };

  return (
    <div className="flex-grow h-[22px]">
      {isEditing ? (
        <input
          className="border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 transition-colors bg-muted/50 w-full"
          type="text"
          value={editedText}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={(e) => e.key === "Enter" && handleBlur()}
          autoFocus
        />
      ) : (
        <div className="truncate" onClick={() => setIsEditing(true)}>
          {editedText}
        </div>
      )}
    </div>
  );
}

export default InputNome;
