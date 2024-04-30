import { StatusOption } from "./SelectOption";
import { ToDoItem } from "./ToDoItem";

export type ItemListProps = {
  item: ToDoItem;
  toggleItemChecked: React.Dispatch<React.SetStateAction<any>>;
  onUpdateStatus: (id: number, statusOpt: StatusOption) => void;
  onRemoveItem: (id: number) => void;
};
