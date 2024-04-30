import { ToDoItem } from "./ToDoItem";

// Define the structure for the select components.
export interface StatusOption {
  value: ToDoItem["status"];
  label: string;
}
export interface PriorityOption {
  value: ToDoItem["priority"];
  label: string;
}
export interface SubjectOption {
  value: ToDoItem["subject"];
  label: string;
}
