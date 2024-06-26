type FieldsetProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
  };
  
  function Fieldset({ title, children, className }: FieldsetProps) {
    return (
      <fieldset
        className={`${className || ""} border-[groove] border-2 px-8 py-1 m-0 rounded-md border-blue-100 mb-4`}
        style={{ borderStyle: "groove" }}
      >
        <legend className="mb-2 px-3 text-left uppercase font-semibold text-nav-blue text-lg float-none w-fit">
          {title}
        </legend>
        {children}
      </fieldset>
    );
  }
  
  export default Fieldset;
  