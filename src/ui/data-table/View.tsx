import ViewModal from "@components/Modals/ViewModal/ViewModal";
import { usePageContext } from "@contexts/PageContext";
import Form from "@pages/Form";

type ViewProps<TData> = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  record: TData;
};

function View<TData>({ isOpen, setIsOpen, record }: ViewProps<TData>) {
  const { FormComponent } = usePageContext();
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ViewModal show={isOpen} handleClose={() => setIsOpen(false)}>
        <FormComponent initialData={record} disabled={true} />
        {/* <Form initialData={record} view={true} /> */}
      </ViewModal>
    </div>
  );
}

export default View;
