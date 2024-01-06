import React, { useState } from "react";
import ConfirmModal from "../../Modals/ConfirmModal/ConfirmModal";
import useImpiantoMutation from "../../../hooks/useImpiantoMutation/useImpiantoMutation";
import { apiDelete } from "../../../api/api";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { toast } from "sonner";
import { usePageContext } from "../../../contexts/PageContext";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Record } from "../../../interfaces/global";

function Delete({ record }: { record: Record }) {
  const [isOpen, setIsOpen] = useState(false);

  const { queryKey, url, postURL, queriesToInvalidate } = usePageContext();
  const deleteURL = typeof postURL === "function" ? postURL(record) : postURL;
  const recordsQuery = useCustomQuery({ queryKey: queryKey });
  const deleteMutation = useImpiantoMutation(() => apiDelete(deleteURL + record.id + "/"), {
    onSuccess: (response: any, _: any, { queryClient }: any) => {
      console.log(response);
      const records = (recordsQuery.data as any).results.filter((r: any) => r.id !== record.id);
      queryClient.invalidateQueries(url);
      queriesToInvalidate.forEach((query: any) => queryClient.invalidateQueries(query));
      queryClient.setQueryData(queryKey, { ...(recordsQuery.data as any), results: records });
      toast.success("Record eliminato con successo!");
    },
  });
  return (
    <>
      <p
        className="hover:bg-gray-100 hover:rounded-b-md px-4 py-1.5 cursor-pointer text-sm"
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faTrash} size="sm" className="mr-3" />
        Elimina
      </p>
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmModal
          show={isOpen}
          handleClose={(confirm) => {
            if (confirm) deleteMutation.mutate();
            setIsOpen(false);
          }}
        />
      </div>
    </>
  );
}

export default Delete;
