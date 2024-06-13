import React from "react";
import { Spinner } from "react-bootstrap";

type Props = {
  message: string;
};

function OverlayLoader({ message }: Props) {
  return (
    <div className="h-[100vh] w-[84%] fixed left-[240px] top-[57px] flex justify-center bg-slate-200 z-50 opacity-90">
      <div className="mt-[50vh] text-center">
        <h3 className="text-lg font-semibold">{message}</h3>
        <Spinner animation="border" role="status" className="mt-4" variant="secondary" />
      </div>
    </div>
  );
}

export default OverlayLoader;
