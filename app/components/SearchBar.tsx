import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
  query: string;
  onQuery: React.Dispatch<React.SetStateAction<any>>;
};

export default function SearchBar({ query, onQuery }: SearchBarProps) {
  return (
    <>
      <input
        className="search text-black"
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={e => onQuery(e.target.value)}
      />
      {query && (
        <button onClick={() => onQuery("")}>
          <FontAwesomeIcon icon={faX} />
        </button>
      )}
    </>
  );
}
