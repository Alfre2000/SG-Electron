import React from "react";
import { Table } from "react-bootstrap";
import { useFormContext } from "../../../contexts/FormContext";
import { toTableArray } from "../../../utils";
import Checkbox from "../Checkbox";
import Hidden from "../Hidden/Hidden";

function TabellaCheckBox({
  items,
  listName,
  checkName,
  itemName,
  hiddens,
  initialData,
}) {
  const formData = useFormContext();
  initialData = initialData !== undefined ? initialData : formData.initialData;
  const groupedItems = toTableArray(items);
  return (
    <Table className="align-middle text-center" bordered>
      <tbody>
        {groupedItems.map((row, idx) => (
          <tr key={row[0].id}>
            <td className="w-[42%] uppercase">
              {row[0].nome || row[0].materiale}
            </td>
            <td>
              <Hidden
                value={row[0].id}
                name={`${listName}__${idx * 2}__${itemName}`}
              />
              {hiddens?.map((el) => (
                <Hidden
                  value={el.value}
                  name={`${listName}__${idx * 2}__${el.name}`}
                />
              ))}
              <Checkbox
                name={`${listName}__${idx * 2}__${checkName}`}
                label={false}
                inputProps={{
                  defaultChecked:
                    initialData?.[listName]?.find(
                      (el) => el[itemName] === row[0].id
                    )?.[checkName] || false,
                  className: "bigger-checkbox",
                }}
                vertical={true}
              />
            </td>
            {row[1] && (
              <>
                <td className="w-[42%] uppercase">
                  {row[1].nome || row[1].materiale}
                </td>
                <td>
                  <Hidden
                    value={row[1].id}
                    name={`${listName}__${idx * 2 + 1}__${itemName}`}
                  />
                  {hiddens?.map((el) => (
                    <Hidden
                      value={el.value}
                      name={`${listName}__${idx * 2 + 1}__${el.name}`}
                    />
                  ))}
                  <Checkbox
                    name={`${listName}__${idx * 2 + 1}__${checkName}`}
                    label={false}
                    inputProps={{
                      defaultChecked:
                        initialData?.[listName]?.find(
                          (el) => el[itemName] === row[1].id
                        )?.[checkName] || false,
                      className: "bigger-checkbox",
                    }}
                    vertical={true}
                  />
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TabellaCheckBox;
