import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { apiGet } from "../../../api/api";
import { useFormContext } from "../../../contexts/FormContext";
import { URLS } from "../../../urls";
import { findElementFromID, searchOptions } from "../../../utils";
import SearchSelect from "../SearchSelect";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import useStateInitialData from "../../../hooks/useInitialData/useInitialData";

function OperatoreInput({ show }) {
  const operatoriQuery = useImpiantoQuery({ queryKey: URLS.OPERATORI });
  const { initialData, view } = useFormContext();

  const operatori = searchOptions(operatoriQuery.data, "nome");

  const [pswModal, setPswModal] = useState(false);

  const [operatore, setOperatore] = useStateInitialData(initialData?.operatore, operatoriQuery.data, Boolean(view || show));
  const [error, setError] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const EyeIcon = passwordType === "password" ? faEye : faEyeSlash;
  const pswdRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const enterClick = (e) => {
      if (e.key === "Enter" && pswModal !== false) {
        e.preventDefault();
        btnRef.current.click();
      }
    }
    document.addEventListener("keydown", enterClick)
    return () => {
      document.removeEventListener("keydown", enterClick)
    }
  }, [pswModal])
  

  const changeOperatore = (e) => {
    if (e && e?.value !== operatore?.id) {
      setPswModal(e);
      setTimeout(() => pswdRef.current.focus(), 50);
    } else {
      setOperatore(findElementFromID(operatori, e?.value));
    }
  };

  const checkPassword = () => {
    apiGet(URLS.OPERATORI + pswModal.value + "/").then((res) => {
      if (res.codice === pswdRef.current.value) {
        setPswModal(false);
        setError("");
        setOperatore(res);
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

  const handleEyePassword = () => {
    if (passwordType === "password") setPasswordType("text");
    else setPasswordType("password");
  };
  return (
    <>
      <SearchSelect
        name="operatore"
        initialData={view ? initialData?.operatore : {}}
        inputProps={{
          value: { value: operatore?.id, label: operatore?.nome },
          onChange: changeOperatore,
        }}
        options={operatori}
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
        <Modal.Body className="px-5">
          <FloatingLabel label="Operatore" className="mb-3">
            <Form.Control
              placeholder="Operatore"
              value={pswModal?.label}
              disabled
              required
            />
          </FloatingLabel>
          <FloatingLabel label="Codice" className="mb-2">
            <Form.Control
              type={passwordType}
              ref={pswdRef}
              autoFocus
              className={error ? "is-invalid" : ""}
              placeholder="Password"
            />
            <FontAwesomeIcon
              icon={EyeIcon}
              onClick={handleEyePassword}
              className="absolute top-[23px] left-[85%] text-nav-blue cursor-pointer"
            />
          </FloatingLabel>
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
            ref={btnRef}
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
