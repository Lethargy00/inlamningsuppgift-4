import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SetTheme from "./components/SetTheme";
import ToDoList from "./components/ToDoList";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <main>
      <div className="listHeader">
        <h1>
          <span className="me-1">
            <FontAwesomeIcon icon={faBolt} />
          </span>
          Just ToDo It!
        </h1>
        <SetTheme />
      </div>
      <ToDoList />
    </main>
  );
}
