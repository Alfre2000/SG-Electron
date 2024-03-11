const tedious = window?.require ? window.require("tedious") : null;

const SERVER_IP = "192.168.1.229";

const serverConfigs = {
  server: SERVER_IP,
  authentication: {
    type: "default",
    options: {
      userName: "ISAUSER",
    },
  },
  options: {
    database: "ISA_DataExchange_L7",
    trustServerCertificate: true,
    readOnlyIntent: true,
    encrypt: false,
  },
};

export const makeDatabaseRequest = async (query: string) => {
  const configs = {
    ...serverConfigs,
    authentication: {
      ...serverConfigs.authentication,
      options: {
        ...serverConfigs.authentication.options,
        password: localStorage.getItem("impianti_psw"),
      },
    },
  };
  const connection = new tedious.Connection(configs);

  return new Promise((resolve, reject) => {
    connection.on("connect", (err: any) => {
      if (err) {
        console.log("Connection Failed");
        reject(err);
      }
      executeStatement();
    });

    connection.connect();

    function executeStatement() {
      const rows: any = [];
      const request = new tedious.Request(query, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
        connection.close();
      });

      request.on("row", (columns: any) => {
        const row: any = {};
        columns.forEach((column: any) => {
          row[column.metadata.colName] = column.value;
        });
        rows.push(row);
      });

      request.on("error", (err: any) => {
        reject(err);
      });

      connection.execSql(request);
    }
  });
};

export const getProduction = async () => {
  const query = `
    SELECT
        CAST(DateFrom AS DATE) AS date,
        DATEPART(hour, DateFrom) AS hour,
        COUNT(*) AS nTelai
    FROM
        Production
    WHERE
        Pieces != 0
        AND DateFrom >= DATEADD(year, -1, GETDATE())
        AND DateFrom <  GETDATE()
    GROUP BY
        CAST(DateFrom AS DATE),
        DATEPART(hour, DateFrom)
    ORDER BY
        date,
        hour;
    `;
  return await makeDatabaseRequest(query);
};
