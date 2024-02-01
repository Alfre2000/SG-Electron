import React from "react";
import Warning from "../../images/warning.png";

function Error({ message = "" }) {
  const errorMessage = message || "Si è verificato un errore di connessione.";
  return (
    <div className="h-full w-full flex flex-col items-center justify-center pb-10">
      <img src={Warning} alt="Warning" className="h-16 mx-auto" />
      <p className="text-sm text-red-900 mt-2">
        {errorMessage}
      </p>
    </div>
  );
}

export default Error;
