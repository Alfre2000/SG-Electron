import { useState } from "react";
import { Col, Row, Stack, Spinner } from "react-bootstrap";
import ReactForm from "react-bootstrap/Form";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/form-components/TimeInput/TimeInput";
import Fieldset from "../../../components/form-components/Fieldset";
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
import { useQuery } from "react-query";
import Form from "../../Form";
import { toast } from "sonner";
import { useUserContext } from "../../../contexts/UserContext";
import { usePageContext } from "@contexts/PageContext";

let last_res = undefined;

function RecordLavorazioneForm({ showOperatore }) {
  const { initialData, view } = useFormContext();
  const { setCopyData } = usePageContext();
  const { user } = useUserContext();
  const [qty, setQty] = useState(initialData?.quantità || "");
  const [um, setUm] = useState(initialData?.um || "");
  const [price, setPrice] = useState();
  const [dataFattura, setDataFattura] = useState();
  const [prezzoUnitario, setPrezzoUnitario] = useState();
  const [loadingLotto, setLoadingLotto] = useState(false);
  const [lotto, setLotto] = useState(initialData?.n_lotto_super || "");
  const [lottoCliente, setLottoCliente] = useState(initialData?.n_lotto_cliente || "");
  const [errorLotto, setErrorLotto] = useState(false);
  const [recordModify, setRecordModify] = useState(undefined);
  const [articoloID, setArticoloID] = useState(initialData?.articolo || "");

  const articoloQuery = useQuery({ queryKey: URLS.ARTICOLI_NESTED + articoloID + "/", enabled: !!articoloID });
  const articolo = articoloQuery.data;
  const cliente = articolo?.cliente?.nome;

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
        console.log(res);
        if (!res.length) {
          setLoadingLotto(false);
          setErrorLotto(true);
          setTimeout(() => setErrorLotto(false), 1000 * 5);
          return;
        }
        setPrice(res[0].price);
        setDataFattura(res[0].data_fattura);
        setPrezzoUnitario(res[0].prezzo_unitario);
        apiPost(URLS.RECORD_LAVORAZIONE_INFO, res[0])
          .then((res) => {
            if (last_res && last_res > parseInt(value.split(".").at(-1))) return;
            setLoadingLotto(false);
            if (res.record && res.record.status !== "PL") {
              setLotto("");
              setRecordModify(res.record);
            } else {
              if (res.record?.status === "PL") {
                delete res.record.data;
                setCopyData(res.record);
              } else {
                setLotto(value);
                setRecordModify(undefined);
                setArticoloID(res.articolo.id);
                setQty(res.quantità);
                setUm(res.um);
                setLottoCliente(res.lotto_cliente);
              }
            }
            last_res = parseInt(value.split(".").at(-1));
            setTimeout(() => {
              last_res = undefined;
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
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
      <ModifyModal show={recordModify} handleClose={() => setRecordModify(undefined)}>
        <Form
          initialData={recordModify}
          forceNoCopy={true}
          onSuccess={() => {
            setRecordModify(undefined);
            toast.success("Record modificato con successo !");
          }}
        />
      </ModifyModal>
      <Row className="mb-4">
        <Hidden name="impianto" value={user.user.impianto?.id || initialData?.impianto} />
        <Hidden name="prezzo" value={price} />
        <Hidden name="data_fattura" value={dataFattura} />
        <Hidden name="prezzo_unitario" value={prezzoUnitario} />
        <Hidden name="status" value="L" />
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
            <DateInput />
            <TimeInput />
            <OperatoreInput show={showOperatore} />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10 flex">
          <Stack gap={2} className="text-left justify-center">
            <Input label="Cliente:" labelCols={3} isDisabled inputProps={{ value: cliente }} />
            <Input label="Articolo:" labelCols={3} isDisabled inputProps={{ value: articolo?.nome }} />
            <Hidden name="articolo" value={articoloID} />
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
              inputProps={{
                value: lottoCliente,
                onChange: (e) => setLottoCliente(e.target.value),
              }}
              labelCols={7}
            />
          </Col>
        </Row>
        <Row className="my-3">
          <Col xs={6} className="pr-8 relative">
            <Input
              label="Pezzi dichiarati:"
              name="quantità"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
              inputProps={{
                type: "number",
                className: "rounded-r-none text-center",
                value: qty,
                onChange: (e) => setQty(e.target.value),
              }}
            />
            <Input
              label={false}
              isDisabled={true}
              inputProps={{
                value: um.replace("NR", "N"),
                className: "max-w-[40px] absolute top-0 -right-[8px] text-center px-0 rounded-l-none border-l-0",
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
          <SezioneControlli articolo={articolo} />
          <SezioneAnomalie articolo={articolo} />
          <SezioneAllegati articolo={articolo} />
        </>
      )}
      <ReactForm.Group className="mt-8">
        <Row className="mb-4">
          <Col xs={1} className="flex items-center">
            <ReactForm.Label className="mt-2">Note:</ReactForm.Label>
          </Col>
          <Col sm={8}>
            <Input label={false} inputProps={{ as: "textarea", rows: 3, className: "text-left" }} name="note" />
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
      </ReactForm.Group>
    </>
  );
}

export default RecordLavorazioneForm;
