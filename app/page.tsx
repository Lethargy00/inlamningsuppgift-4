import SetTheme from "./components/SetTheme";
import ToDoList from "./components/ToDoList";

export default function Home() {
  return (
    <main>
      <div className="listHeader">
        <h1>To do List</h1>
        <SetTheme/>
      </div>
      <ToDoList/>
    </main>
  );
}
