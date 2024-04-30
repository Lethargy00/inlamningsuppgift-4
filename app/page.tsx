import SetTheme from "./components/SetTheme";
import ToDoList from "./components/ToDoList";
import Header from "./components/header/Header";

export default function Home() {
  return (
    <>
      <Header>
        <SetTheme />
      </Header>
      <main>
        <ToDoList />
      </main>
    </>
  );
}
