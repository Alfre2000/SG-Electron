import React from "react";
import Warning from "../../images/warning.png";

function Error() {
  return (
    <div className="m-auto">
      <img src={Warning} alt="Warning" className="h-16 mx-auto" />
      <p className="text-sm text-red-900 mt-2">
        Si è verificato un errore di connessione.
      </p>
    </div>
  );
}

export default Error;
