import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import style from "./SearchBar.module.css";

type SearchBarProps = {
  query: string;
  onQuery: React.Dispatch<React.SetStateAction<any>>;
};

export default function SearchBar({ query, onQuery }: SearchBarProps) {
  return (
    <div className={style.inputContainer}>
      <input
        className={style.textInput}
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
      {query && (
        <button className={style.clearButton} onClick={() => onQuery("")}>
          <FontAwesomeIcon icon={faX} />
        </button>
      )}
    </div>
  );
}
