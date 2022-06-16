export const customStyle = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.875rem",
    padding: "5px",
    paddingLeft: "15px",
    fontWeight: "400",
    textAlign: "center",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: "0.875rem",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    display: "none",
  }),
  control: (provided, state) => {
    console.log(state);
    return {
    ...provided,
    borderColor: state.selectProps.errors ? "#cb444b" : state.isFocused ? "#86b7fe" : "#ced4da",
    boxShadow: state.isFocused && state.selectProps.errors ? "0 0 0 0.25rem rgb(203 68 74 / 25%)" : state.isFocused ? "0 0 0 0.25rem rgb(13 110 253 / 25%)" : "none",
    minHeight: "31px",
    height: "31px",
  }},
  input: (provided, state) => ({
    ...provided,
    padding: "0px",
    margin: "0px",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    paddingTop: "0px",
    paddingBottom: "0px",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "0px 5px",
  }),
};
