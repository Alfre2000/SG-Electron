import React from "react";
import { Pagination } from "react-bootstrap";
import { apiGet } from "../../api/utils";
import { updateQueryStringParameter } from "../../utils";

function Paginator({ data, setData }) {
  const currentPage = data?.next
    ? parseInt(data.next.split("page=").at(-1).split('&')[0]) - 1
    : data?.previous.includes('page=')
    ? parseInt(data.previous.split("page=").at(-1).split('&')[0]) + 1
    : 1;
  const totalPages = data
    ? data.next
      ? Math.ceil(data.count / data.results.length)
      : currentPage
    : "";
  const baseURL = data?.next || data?.previous || ""
  const firstPageURL = updateQueryStringParameter(baseURL, 'page', '1');
  const lastPageURL = updateQueryStringParameter(baseURL, 'page', 'last');
  const updateData = (pageLink) => {
    apiGet(pageLink).then((res) => setData(res));
  };
  return (
    <Pagination className="flex justify-between">
      <div className="flex min-w-[150px]">
        {data?.previous && (
          <>
            <Pagination.First onClick={() => updateData(firstPageURL)} />
            <Pagination.Prev onClick={() => updateData(data.previous)}>
              Precedente
            </Pagination.Prev>
          </>
        )}
      </div>
      <div>
        Pagina {currentPage} di {totalPages}
      </div>
      <div className="flex min-w-[150px]">
        {data?.next && (
          <>
            <Pagination.Next onClick={() => updateData(data.next)}>
              Successiva
            </Pagination.Next>
            <Pagination.Last onClick={() => updateData(lastPageURL)} />
          </>
        )}
      </div>
    </Pagination>
  );
}

export default Paginator;
