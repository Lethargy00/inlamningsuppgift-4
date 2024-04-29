// Define the structure of a ToDo item.
export interface ToDoItem {
  id: number;
  text: string;
  checked: boolean;
  status: string | "pending" | "in-progress" | "completed";
  priority: string | "high" | "medium" | "low";
  subject: string | "home" | "work";
}

// Define the structure for the select components.
export interface StatusOption {
  value: ToDoItem["status"];
  label: string;
}
export interface PriorityOptions {
  value: ToDoItem["priority"];
  label: string;
}
export interface SubjectOptions {
  value: ToDoItem["subject"];
  label: string;
}

export type ItemListProps = {
  item: ToDoItem;
  toggleItemChecked: React.Dispatch<React.SetStateAction<any>>;
  onUpdateStatus: (id: number, statusOpt: StatusOption) => void;
  onRemoveItem: (id: number) => void;
};
