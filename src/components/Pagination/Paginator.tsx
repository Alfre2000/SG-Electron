import { Pagination } from "react-bootstrap";
import { getCurrentPage, getTotalPages } from "./utils";

export type PaginationData = {
  next: string | null;
  previous: string | null;
  results: any[];
  count: number;
};

type PaginatorProps = {
  data?: PaginationData;
  setPage: (page: number) => void;
};

function Paginator({ data, setPage }: PaginatorProps) {
  const currentPage = getCurrentPage(data);
  const totalPages = getTotalPages(data);
  return (
    <Pagination className="flex justify-between">
      <div className="flex min-w-[150px]">
        {data?.previous && (
          <>
            <Pagination.First
              className="paginator-first"
              data-testid="paginator-first"
              onClick={() => setPage(1)}
            />
            <Pagination.Prev
              className="paginator-back"
              data-testid="paginator-prev"
              onClick={() => setPage(currentPage - 1)}
            >
              Precedente
            </Pagination.Prev>
          </>
        )}
      </div>
      <div className="m-auto">
        Pagina {currentPage} di {totalPages}
      </div>
      <div className="flex min-w-[150px]">
        {data?.next && (
          <>
            <Pagination.Next
              className="paginator-next"
              data-testid="paginator-next"
              onClick={() => setPage(currentPage + 1)}
            >
              Successiva
            </Pagination.Next>
            <Pagination.Last
              className="paginator-last"
              data-testid="paginator-last"
              onClick={() => setPage(totalPages)}
            />
          </>
        )}
      </div>
    </Pagination>
  );
}

export default Paginator;
