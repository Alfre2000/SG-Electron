import React, { useState } from "react";
import { Col, Row, Form, Stack, Spinner } from "react-bootstrap";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/form-components/TimeInput/TimeInput";
import { findElementFromID } from "../../../utils";
import Fieldset from "../../../components/form-components/Fieldset";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { useUserContext } from "../../../UserContext";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import SezioneInformazioniArticolo from "./Sezioni/SezioneInformazioniArticolo";
import SezioneSpessori from "./Sezioni/SezioneSpessori";
import SezioneDocumenti from "./Sezioni/SezioneDocumenti";
import SezioneControlli from "./Sezioni/SezioneControlli";
import SezioneAnomalie from "./Sezioni/SezioneAnomalie";
import { useFormContext } from "../../../contexts/FormContext";
import SezioneAllegati from "./Sezioni/SezioneAllegati";
import OperatoreInput from "../../../components/form-components/OperatoreInput/OperatoreInput";
import { getLottoInformation } from "../../../api/mago";
import { apiPost } from "../../../api/api";
import { URLS } from "../../../urls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import ModifyModal from "../../../components/Modals/ModifyModal/ModifyModal";
import FormWrapper from "../../FormWrapper";
import MyToast from "../../../components/MyToast/MyToast";

let last_res = undefined;

