import React from "react";

function Hidden(props) {
  return (
    <input hidden className="hidden" data-testid="input-hidden" {...props} />
  );
}

export default Hidden;
