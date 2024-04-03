import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Versione } from "@interfaces/global";
import Wrapper from "@ui/wrapper/Wrapper";
import { capitalize } from "@utils/main";
import React from "react";
import { useQuery } from "react-query";
import { URLS } from "urls";

function VersioniProgramma() {
  const versioniQuery = useQuery<Versione[]>(URLS.VERSIONI);
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full relative">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Versioni Applicazione</h2>
        </div>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        {versioniQuery.isLoading && <Loading />}
        {versioniQuery.isError && <Error />}
        {versioniQuery.isSuccess && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Computer</TableHead>
                <TableHead>Versione</TableHead>
                <TableHead className="text-center">Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versioniQuery.data
                .sort((a, b) => a.username.localeCompare(b.username))
                .map((utente, index) => (
                  <TableRow key={index}>
                    <TableCell>{capitalize(utente.username)}</TableCell>
                    <TableCell>{utente.versione}</TableCell>
                    <TableCell className="text-center">
                      {utente.versione === process.env.REACT_APP_VERSION ? (
                        <FontAwesomeIcon icon={faCheck} className="text-green-700 text-lg" />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} className="text-red-700 text-lg" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Wrapper>
  );
}

export default VersioniProgramma;
