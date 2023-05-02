const Request = window?.require ? window.require("tedious").Request : null;

const SERVER_IP = "192.168.1.128"

const Connection = window?.require
  ? window.require("tedious").Connection
  : null;

  const serverConfigs = {
  server: SERVER_IP,
  authentication: {
    type: "default",
    options: {
      userName: "sa",
    },
  },
  options: {
    database: "M4_SUPERGALVANICA",
    trustServerCertificate: true,
    readOnlyIntent: true,
  },
};

const example = {
  docno: "000567",
  documentdate: "2023-04-09T00:00:00",
  companyname: "MAGO SRL",
  address: "Via Roma, 1",
  city: "Roma",
  zipcode: "00100",
  taxidnumber: "12312412122",
  lotti: [
    {
      n_lotto_super: "121",
      qty: "1001.12",
      uom: "KG",
      item: "71322",
      description: "Articolo... test 3 VS LOTTO WO CIAO123",
      impianto: "Ossido 6000",
      line: "2",
      line_lotto: "1",
      // articolo_certificato: "Articolo Certificato Test",
      // "specifiche_it": "Specifiche IT test",
      // "specifiche_en": "Specifiche EN test",
      // trattamento_s10",
      "trattamento1": "Argentatura",
      "trattamento2": "Stagnatura",
      "trattamento3": "Micron",
      "trattamento4": "SP",
      "trattamento5": "",
    },
  ],
};

export const getDatiBollaMago = async (n_bolla) => {
  // return example
  const numero_documento = n_bolla.padStart(6, "0");
  const query = `SELECT
    doc.docno,
    doc.documentdate,
    doc.shippingreason,
    cust.companyname,
    cust.address,
    cust.zipcode,
    cust.taxidnumber,
    cust.city,
    cust.county,
    cust.email,
    detail.line,
    detail.description, 
    detail.item,
    detail.uom,
    detail.qty,
    detail.grossvolume,
    item.impianto,
    item.trattamento1,
    item.trattamento2,
    item.trattamento3,
    item.trattamento4,
    item.trattamento5,
    item.superficie,
    item.articolo_certificato,
    item.specifiche_it,
    item.specifiche_en,
    item.trattamento_certificato,
    item.spessore_minimo,
    item.spessore_massimo,
    item.n_misurazioni,
    item.mail_cliente,
    sale.job AS n_lotto_super,
    sale.line as line_lotto
  FROM ma_saledoc AS doc
  JOIN ma_custsupp AS cust ON doc.custsupp = cust.custsupp
  JOIN ma_saledocdetail AS detail ON doc.saledocid = detail.saledocid
  JOIN bt_supergitems AS item ON detail.item = item.cod_articolo
  JOIN ma_saleorddetails AS sale ON detail.description = sale.description AND detail.item = sale.item
  WHERE doc.documenttype = 3407873 
    AND doc.CustSuppType = 3211264 
    AND doc.docno = '${numero_documento}' 
    AND doc.documentdate = (SELECT MAX(documentdate) FROM ma_saledoc WHERE docno = '${numero_documento}')
  ORDER BY doc.documentdate desc`;
  const configs = {
    ...serverConfigs,
    authentication: {
      ...serverConfigs.authentication,
      options: {
        ...serverConfigs.authentication.options,
        password: localStorage.getItem("mago_psw"),
      },
    },
  };
  const connection = new Connection(configs);
  return new Promise((resolve, reject) => {
    connection.on("connect", (err) => {
      if (err) {
        console.log("Connection Failed");
        reject(err);
      }
      executeStatement();
    });
    connection.connect();
    function executeStatement() {
      const rows = [];
      const request = new Request(query, (err, rowCount) => {
        if (err) {
          reject(err);
        } else {
          const res = {
            lotti: rows.sort((a, b) => a.line - b.line),
            ...rows[0],
          };
          resolve(res);
        }
        connection.close();
      });
      request.on("row", (columns) => {
        const row = {};
        columns.forEach((column) => {
          row[column.metadata.colName] = column.value;
        });
        rows.push(row);
      });
      request.on("error", (err) => {
        reject(err);
      });
      connection.execSql(request);
    }
  });
};
