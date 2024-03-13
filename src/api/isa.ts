import { AvgTelai, TimeSeriesProduction } from "@interfaces/isa";

const tedious = window?.require ? window.require("tedious") : null;
const electron = window?.require ? window.require("electron") : null;

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

const query = async (filePath: string, options: Record<string, string> = {}): Promise<string> => {
  const txt = await electron.ipcRenderer.invoke("get-query", filePath);
  return Object.keys(options).reduce((acc, key) => {
    return acc.replace(`{{ ${key} }}`, options[key]);
  }, txt);
};

export const makeDatabaseRequest = async <T>(query: string) => {
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

  return new Promise<T>((resolve, reject) => {
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

export const getProduction = async (
  groupByHour: number,
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  if (!startDate || !endDate) {
    return [];
  }
  endDate.setHours(23, 59, 59, 999);

  // enddate is the minimum between the end of the day and the current date minus groupByHour hours
  endDate = new Date(Math.min(endDate.getTime(), new Date().getTime() + 1 * 60 * 60 * 1000));

  const options = {
    groupByHour: groupByHour.toString(),
    startDate: startDate.toISOString().split(".")[0],
    endDate: endDate.toISOString().split(".")[0],
  };
  return await query("impianti/time_series_telai.sql", options).then((res) => {
    return makeDatabaseRequest<TimeSeriesProduction>(res);
  });
};

export const avgTelai = async () => {
  return await query("impianti/avg_telai.sql").then((res) => makeDatabaseRequest<AvgTelai>(res));
};
