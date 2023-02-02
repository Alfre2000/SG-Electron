import {
  faArrowDownAZ,
  faArrowUpAZ,
  faClose,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { dateToAPIdate, dateToPickerDate } from "../../utils";
import SearchSelect from "../form-components/SearchSelect";
import Input from "./../form-components/Input";

function FilterPopup({ label, name, update, filters, submit, type = "text" }) {
  name = name.split("__")[0];
  const [open, setOpen] = useState(false);
  const numberLike = ["date", "time", "number"].includes(type);
  const keys = Object.keys(filters.filters)
    .filter((k) => filters.filters[k] && k)
    .map((k) => k.split("__")[0]);
  const active = filters.ordering.includes(name) || keys.includes(name);
  const [comparison, setComparison] = useState({ value: "eq", label: "=" });

  const setCrescente = () => {
    update((prev) => {
      const newOrdering = prev.ordering === name ? "" : name;
      const res = { ...prev, ordering: newOrdering };
      submit(res);
      return res;
    });
    setOpen(false);
  };
  const setDecrescente = () => {
    update((prev) => {
      const newOrdering = prev.ordering === "-" + name ? "" : "-" + name;
      const res = { ...prev, ordering: newOrdering };
      submit(res);
      return res;
    });
    setOpen(false);
  };
  const setFilter = (e) => {
    let value = e.target.value;
    if (type === "date") value = dateToAPIdate(value);
    let filters = { [name]: value };
    if (numberLike) {
      filters = { [name + "__" + comparison.value]: value };
    }
    update((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  };
  const cancellaFiltri = () => {
    let newFilters = { [name]: "" };
    if (numberLike) {
      newFilters = { [name + "__" + comparison.value]: "" };
      setComparison({ value: "eq", label: "=" });
    }
    const ordering = filters.ordering.includes(name) ? "" : filters.ordering;
    const res = {
      ordering: ordering,
      filters: { ...filters.filters, ...newFilters },
    };
    update(() => res);
    return res;
  };
  const setComparisonFilter = (e) => {
    let res = { ...filters };
    const value = res.filters[name + "__" + comparison.value];
    delete res.filters[name + "__" + comparison.value];
    res.filters[name + "__" + e.value] = value;
    setComparison(e);
    update(() => res);
  };
  const popover = (
    <Popover className="max-w-[340px] w-[280px]">
      <Popover.Header className="te xt-center py-1 font-semibold relative">
        {label}
        <FontAwesomeIcon
          icon={faClose}
          className="absolute rounded-full bg-red-400 text-white w-4 h-4 p-0.5 right-2 top-1.5 hover:bg-red-500 hover:cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </Popover.Header>
      <h3 className="pl-2 pt-2 font-medium text-sm">Ordinamento</h3>
      <hr className="pt-0.5 w-2/5 ml-2 text-blue-800 opacity-80" />
      <Popover.Body className="flex flex-row p-2 justify-around mt-1">
        <button
          className={`flex bg-gray-200 items-center px-2 py-1 rounded-sm border-1 border-gray-300 hover:bg-gray-300 ${
            filters.ordering === name ? "border-gray-500 bg-gray-300" : ""
          }`}
          onClick={setCrescente}
        >
          <FontAwesomeIcon icon={faArrowDownAZ} className="pr-2" />
          Crescente
        </button>
        <button
          className={`flex bg-gray-200 items-center px-2 py-1 rounded-sm border-1 border-gray-300 hover:bg-gray-300 ${
            filters.ordering === "-" + name ? "border-gray-500 bg-gray-300" : ""
          }`}
          onClick={setDecrescente}
        >
          <FontAwesomeIcon icon={faArrowUpAZ} className="pr-2" /> Decrescente
        </button>
      </Popover.Body>
      <h3 className="pl-2 pt-2 font-medium text-sm">Filtro</h3>
      <hr className="pt-0.5 w-2/5 ml-2 text-blue-800 opacity-80" />
      <Popover.Body className="py-2 px-3 my-1">
        <div className="flex">
          {numberLike && (
            <div className="w-1/2 mr-8">
              <SearchSelect
                label={false}
                options={[
                  { value: "gt", label: ">" },
                  { value: "eq", label: "=" },
                  { value: "lt", label: "<" },
                ]}
                inputProps={{
                  onChange: setComparisonFilter,
                  value: comparison,
                }}
              />
            </div>
          )}
          <Input
            label={false}
            inputProps={{
              className: numberLike ? "text-center" : "text-left",
              type: type,
              onChange: setFilter,
              value:
                type === "date"
                  ? dateToPickerDate(
                      filters.filters[name + "__" + comparison.value]
                    )
                  : numberLike
                  ? filters.filters[name + "__" + comparison.value]
                  : filters.filters[name],
            }}
          />
        </div>
      </Popover.Body>
      <hr />
      <div className="py-2 px-3 flex justify-end">
        <Button
          size="sm"
          variant="secondary"
          className="bg-[#7d8286] mr-3"
          onClick={() => submit(cancellaFiltri()) || setOpen(false)}
        >
          Cancella
        </Button>
        <Button
          size="sm"
          variant="primary"
          className="bg-blue-600"
          onClick={() => submit() || setOpen(false)}
        >
          Applica
        </Button>
      </div>
    </Popover>
  );
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      show={open}
      overlay={popover}
    >
      <div
        className={`absolute right-0.5 bottom-0.5 px-[1px] bg-gray-200 rounded-sm h-[16px] border-gray-300 border-1 cursor-pointer ${
          active ? "bg-blue-600 border-blue-700" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon
          icon={faSortDown}
          className={`text-gray-500 w-[14px] h-[14px] relative -top-[9px] ${
            active ? "text-gray-50" : ""
          }`}
        />
      </div>
    </OverlayTrigger>
  );
}

export default FilterPopup;
