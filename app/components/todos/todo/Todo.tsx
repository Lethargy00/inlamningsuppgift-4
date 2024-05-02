import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCircle,
  faHouse,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { ToDoItem } from "../../../interfaces/ToDoItem";
import Select from "react-select";
import { statusOptions } from "../../../constants/statusOptions";
import { StatusOption } from "../../../interfaces/SelectOption";
import style from "./Todo.module.css";

type ToDoProps = {
  item: ToDoItem;
  toggleItemChecked: React.Dispatch<React.SetStateAction<any>>;
  onUpdateStatus: (id: number, statusOpt: StatusOption) => void;
  onRemoveItem: (id: number) => void;
};

export default function Todo({
  item,
  toggleItemChecked,
  onUpdateStatus,
  onRemoveItem,
}: ToDoProps) {
  return (
    <li key={item.id.toString()} className={style.container}>
      <div className={style.header}>
        <input
          className={style.checkbox}
          aria-label="Check Item"
          type="checkbox"
          checked={item.checked}
          onChange={() => toggleItemChecked(item.id)}
        />
        <span className={style.text}>{item.text}</span>
        <Select
          aria-label="Select what status"
          value={statusOptions.find((option) => option.value === item.status)}
          onChange={(selectedOption) => {
            // Type assertion to ensure selectedOption is of type StatusOption
            const statusOption = selectedOption as StatusOption;
            onUpdateStatus(item.id, statusOption);
          }}
          options={statusOptions}
          isSearchable={false}
          className={style.select}
        />
        <button
          className={style.button}
          title="Remove item"
          onClick={() => onRemoveItem(item.id)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
      <div className={style.footer}>
        <p className={style.subText}>
          {item.subject === "home" && (
            <span>
              <FontAwesomeIcon icon={faHouse} />
            </span>
          )}
          {item.subject === "work" && (
            <span>
              <FontAwesomeIcon icon={faBuilding} />
            </span>
          )}
          <span className={style.subjectText}>{item.subject}</span>
        </p>

        <p className={style.subText}>
          <span className={style.priorityText}>{item.priority}</span>
          {item.priority === "high" && (
            <span className={style.red}>
              <FontAwesomeIcon icon={faCircle} />
            </span>
          )}
          {item.priority === "medium" && (
            <span className={style.orange}>
              <FontAwesomeIcon icon={faCircle} />
            </span>
          )}
          {item.priority === "low" && (
            <span className={style.green}>
              <FontAwesomeIcon icon={faCircle} />
            </span>
          )}
        </p>
      </div>
    </li>
  );
}
