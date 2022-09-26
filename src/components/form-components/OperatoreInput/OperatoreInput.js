import React, { useRef, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { apiGet } from "../../../api/api";
import { useFormContext } from "../../../contexts/FormContext";
import { URLS } from "../../../urls";
import { searchOptions } from "../../../utils";
import Input from "../Input";
import SearchSelect from "../SearchSelect";

function OperatoreInput({ data }) {
  const { initialData, view } = useFormContext();
  const [pswModal, setPswModal] = useState(false);
  const [operatore, setOperatore] = useState(null);
  const [error, setError] = useState("");
  const pswdRef = useRef(null);

  const changeOperatore = (e) => {
    if (e && e?.value !== operatore?.value) {
      setPswModal(e.value);
      setTimeout(() => pswdRef.current.focus(), 50);
    } else {
      setOperatore(e);
    }
  };

  const checkPassword = () => {
    apiGet(URLS.OPERATORI + pswModal + "/").then((res) => {
      if (res.codice === pswdRef.current.value) {
        setPswModal(false);
        setError("");
        setOperatore({ value: res.id, label: res.nome });
      } else {
        setError("Codice errato !");
        setTimeout(() => setError(""), 1000 * 5);
      }
    });
  };

  const closeFail = () => {
    setPswModal(false);
    setOperatore(null);
    setError("");
  };
  return (
    <>
      <SearchSelect
        name="operatore"
        initialData={view ? undefined : {}}
        inputProps={{
          value: operatore,
          onChange: changeOperatore,
        }}
        options={searchOptions(data?.operatori, "nome")}
      />
      <div
        className={
          initialData && pswModal
            ? "fixed w-full h-full z-10 bg-black opacity-50 left-0 top-0"
            : ""
        }
      ></div>
      <Modal
        show={!!pswModal}
        onHide={closeFail}
        centered
        className="drop-shadow-xl"
        style={{ zIndex: "1060" }}
      >
        <Modal.Header>
          <Modal.Title className="mx-auto text-xl">
            Inserire il codice operatore
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input
            ref={pswdRef}
            label="Codice:"
            inputProps={{
              type: "password",
            }}
          />
        </Modal.Body>
        <Modal.Footer className="justify-between">
          {error ? (
            <Alert variant="danger" className="py-1 text-sm">
              {error}
            </Alert>
          ) : (
            <div></div>
          )}
          <Button
            variant="primary"
            type="submit"
            className="bg-[#0d6efd]"
            size="sm"
            onClick={checkPassword}
          >
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OperatoreInput;
