import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./AddTodoInput.module.css";

type AddTodoInputProps = {
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  addItem: () => void;
};

export default function AddTodoInput({
  inputValue,
  inputRef,
  addItem,
  setInputValue,
}: AddTodoInputProps) {
  return (
    <div className={style.container}>
      <input
        className={style.input}
        ref={inputRef}
        type="text"
        placeholder="Task description..."
        value={inputValue}
        autoFocus
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addItem();
          }
        }}
      />
      <button
        title="Add Item"
        type="button"
        onClick={addItem}
        className={style.button}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
