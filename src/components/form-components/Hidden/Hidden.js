import React from "react";

const Hidden = React.forwardRef((props, ref) => {
  return (
    <input readOnly hidden className="hidden" data-testid="input-hidden" {...props} ref={ref} />
  );
})

export default Hidden;
