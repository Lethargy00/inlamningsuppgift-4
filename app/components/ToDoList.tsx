"use client";
import React, { useState, useEffect } from "react";
import { faTrashCan, faPlus, faCircle, faHouse, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openDB } from "idb";
import Select from "react-select";
import { useRef } from "react";
import { faArrowDownAZ, faArrowUpZA } from "@fortawesome/free-solid-svg-icons";




// Define the structure of a ToDo item.
interface ToDoItem {
  id: number;
  text: string;
  checked: boolean;
  status: string | "pending" | "in-progress" | "completed";
  priority: string | "high" | "medium" | "low";
  subject: string | "home" | "work";
}

// Define the structure for the select components.
interface  StatusOption {
  value: ToDoItem["status"];
  label: string;
}
interface PriorityOptions {
  value: ToDoItem["priority"];
  label: string;
}
interface SubjectOptions {
  value: ToDoItem["subject"];
  label: string;
}

// Define the options for the Select component.
const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];
const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const subjectOptions = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
];

// Main component for the ToDo list.
const ToDoList: React.FC = () => {
  const [list, setList] = useState<ToDoItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hideChecked, setHideChecked] = useState(() => {
    // Retrive the hidechecked value from local storage on first render.
    const savedHideChecked = localStorage.getItem("hideChecked");
    return savedHideChecked ? JSON.parse(savedHideChecked) : false;
  });

  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(() => {
    // Retrieve the selected status from localStorage on first render.
    const savedStatus = localStorage.getItem('selectedStatus');
    return savedStatus ? JSON.parse(savedStatus) : null;
  });
  const [selectedPriority, setSelectedPriority] = useState<PriorityOptions | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectOptions | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter by Name
  // Add sorting functions to sort the list of todos 
  // Local Compare is built in function to sort the list alphabetically.
   const sortAZ = () => {
    const sorted = [...list].sort((a, b) => a.text.localeCompare(b.text));
    setList(sorted);
  };

  const sortZA = () => {
    const sorted = [...list].sort((a, b) => b.text.localeCompare(a.text));
    setList(sorted);
  };

  // Function to toggle the hideChecked state an save it to localStorage.
  const setHideCheckedAndSave = (hideChecked: boolean) => {
    setHideChecked(hideChecked);
    localStorage.setItem('hideChecked', JSON.stringify(hideChecked));
  }

  // Function to set the selected status and save it to localStorage
  const setSelectedStatusAndSave = (selectedStatus: StatusOption | null) => {
    setSelectedStatus(selectedStatus);
    if (selectedStatus) {
      localStorage.setItem('selectedStatus', JSON.stringify(selectedStatus));
    } else {
      localStorage.removeItem('selectedStatus');
    }
  };

  // Fetch and display tasks on first render
  useEffect(() => {
    const init = async () => {
      try {
        // Open the database "todo-db" with version 1.
        // If the database doesn't exist, it will be created.
        // The upgrade callback creates an object store named "todos" with auto-incrementing IDs.
        const db = await openDB("todo-db", 1, {
          upgrade(db) {
            db.createObjectStore("todos", { keyPath: "id", autoIncrement: true });
          },
        });

        // Retrieve all todos from the "todos" object store.
        const todos = await db.getAll("todos");

        // Update the state with the fetched todos.
        setList(todos);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };
    // Call the init function to initialize the database.
    init();
  }, []); // Empty dependency array ensures this effect runs only once on component mount.

  // Function to add a new task to IndexedDb and update the state of the list.
  const addItem = async () => {
    // Define the new item with properties from the input fields.
    const newItem: Omit<ToDoItem, "id"> = {
      text: inputValue,
      checked: false,
      status: "pending",
      priority: selectedPriority ? selectedPriority.value : "low", // Default to 'low' if not selected
      subject: selectedSubject ? selectedSubject.value : "home", // Default to 'home' if not selected
    };

    // Clear the input field.
    setInputValue("");

    try {
      // Open the database
      const db = await openDB("todo-db", 1);
      // Start a transaction on the "todos" object store with readwrite access.
      const tx = db.transaction("todos", "readwrite");
      const store = tx.objectStore("todos");
      // Add the new item to the store.
      const request = store.add(newItem);

      // Handle the promise returned by the add operation.
      request.then(async id => {
        // Once the item is added, update the state with the new item including its ID.
        const completeItem: ToDoItem = { ...newItem, id: id as number };
        setList([...list, completeItem]);
      })
      .catch(error => {
        console.error("Error adding item:", error);
      });

      // Wait for the transaction to complete.
      await tx.done;

    } catch (error) {
      console.error("Error adding item:", error);
    }
    // Refocus the input field after adding the item.
    if (inputRef.current) inputRef.current.focus();
  };

  // Function to toggle the checked status of a task.
  const toggleItemChecked = async (id: number) => {
    try {
      // Open the database
      const db = await openDB("todo-db", 1);
      // Start a transaction on the "todos" object store with readwrite access.
      const transaction = db.transaction("todos", "readwrite");
      const objectStore = transaction.objectStore("todos");
      // Find the item by ID.
      const item = list.find(item => item.id === id);

      if (item) {
        // Toggle the checked status of the item.
        item.checked = !item.checked;
        // update the item in the store.
        await objectStore.put(item);

        // Updates the UI with the modified item.
        const updatedList = list.map(function (currentItem) {
          if (currentItem.id == item.id) {
            return item;
          }
          return currentItem;
        });

        setList(updatedList);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Function to update the status of a task.
  const updateStatus = async (id: number, selectedOption: StatusOption) => {
    try {
      // Get the new status from the selected option.
      const status = selectedOption.value;

      // Open the database.
      const db = await openDB("todo-db", 1);
      // Start a transaction on the "todos" object store with readwrite access.
      const transaction = db.transaction("todos", "readwrite");
      const objectStore = transaction.objectStore("todos");
      // Find the item by ID
      const item = list.find(item => item.id === id);

      if (item) {
        // Update the status of the item.
        item.status = status;
        // Update the item in the store.
        await objectStore.put(item);
        
        // Updates the UI with the modified item.
        const updatedList = list.map(function (currentItem) {
          if (currentItem.id == item.id) {
            return item;
          }
          return currentItem;
        });

        setList(updatedList);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Function to remove a task from IndexedDB and update the state of the list.
  const removeItem = async (id: number) => {
    try {
      // Open the database.
      const db = await openDB("todo-db", 1);
      // Start a transaction on the "todos" object store with readwrite access.
      const transaction = db.transaction("todos", "readwrite");
      const objectStore = transaction.objectStore("todos");
      // Delete the item by ID.
      const request = objectStore.delete(id); // Ensure the key type matches

      // Update the UI After the transaction completes.
      transaction.oncomplete = () => {
        const newList = list.filter(item => item.id !== id);
        setList(newList);
      };
    } catch (error) {
      console.error("Error opening database or starting transaction:", error);
    }
  };

  // Filter the list based on the hideChecked flag and selectedStatus.
  const filteredList = hideChecked ? list.filter(item => !item.checked) : list;
  const filteredByStatus = selectedStatus
    ? filteredList.filter(item => item.status === selectedStatus.value)
    : filteredList;

  return (
    <>
      <div className="filterContainer">
        <label>
          <input
            type="checkbox"
            checked={hideChecked}
            onChange={() => setHideCheckedAndSave(!hideChecked)}
          />
          Hide checked items
        </label>
        <Select
          value={selectedStatus}
          onChange={setSelectedStatusAndSave}
          options={statusOptions}
          placeholder="Filter by status"
          isSearchable={false}
          isClearable
          className="filterSelect"
        />
      </div>

      <ul className="itemContainer">
        {filteredByStatus.map((item) => (
          <li key={item.id.toString()} className="listItem">
            <div className="itemContent">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItemChecked(item.id)}
              />
              <span className="text-2xl">{item.text}</span>
              <Select
                value={statusOptions.find(
                  (option) => option.value === item.status
                )}
                onChange={(selectedOption) => {
                  // Type assertion to ensure selectedOption is of type StatusOption
                  const statusOption = selectedOption as StatusOption;
                  updateStatus(item.id, statusOption);
                }}
                options={statusOptions}
                isSearchable={false}
                className="statusSelect"
              />
              <button onClick={() => removeItem(item.id)}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
            <div className="itemDetails">
              {/* Subject */}
              <p className="capitalize opacity-40 text-xs">
                {item.subject === "home" && (
                  <span className="me-2">
                    <FontAwesomeIcon icon={faHouse} />
                  </span>
                )}
                {item.subject === "work" && (
                  <span className="me-2">
                    <FontAwesomeIcon icon={faBuilding} />
                  </span>
                )}
                {item.subject}
              </p>

              {/* Item Priority */}
              <p className="capitalize text-xs">
                <span className="opacity-40 me-1">{item.priority}</span>
                {item.priority === "high" && (
                  <span className="text-red-500">
                    <FontAwesomeIcon icon={faCircle} />
                  </span>
                )}
                {item.priority === "medium" && (
                  <span className="text-orange-500">
                    <FontAwesomeIcon icon={faCircle} />
                  </span>
                )}
                {item.priority === "low" && (
                  <span className="text-green-500">
                    <FontAwesomeIcon icon={faCircle} />
                  </span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="inputFieldContainer">
        <div className="inputField">
          <div>
            <Select
              value={selectedPriority}
              onChange={setSelectedPriority}
              options={priorityOptions}
              placeholder="Select Priority"
              isSearchable={false}
              isClearable
              className="filterSelect"
            />
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              options={subjectOptions}
              placeholder="Select Subject"
              isSearchable={false}
              isClearable
              className="filterSelect"
            />
            {/* Buttons to sort todos from A to Z and from Z to A */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 ">
                <button
                  type="button"
                  onClick={sortAZ}
                  className="px-3 py-2 rounded-[15px] bg-[#dac0a3] hover:bg-[#d8b38a]"
                >
                  <FontAwesomeIcon icon={faArrowDownAZ} />
                </button>
                <button
                  type="button"
                  onClick={sortZA}
                  className="px-3 py-2 rounded-[15px] bg-[#dac0a3] hover:bg-[#d8b38a]"
                >
                  <FontAwesomeIcon icon={faArrowUpZA} />
                </button>
              </div>
            </div>
          </div>
          <input
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
        </div>
        <button type="button" onClick={addItem}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </>
  );
};

export default ToDoList;
