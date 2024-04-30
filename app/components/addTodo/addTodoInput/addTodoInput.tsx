import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AddTodoInputProps = {
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  addItem: () => void;
};

export default function AddTodoInput({ inputValue, inputRef, addItem, setInputValue }: AddTodoInputProps) {
  return (
    <div className="flex gap-3">
      <input
        className="inputField"
        ref={inputRef}
        type="text"
        placeholder="Task description..."
        value={inputValue}
        autoFocus
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            addItem();
          }
        }}
      />
      <button title="Add Item" type="button" onClick={addItem} className="hover:text-green-300 text-2xl">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
