import React from "react";
import { Card, Table } from "react-bootstrap";
import { URLS } from "../../../../../urls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "react-query";
import Error from "../../../../../components/Error/Error";
import Loading from "../../../../../components/Loading/Loading";

function LastSchedaImpianto() {
  const query = useQuery({ queryKey: URLS.LAST_SCHEDE_IMPIANTO });
  return (
    <Card className="text-center min-h-[400px]">
      <Card.Header>Schede Impianto</Card.Header>
      <Card.Body className="flex">
        {query.isError && <Error />}
        {query.isLoading && <Loading className="m-auto" />}
        {query.isSuccess && (
          <Table className="align-middle">
            <thead>
              <tr>
                <th>Impianto</th>
                <th>Ultima Scheda</th>
                <th>Alert</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.schede_impianto?.map((impianto) => (
                <tr key={impianto.nome}>
                  <td>{impianto.nome}</td>
                  <td>{impianto.last_scheda_text}</td>
                  <td>
                    {impianto.last_scheda > 48 && (
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="text-red-800"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default LastSchedaImpianto;
