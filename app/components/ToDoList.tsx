"use client";
import React, { useState, useEffect, Suspense } from "react";
import { openDB } from "idb";
import Select from "react-select";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ, faArrowUpZA } from "@fortawesome/free-solid-svg-icons";
import {
  statusOptions,
  priorityOptions,
  subjectOptions,
} from "../constants/statusOptions";

import { ToDoItem } from "../interfaces/ToDoItem";
import {
  PriorityOption,
  StatusOption,
  SubjectOption,
} from "../interfaces/SelectOption";
import SearchBar from "./SearchBar";
import Checkbox from "./Checkbox";
import Filter from "./filter/Filter";
import AddTodo from "./addTodo/AddTodo";
import AddTodoInput from "./addTodo/addTodoInput/addTodoInput";

const Todos = React.lazy(() => import("./todos/Todos"));

// Main component for the ToDo list.
const ToDoList: React.FC = () => {
  const [list, setList] = useState<ToDoItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hideChecked, setHideChecked] = useState(() => {
    // Retrive the hidechecked value from local storage on first render.
    const savedHideChecked = localStorage.getItem("hideChecked");
    return savedHideChecked ? JSON.parse(savedHideChecked) : false;
  });

  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(
    () => {
      // Retrieve the selected status from localStorage on first render.
      const savedStatus = localStorage.getItem("selectedStatus");
      return savedStatus ? JSON.parse(savedStatus) : null;
    }
  );
  const [selectedPriority, setSelectedPriority] =
    useState<PriorityOption | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(
    null
  );
  const [query, setQuery] = useState("");
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
    localStorage.setItem("hideChecked", JSON.stringify(hideChecked));
  };

  // Function to set the selected status and save it to localStorage
  const setSelectedStatusAndSave = (selectedStatus: StatusOption | null) => {
    setSelectedStatus(selectedStatus);
    if (selectedStatus) {
      localStorage.setItem("selectedStatus", JSON.stringify(selectedStatus));
    } else {
      localStorage.removeItem("selectedStatus");
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
            db.createObjectStore("todos", {
              keyPath: "id",
              autoIncrement: true,
            });
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
      request
        .then(async (id) => {
          // Once the item is added, update the state with the new item including its ID.
          const completeItem: ToDoItem = { ...newItem, id: id as number };
          setList([...list, completeItem]);
        })
        .catch((error) => {
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
      const item = list.find((item) => item.id === id);

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
      const item = list.find((item) => item.id === id);

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
        const newList = list.filter((item) => item.id !== id);
        setList(newList);
      };
    } catch (error) {
      console.error("Error opening database or starting transaction:", error);
    }
  };

  useEffect(
    function () {
      async function fetchTasks() {
        try {
          // Open the database "todo-db" with version 1.
          // If the database doesn't exist, it will be created.
          // The upgrade callback creates an object store named "todos" with auto-incrementing IDs.
          const db = await openDB("todo-db", 1, {
            upgrade(db) {
              db.createObjectStore("todos", {
                keyPath: "id",
                autoIncrement: true,
              });
            },
          });

          // Retrieve all todos from the "todos" object store.
          let todos = await db.getAll("todos");

          // Filter the todos based on the query.
          if (query.length > 0) {
            todos = todos.filter((item) =>
              item.text.toLowerCase().includes(query.toLowerCase())
            );
          }

          // Update the state with the fetched todos.
          setList(todos);
        } catch (error) {
          console.error("Error initializing database:", error);
        }
      }
      fetchTasks();
    },
    [query]
  );

  // Filter the list based on the hideChecked flag and selectedStatus.
  const filteredList = hideChecked
    ? list.filter((item) => !item.checked)
    : list;
  const filteredByStatus = selectedStatus
    ? filteredList.filter((item) => item.status === selectedStatus.value)
    : filteredList;

  return (
    <>
      <Filter>
        <section className="section">
          <Checkbox
            hideChecked={hideChecked}
            setHideChecked={() => setHideCheckedAndSave(!hideChecked)}
          />

          <div className="sortContainer">
            <button type="button" onClick={sortAZ} className="sortButton">
              <FontAwesomeIcon icon={faArrowDownAZ} />
            </button>
            <button type="button" onClick={sortZA} className="sortButton">
              <FontAwesomeIcon icon={faArrowUpZA} />
            </button>
          </div>
        </section>
        <section className="section">
          <SearchBar query={query} onQuery={setQuery} />
          <Select
            aria-label="Filter by status"
            value={selectedStatus}
            onChange={setSelectedStatusAndSave}
            options={statusOptions}
            placeholder="Filter by status"
            isSearchable={false}
            isClearable
            className="filterSelect"
          />
        </section>
      </Filter>

      <Suspense fallback={<div>Loading...</div>}>
        <Todos
          listItems={filteredByStatus}
          toggleItemChecked={toggleItemChecked}
          onUpdateStatus={updateStatus}
          onRemoveItem={removeItem}
        />
      </Suspense>

      <AddTodo>
        <div className="flex gap-4">
          <Select
            aria-label="Select what priority"
            value={selectedPriority}
            onChange={setSelectedPriority}
            options={priorityOptions}
            placeholder="Select Priority"
            isSearchable={false}
            isClearable
            className="filterSelect"
          />
          <Select
            aria-label="Select what subject"
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={subjectOptions}
            placeholder="Select Subject"
            isSearchable={false}
            isClearable
            className="filterSelect"
          />
        </div>
        <AddTodoInput
          inputValue={inputValue}
          inputRef={inputRef}
          addItem={addItem}
          setInputValue={setInputValue}
        />
      </AddTodo>
    </>
  );
};

export default ToDoList;
