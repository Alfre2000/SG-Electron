import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { modifyNestedObject, objectsEqual } from "../../../pages/utils";
import { capitalize } from "../../../utils";
import MinusIcon from "../../Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../Icons/PlusIcon/PlusIcon";
import SearchSelect from "../SearchSelect";

function TabellaNestedItems({ name, initialData, view, colonne, errors, startIndex = 0 }) {
  const hiddenCols = colonne.filter(col => col.type === "hidden")
  colonne = colonne.filter(col => col.type !== "hidden")
  colonne = colonne.map((colonna) => {
    if (!colonna.label) {
      const label = capitalize(colonna.name).replace("_", " ");
      colonna.label = label;
    }
    return colonna;
  });
  let emptyItem = {};
  colonne.forEach((colonna) => (emptyItem[colonna.name] = ""));
  const [items, setItems] = useState(
    !!initialData ? initialData[name] : [emptyItem]
  );
  const colWidth = 90 / colonne.length;
  return (
    <Table bordered className="align-middle text-sm text-center">
      <thead>
        <tr>
          {colonne.map((colonna) => (
            <th key={colonna.name} style={{ width: `${colWidth}%` }}>
              {colonna.label}
            </th>
          ))}
          <th className="w-1/10"></th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item, idx) => (
          <tr key={idx}>
            {colonne.map((colonna) => (
              <td key={colonna.name}>
                {colonna.input ? (
                  React.cloneElement(colonna.input, {
                    name: `${name}__${idx + startIndex}__${colonna.name}`,
                  })
                ) : colonna.type === "select" ? (
                  <SearchSelect
                    name={`${name}__${idx + startIndex}__${colonna.name}`}
                    label={false}
                    initialData={initialData}
                    createTable={colonna.createTable || false}
                    errors={errors}
                    inputProps={{
                      isDisabled: view,
                      onChange: (e) => {
                        setItems(
                          modifyNestedObject(
                            items,
                            `${idx}__${colonna.name}`,
                            e.label
                          )
                        )
                      },
                      value: colonna?.options?.find(
                        (el) => el.label === item[colonna.name]
                      ),
                    }}
                    options={colonna.options}
                  />
                ) : (
                  <Form.Control
                    className="text-center"
                    size="sm"
                    name={`${name}__${idx + startIndex}__${colonna.name}`}
                    value={item[colonna.name]}
                    onChange={(e) =>
                      setItems(
                        modifyNestedObject(
                          items,
                          `${idx}__${colonna.name}`,
                          e.target.value
                        )
                      )
                    }
                  />
                )}
              </td>
            ))}
            <td>
              {initialData && (
                <input
                  hidden
                  name={`${name}__${idx + startIndex}__id`}
                  className="hidden"
                  defaultValue={item.id || undefined}
                />
              )}
              {hiddenCols.map(colonna => (
                <input
                  key={colonna.name}
                  hidden
                  name={`${name}__${idx + startIndex}__${colonna.name}`}
                  className="hidden"
                  defaultValue={colonna.value || undefined}
                />
              ))}
              <MinusIcon
                disabled={view}
                onClick={() => {
                  let newItems = items.filter((el) => !objectsEqual(el, item));
                  if (newItems.length === items.length - 1) {
                    setItems(newItems);
                  } else {
                    setItems(items.filter((_, i) => idx !== i));
                  }
                }}
              />
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={4}>
            <PlusIcon
              disabled={view}
              onClick={() => setItems([...items, emptyItem])}
            />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default TabellaNestedItems;
