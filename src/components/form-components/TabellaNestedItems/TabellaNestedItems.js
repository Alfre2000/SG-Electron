import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { findNestedElement, modifyNestedObject, objectsEqual } from "../../../pages/utils";
import { capitalize } from "../../../utils";
import MinusIcon from "../../Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../Icons/PlusIcon/PlusIcon";
import Hidden from "../../form-components/Hidden/Hidden";
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
                    type={colonna.type || "text"}
                    className="text-center"
                    size="sm"
                    name={inputName}
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
                {errors && (
                  <Form.Control.Feedback type="invalid" className="block text-xs text-center">
                    {findNestedElement(errors, inputName)?.join(' - ')}
                  </Form.Control.Feedback>
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
          <td colSpan={colonne.length + 1}>
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
