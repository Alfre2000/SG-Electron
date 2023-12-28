import React from "react";
import { Pagination } from "react-bootstrap";

function Paginator({ data, setPage }) {
  const currentPage = data?.next
    ? parseInt(
        data.next
          .split("page=")
          [data.next.split("page=").length - 1].split("&")[0]
      ) - 1
    : data?.previous?.includes("page=")
    ? parseInt(
        data.previous
          .split("page=")
          [data.previous.split("page=").length - 1].split("&")[0]
      ) + 1
    : data?.results?.length === data?.count
    ? 1
    : 2;
  const totalPages = data
    ? data.next
      ? Math.ceil(data.count / data.results.length)
      : currentPage
    : "";
  console.log(data);
  return (
    <Pagination className="flex justify-between">
      <div className="flex min-w-[150px]">
        {data?.previous && (
          <>
            <Pagination.First
              className="paginator-first"
              onClick={() => setPage(1)}
            />
            <Pagination.Prev
              className="paginator-back"
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
              onClick={() => setPage(currentPage + 1)}
            >
              Successiva
            </Pagination.Next>
            <Pagination.Last
              className="paginator-last"
              onClick={() => setPage(totalPages)}
            />
          </>
        )}
      </div>
    </Pagination>
  );
}

export default Paginator;
