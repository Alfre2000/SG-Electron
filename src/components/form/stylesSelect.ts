export const customStyle = {
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "0.875rem",
      padding: "5px",
      paddingLeft: "15px",
      fontWeight: "400",
      textAlign: "center",
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "#212529"
    }),
    clearIndicator: (provided: any, state: any) => ({
      ...provided,
      display: "none",
    }),
    control: (provided: any, state: any) => {
      return {
      ...provided,
      borderColor: state.selectProps.error ? "#cb444b" : state.isFocused ? "#86b7fe" : "#e5e7eb",
      backgroundColor: state.selectProps.isDisabled ? "#eaecef" : "white",
      boxShadow: state.isFocused && state.selectProps.error ? "0 0 0 0.25rem rgb(203 68 74 / 25%)" : state.isFocused && state.selectProps.errors ? "0 0 0 0.25rem rgb(25 135 84 / 25%)" : state.isFocused ? "0 0 0 0.25rem rgb(13 110 253 / 25%)" : "none",
      minHeight: "31px",
      height: "31px",
      "&:hover": {
        borderColor: state.selectProps.error ? "#cb444b" : state.isFocused ? "#86b7fe" : "#e5e7eb",
      }
    }},
    input: (provided: any, state: any) => {
      return {
      ...provided,
      padding: "0px",
      margin: "0px",
    }},
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      paddingTop: "0px",
      paddingBottom: "0px",
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      padding: "0px 5px",
      color: state.selectProps.error ? "#cb444b" : state.selectProps.errors ? "#198754" : "hsl(0, 0%, 80%)"
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      zIndex: 10000,
    }),
  };
  