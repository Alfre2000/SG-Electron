import React from "react";
import ConfirmModal from "../../Modals/ConfirmModal/ConfirmModal";
import useImpiantoMutation from "../../../hooks/useImpiantoMutation/useImpiantoMutation";
import { apiDelete } from "../../../api/api";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { toast } from 'sonner';
import { usePageContext } from "../../../contexts/PageContext";

function Delete({ record, isOpen, setIsOpen, onDelete }) {
  const { queryKey, url, postURL, queriesToInvalidate } = usePageContext();
  const deleteURL = typeof postURL === "function" ? postURL(record) : postURL
  const recordsQuery = useCustomQuery({ queryKey: queryKey })
  const deleteMutation = useImpiantoMutation(() => apiDelete(deleteURL + record.id + '/'), {
    onSuccess: (response, _, { queryClient }) => {
      const records = recordsQuery.data.results.filter(r => r.id !== record.id)
      queryClient.invalidateQueries(url)
      queriesToInvalidate.forEach(query => queryClient.invalidateQueries(query))
      queryClient.setQueryData(queryKey, { ...recordsQuery.data, results: records })
      if(onDelete) onDelete(response, queryClient)
      toast.success("Record eliminato con successo!")
    }
  })
  return (
    <ConfirmModal
      show={isOpen}
      handleClose={(confirm) => {
        if (confirm) deleteMutation.mutate();
        setIsOpen(false);
      }}
    />
  );
}

export default Delete;
