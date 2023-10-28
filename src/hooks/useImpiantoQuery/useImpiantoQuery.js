import useCustomQuery from "../useCustomQuery/useCustomQuery";

function useImpiantoQuery(params, options = {}) {
    return useCustomQuery(params, options, true);
}

export default useImpiantoQuery;
