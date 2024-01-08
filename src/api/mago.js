const Request = window?.require ? window.require("tedious").Request : null;

const SERVER_IP = "192.168.1.128";

const Connection = window?.require
  ? window.require("tedious").Connection
  : null;

const EXAMPLE = [{
  "docno": "001234",
  "documentdate": "2023-1-12T10:10:10",
  "shippingreason": "asd",
  "companyname": "CIAO",
  "address": "Via",
  "zipcode": "123513",
  "taxidnumber": "",
  "city": "MI",
  "county": "MI",
  "email": "asdf",
  "line": "1",
  "description": "ciao", 
  "item": "234567890",
  "uom": "NR",
  "qty": "56",
  "grossvolume": "123",
  "impianto": "Roto 500",
  "trattamento1": "Stagnatura",
  "trattamento2": "",
  "trattamento3": "",
  "trattamento4": "",
  "trattamento5": "",
  "superficie": "",
  "articolo_certificato": "Prova 123",
  "specifiche_it": "",
  "specifiche_en": "",
  "trattamento_certificato": "NICHEL 2-4.5 & STAGNO",
  "spessore_minimo": "12",
  "spessore_massimo": "",
  "n_misurazioni": "",
  "mail_cliente": "",
  "n_lotto_super": "23/12345",
  "line_lotto": "2"
}]

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

export const makeDatabaseRequest = async (query) => {
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
          resolve(rows);
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


export const getDatiBollaMago = async (n_bolla) => {
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
    cust.custsupp,
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
    sale.line as line_lotto,
    sale.taxableamount as taxableamount
  FROM ma_saledoc AS doc
  JOIN ma_custsupp AS cust ON doc.custsupp = cust.custsupp
  JOIN ma_saledocdetail AS detail ON doc.saledocid = detail.saledocid
  JOIN bt_supergitems AS item ON detail.item = item.cod_articolo
  JOIN ma_saleorddetails AS sale ON sale.saleordid = detail.saleordid AND sale.line = detail.saleordpos
  WHERE doc.documenttype = 3407873 
    AND doc.CustSuppType = 3211264 
    AND doc.docno = '${numero_documento}' 
    AND doc.documentdate = (SELECT MAX(documentdate) FROM ma_saledoc WHERE docno = '${numero_documento}' AND documenttype = '3407873')
  ORDER BY doc.documentdate desc`;
  // const res = EXAMPLE;
  const res = await makeDatabaseRequest(query);
  const lotti = res.sort((a, b) => a.line - b.line);
  return {
    lotti,
    ...lotti[0],
  };
};

export const getLottoInformation = async (n_lotto) => {
  const job = n_lotto.slice(0, 8);
  const line = n_lotto.slice(9);
  const query = `
    SELECT
      sale.qty as quantity,
      sale.description,
      sale.uom,
      sale.item,
      sale.taxableamount as price,
      CONCAT(sale.job, '.', sale.line) AS lotto_super,
      cust.companyname,
      cust.address,
      cust.zipcode,
      cust.taxidnumber,
      cust.city,
      cust.county,
      cust.email,
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
      item.mail_cliente
    FROM ma_saleorddetails AS sale
      JOIN bt_supergitems AS item ON sale.item = item.cod_articolo
      JOIN ma_custsupp AS cust ON sale.customer = cust.custsupp
    WHERE sale.job = '${job}' AND sale.line = '${line}'
  `
  const res = await makeDatabaseRequest(query);
  return res
}

export const getDatiEtichettaMago = async (n_lotto) => {
  const query = `
    SELECT
      sale.item,
      sale.qty,
      sale.uom,
      sale.job,
      sale.line,
      sale.description,
      cust.companyname,
      item.articolo_certificato,
      item.impianto,
      item.note
    FROM ma_saleorddetails AS sale
      JOIN bt_supergitems AS item ON sale.item = item.cod_articolo
      JOIN ma_custsupp AS cust ON sale.customer = cust.custsupp
    WHERE sale.job = '${n_lotto}'
    ORDER BY sale.line
  `
  const res = await makeDatabaseRequest(query);
  return res
}