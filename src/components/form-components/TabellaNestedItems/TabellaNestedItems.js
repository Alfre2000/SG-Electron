import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { modifyNestedObject, objectsEqual } from "../../../pages/utils";
import { capitalize } from "../../../utils";
import MinusIcon from "../../Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../Icons/PlusIcon/PlusIcon";
import Hidden from "../../form-components/Hidden/Hidden";
import SearchSelect from "../SearchSelect";
import Input from "../Input";
import { useFormContext } from "../../../contexts/FormContext";

function TabellaNestedItems({ name, colonne, initialData, startIndex = 0 }) {
  const formData = useFormContext()
  initialData = initialData !== undefined ? initialData : formData.initialData;
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
  const colWidth = 95 / colonne.length;
  return (
    <Table bordered className="align-middle text-sm text-center">
      <thead>
        <tr>
          {colonne.map((colonna) => (
            <th key={colonna.name} style={{ width: `${colWidth}%` }}>
              {colonna.label}
            </th>
          ))}
          <th className="w-1/20"></th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item, idx) => (
          <tr key={idx}>
            {colonne.map((colonna) => {
              const inputName = `${name}__${idx + startIndex}__${colonna.name}`
              return (
              <td key={colonna.name}>
                {colonna.input ? (
                  React.cloneElement(colonna.input, {
                    name: inputName,
                  })
                ) : colonna.type === "select" ? (
                  <SearchSelect
                    name={inputName}
                    label={false}
                    createTable={colonna.createTable || false}
                    inputProps={{
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
                  <Input 
                    name={inputName}
                    label={false}
                    inputProps={{
                      type: colonna.type || 'text',
                      value: item[colonna.name],
                      onChange: (e) =>
                        setItems(
                          modifyNestedObject(
                            items,
                            `${idx}__${colonna.name}`,
                            e.target.value
                          )
                        )
                      }
                    }
                  />
                )}
              </td>
            )})}
            <td>
              {initialData && (
                <Hidden
                  name={`${name}__${idx + startIndex}__id`}
                  defaultValue={item.id || undefined}
                  data-testid="hidden-id"
                />
              )}
              {hiddenCols.map(colonna => (
                <Hidden
                  key={colonna.name}
                  name={`${name}__${idx + startIndex}__${colonna.name}`}
                  defaultValue={colonna.value || undefined}
                  data-testid="hidden-input"
                />
              ))}
              <MinusIcon
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
          <td colSpan={colonne.length + 1}>
            <PlusIcon
              onClick={() => setItems([...items, emptyItem])}
            />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default TabellaNestedItems;
