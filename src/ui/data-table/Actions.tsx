import { Button } from "@components/shadcn/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@components/shadcn/DropdownMenu";
import { faEllipsis, faMagnifyingGlass, faTrash, faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import View from "./View";
import Modify from "./Modify";
import Delete from "./Delete";
import { WithID } from "@interfaces/global";
import { Link } from "react-router-dom";
import Copy from "./Copy";

type ActionsProps<TData> = {
  record: TData;
  endpoint: string;
  view?: boolean;
  modify?: boolean;
  del?: boolean;
  copy?: boolean;
  otherActions?: {
    label: string;
    icon: any;
    link?: string;
    onClick?: () => void;
  }[];
  onSuccess?: (data?: TData[]) => void;
  trigger?: React.ReactElement;
};

function Actions<TData extends WithID>({
  record,
  view,
  modify,
  del,
  copy,
  otherActions = [],
  endpoint,
  onSuccess,
  trigger,
}: ActionsProps<TData>) {
  const [viewOpen, setViewOpen] = React.useState(false);
  const [modifyOpen, setModifyOpen] = React.useState(false);
  const [delOpen, setDelOpen] = React.useState(false);
  return (
    <>
      {viewOpen && <View isOpen={viewOpen} setIsOpen={setViewOpen} record={record} />}
      {modifyOpen && (
        <Modify isOpen={modifyOpen} setIsOpen={setModifyOpen} record={record} onSuccess={onSuccess} />
      )}
      {delOpen && (
        <Delete
          isOpen={delOpen}
          setIsOpen={setDelOpen}
          record={record}
          endpoint={endpoint}
          onSuccess={onSuccess}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button variant="ghost" className="h-8 w-14 p-0">
              <FontAwesomeIcon icon={faEllipsis} className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuLabel className="ml-1.5">Azioni</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {view && (
            <DropdownMenuItem onClick={() => setViewOpen(true)} className="py-1.5 cursor-pointer">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" className="mr-3 ml-1.5" />
              Vedi
            </DropdownMenuItem>
          )}
          {modify && (
            <DropdownMenuItem onClick={() => setModifyOpen(true)} className="py-1.5 cursor-pointer">
              <FontAwesomeIcon icon={faWrench} size="sm" className="mr-3 ml-1.5" />
              Modifica
            </DropdownMenuItem>
          )}
          {copy && <Copy record={record} />}
          {del && (
            <DropdownMenuItem onClick={() => setDelOpen(true)} className="py-1.5 cursor-pointer">
              <FontAwesomeIcon icon={faTrash} size="sm" className="mr-3 ml-1.5" />
              Elimina
            </DropdownMenuItem>
          )}
          {otherActions.map((action, index) => (
            <DropdownMenuItem key={index} onClick={action.onClick}>
              {action.link && (
                <Link to={action.link}>
                  <FontAwesomeIcon icon={action.icon} size="sm" className="mr-3" />
                  {action.label}
                </Link>
              )}
              {action.onClick && (
                <>
                  <FontAwesomeIcon icon={action.icon} size="sm" className="mr-3" />
                  {action.label}
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default Actions;
