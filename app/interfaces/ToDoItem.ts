// Define the structure of a ToDo item.
export interface ToDoItem {
  id: number;
  text: string;
  checked: boolean;
  status: string | "pending" | "in-progress" | "completed";
  priority: string | "high" | "medium" | "low";
  subject: string | "home" | "work";
}
