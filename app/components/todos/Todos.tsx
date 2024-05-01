import { StatusOption } from "../../interfaces/SelectOption";
import { ToDoItem } from "../../interfaces/ToDoItem";
import Todo from "./todo/Todo";
import style from "./Todos.module.css";

type ItemListProps = {
  listItems: ToDoItem[];
  toggleItemChecked: React.Dispatch<React.SetStateAction<any>>;
  onUpdateStatus: (id: number, statusOpt: StatusOption) => void;
  onRemoveItem: (id: number) => void;
};

export default function ItemList({
  listItems,
  toggleItemChecked,
  onUpdateStatus,
  onRemoveItem,
}: ItemListProps) {
  return (
    <section className={style.container}>
      <ul className={style.list}>
        {listItems.map((item) => (
          <Todo
            key={item.id.toString()}
            item={item}
            toggleItemChecked={toggleItemChecked}
            onUpdateStatus={onUpdateStatus}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </ul>
    </section>
  );
}
