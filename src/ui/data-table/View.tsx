import Form from "@pages/Form";
import ViewModal from "@components/Modals/ViewModal/ViewModal";

type ViewProps<TData> = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  record: TData;
};

function View<TData>({ isOpen, setIsOpen, record }: ViewProps<TData>) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ViewModal show={isOpen} handleClose={() => setIsOpen(false)}>
        <Form initialData={record} view={true} />
      </ViewModal>
    </div>
  );
}

export default View;
