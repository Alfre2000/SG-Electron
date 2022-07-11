import React from "react";

function Hidden(props) {
  return (
    <input readOnly hidden className="hidden" data-testid="input-hidden" {...props} />
  );
}

export default Hidden;