function RecordLavorazioneForm({ data, setData }) {
  const { initialData, view } = useFormContext();
  const { user } = useUserContext();
  const [qty, setQty] = useState(initialData?.quantità || undefined);
  const [um, setUm] = useState(initialData?.um || "N");
  const [loadingLotto, setLoadingLotto] = useState(false);
  const [lotto, setLotto] = useState(initialData?.n_lotto_super || "");
  const [lottoCliente, setLottoCliente] = useState(initialData?.n_lotto_cliente || "");
  const [errorLotto, setErrorLotto] = useState(false);
  const [modifytoast, setModifytoast] = useState(false);
  const [recordModify, setRecordModify] = useState(undefined);
  const cleanCliente = (nome) => nome.replace("SPA", "").replace("SRL", "");
  const initialCliente =
    data.articoli && initialData?.articolo
      ? findElementFromID(initialData?.articolo, data.articoli).cliente?.nome
      : "";
  const [cliente, setCliente] = useState(
    initialCliente
      ? { value: initialCliente, label: cleanCliente(initialCliente) }
      : null
  );
  const [articoloID, setArticoloID] = useState(initialData?.articolo || "");
  const articolo = findElementFromID(articoloID, data.articoli);
  const clienti = data.articoli
    ? new Set(data.articoli.map((articolo) => articolo.cliente?.nome))
    : new Set([]);

  const loadLotto = (e) => {
    if (view || initialData) {
      setLotto(e.target.value);
      return;
    }
    let value = e.target.value;
    if (/^\d{2}-\d{6,7}$/.test(value)) {
      value = value.replace("-", "/");
      value = value.replace(/(\d{5})/, "$1.");
    }
    setLotto(value);
    const regex = /^\d{2}\/\d{5}[/.]\d{1,2}$/;
    if (regex.test(value)) {
      setLoadingLotto(true);
      getLottoInformation(value).then((res) => {
        if (!res.length) {
          setLoadingLotto(false);
          setErrorLotto(true);
          setTimeout(() => setErrorLotto(false), 1000 * 5);
          return;
        }
        apiPost(URLS.RECORD_LAVORAZIONE_INFO, res[0]).then((res) => {
          console.log(last_res, parseInt(value.split('.').at(-1)));
          if (last_res && last_res > parseInt(value.split('.').at(-1))) return;
          if (!data.articoli.map((a) => a.id).includes(res.articolo.id)) {
            setData((prev) => ({
              ...prev,
              articoli: [res.articolo, ...prev.articoli],
            }));
          }
          setLoadingLotto(false);
          if (res.record) {
            setLotto("");
            setRecordModify(res.record);
          } else {
            setLotto(value)
            setRecordModify(undefined);
            setArticoloID(res.articolo.id);
            setCliente({
              value: res.articolo.cliente.nome,
              label: cleanCliente(res.articolo.cliente.nome),
            });
            setQty(res.quantità);
            setUm(res.um);
            setLottoCliente(res.lotto_cliente);
          }
          last_res = parseInt(value.split('.').at(-1));
          setTimeout(() => {
            last_res = undefined;
          }, 1000);
        }).catch((err) => {
          setErrorLotto(true);
          setLoadingLotto(false);
          setTimeout(() => setErrorLotto(false), 1000 * 5);
        });
      });
    }
  };

  useState(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.name === "n_lotto_super") {
        e.stopPropagation();
        e.preventDefault();
      }
    });
    return () => {
      document.removeEventListener("keydown", (e) => {
        console.log(e);
      });
    };
  }, []);
  return (
    <>
      <ModifyModal
        show={recordModify}
        handleClose={() => setRecordModify(undefined)}
      >
        <FormWrapper
          data={data}
          setData={setData}
          initialData={recordModify}
          url={URLS.RECORD_LAVORAZIONI}
          onSuccess={(newData) => {
            setRecordModify(undefined);
            if (newData) setData(newData);
            setModifytoast(true);
            setTimeout(() => setModifytoast(false), 4000);
          }}
        >
          <RecordLavorazioneForm data={data} initialData={recordModify} />
        </FormWrapper>
      </ModifyModal>
      {modifytoast && <MyToast>Record modificato con successo !</MyToast>}
      <Row className="mb-4">
        <Hidden name="impianto" value={user.user.impianto.id} />
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
            <DateInput />
            <TimeInput />
            <OperatoreInput data={data} />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10 flex">
          <Stack gap={2} className="text-left justify-center">
            <SearchSelect
              name="cliente"
              inputProps={{
                value: cliente,
                onChange: (e) =>
                  setCliente(
                    e
                      ? {
                          value: e.value,
                          label: cleanCliente(e.label),
                        }
                      : null
                  ) || setArticoloID(null),
              }}
              options={
                clienti &&
                [...clienti].map((cliente) => ({
                  value: cliente,
                  label: cleanCliente(cliente),
                }))
              }
            />
            <SearchSelect
              name="articolo"
              inputProps={{
                isDisabled: !cliente || view,
                value: articolo
                  ? {
                      value: articolo.id,
                      label: `${articolo.nome} (${articolo.codice || "-"})`,
                    }
                  : null,
                onChange: (e) => setArticoloID(e?.value ? e.value : null),
              }}
              options={data?.articoli
                ?.filter((arti) => arti.cliente.nome === cliente?.value)
                .map((a) => ({
                  value: a.id,
                  label: `${a.nome} (${a.codice || "-"})`,
                }))}
            />
          </Stack>
        </Col>
      </Row>
      <Fieldset title="Informazioni Lotto">
        <Row>
          <Col xs={6} className="pr-8 relative">
            <Input
              label="N° lotto supergalvanica:"
              name="n_lotto_super"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              inputProps={{ value: lotto, onChange: loadLotto }}
              labelCols={7}
            />
            {loadingLotto && (
              <Spinner
                animation="border"
                role="status"
                className="absolute top-1 -right-2 text-sm w-[22px] h-[22px]"
                variant="secondary"
              />
            )}
            {errorLotto && !loadingLotto && (
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="absolute top-[5px] -right-1 text-sm w-[20px] h-[20px] text-red-600"
              />
            )}
          </Col>
          <Col xs={6} className="pl-0">
            <Input
              label="N° lotto cliente:"
              name="n_lotto_cliente"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              inputProps={{ value: lottoCliente, onChange: (e) => setLottoCliente(e.target.value) }}
              labelCols={7}
            />
          </Col>
        </Row>
        <Row className="my-3">
          <Col xs={6} className="pr-8">
            <Input
              label="N° pezzi dichiarati:"
              name="quantità"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
              inputProps={{
                type: "number",
                value: qty,
                onChange: (e) => setQty(e.target.value),
              }}
            />
            <Hidden value={um} name="um" />
          </Col>
          <Col xs={6} className="pl-0">
            <Input
              label="N° pezzi scartati:"
              name="n_pezzi_scartati"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
              inputProps={{
                defaultValue: initialData?.n_pezzi_scartati || 0,
                type: "number",
              }}
            />
          </Col>
        </Row>
      </Fieldset>
      {articolo && (
        <>
          <SezioneInformazioniArticolo articolo={articolo} />
          <SezioneSpessori articolo={articolo} />
          <SezioneDocumenti articolo={articolo} />
          <SezioneControlli data={data} articolo={articolo} />
          <SezioneAnomalie articolo={articolo} />
          <SezioneAllegati articolo={articolo} />
        </>
      )}
      <Form.Group className="mt-8">
        <Row className="mb-4">
          <Col xs={1} className="flex items-center">
            <Form.Label className="mt-2">Note:</Form.Label>
          </Col>
          <Col sm={8}>
            <Input
              label={false}
              inputProps={{ as: "textarea", rows: 3, className: "text-left" }}
              name="note"
            />
          </Col>
          <Col xs={3} className="flex">
            <Checkbox
              vertical={true}
              name="completata"
              inputProps={{
                defaultChecked: initialData ? initialData.completata : false,
                className: "bigger-checkbox",
              }}
            />
          </Col>
        </Row>
      </Form.Group>
    </>
  );
}

export default RecordLavorazioneForm;
