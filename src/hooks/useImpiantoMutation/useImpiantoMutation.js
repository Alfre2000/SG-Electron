import { useMutation, useQueryClient } from "react-query";
import { getErrors } from "../../api/utils";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

function useImpiantoMutation(mutationFn, options = {}) {
  const { onSuccess, onMutate, onError, ...restOptions } = options;

  const { user } = useContext(UserContext);
  const impianto = user?.user?.impianto?.id;
  const queryClient = useQueryClient()

  const defaultOnMutate = () => {
    return { queryClient, impianto }
  }
    
  const defaultOnSuccess = (data, [variables, _]) => {
    if (variables?.form) variables.form?.reset()
  } 

  return useMutation(mutationFn, {
    onMutate: (variables) => {
      let context = defaultOnMutate();
      if (onMutate) {
        context = {...context, ...onMutate(variables)}
      }
      return context;
    },
    onSuccess: (data, ...args) => {
      defaultOnSuccess(data, args);
      if (onSuccess) {
        onSuccess(data, ...args);
      }
    },
    onError: (data, ...args) => {
      const errors = getErrors(data);
      if (onError) {
        onError(errors, ...args);
      }
    },
    ...restOptions,
  })
}

export default useImpiantoMutation;
