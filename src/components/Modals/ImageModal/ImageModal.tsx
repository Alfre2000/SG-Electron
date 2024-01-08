type ImageModalProps = {
  setShow: (show: boolean) => void;
  url: string;
  titolo?: string;
};

function ImageModal({ setShow, url, titolo = "" }: ImageModalProps) {
  return (
    <div
      className="fixed z-10 pt-24 left-0 top-0 w-full h-full overflow-auto bg-[#000000e6]"
      data-testid="image-modal"
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
