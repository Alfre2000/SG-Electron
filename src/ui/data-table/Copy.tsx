import { DropdownMenuItem } from "@components/shadcn/DropdownMenu";
import { usePageContext } from "@contexts/PageContext";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WithID } from "@interfaces/global";
import { removeIdRecursively } from "@utils/main";

type Props<TData> = {
  record: TData;
};

function Copy<TData extends WithID>({ record }: Props<TData>) {
  const { setCopyData } = usePageContext();
  const handleCopy = () => {
    const initialData = { ...record };
    removeIdRecursively(initialData);
    setCopyData(initialData);
    setTimeout(() => {
      document.getElementById("sg-header")?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };
  return (
    <DropdownMenuItem onClick={handleCopy} className="py-1.5 cursor-pointer">
      <FontAwesomeIcon icon={faClone} size="sm" className="mr-3 ml-1.5" />
      Copia
    </DropdownMenuItem>
  );
}

export default Copy;
