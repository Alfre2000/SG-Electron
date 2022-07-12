import React from "react";
// const electron = window?.require ? window.require("electron") : null;

function ImageModal({ setShow, url, titolo = "" }) {
  // const handleDownload = () => {
  //   electron.ipcRenderer.invoke("save-img", immagine.immagine);
  // };
  return (
    <div
      className="fixed z-10 pt-24 left-0 top-0 w-full h-full overflow-auto bg-[#000000e6]"
      onClick={() => setShow(false)}
    >
      <span className="my-modal-close">&times;</span>
      <img
        className="m-auto block w-4/5 max-w-2xl my-modal-content"
        src={url}
        alt={titolo}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="m-auto text-xl flex items-center justify-center w-4/5 max-w-2xl text-center text-[#ccc] py-3 h-20 my-caption">
        {titolo}
      </div>
    </div>
  );
}

export default ImageModal;
