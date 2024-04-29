import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCircle,
  faHouse,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { StatusOption, ToDoItem } from "../models";
import Select from "react-select";
import { statusOptions } from "../SD/SD";

type ToDoProps = {
  item: ToDoItem;
  toggleItemChecked: React.Dispatch<React.SetStateAction<any>>;
  onUpdateStatus: (id: number, statusOpt: StatusOption) => void;
  onRemoveItem: (id: number) => void;
};

export default function ToDo({
  item,
  toggleItemChecked,
  onUpdateStatus,
  onRemoveItem,
}: ToDoProps) {
  return (
    <li key={item.id.toString()} className="listItem">
      <div className="itemContent">
        <input
          title="Check Item"
          type="checkbox"
          checked={item.checked}
          onChange={() => toggleItemChecked(item.id)}
        />
        <span className="text-2xl">{item.text}</span>
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
          className="statusSelect"
        />
        <button title="Remove" onClick={() => onRemoveItem(item.id)}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
      <div className="itemDetails">
        <p className="capitalize itemSubTitle text-xs">
          {item.subject === "home" && (
            <span className="me-2">
              <FontAwesomeIcon icon={faHouse} />
            </span>
          )}
          {item.subject === "work" && (
            <span className="me-2">
              <FontAwesomeIcon icon={faBuilding} />
            </span>
          )}
          {item.subject}
        </p>

        <p className="capitalize text-xs">
          <span className="itemPrioTitle me-1">{item.priority}</span>
          {item.priority === "high" && (
            <span className="text-red-500">
              <FontAwesomeIcon icon={faCircle} />
            </span>
          )}
          {item.priority === "medium" && (
            <span className="text-orange-500">
              <FontAwesomeIcon icon={faCircle} />
            </span>
          )}
          {item.priority === "low" && (
            <span className="text-green-500">
              <FontAwesomeIcon icon={faCircle} />
            </span>
          )}
        </p>
      </div>
    </li>
  );
}
