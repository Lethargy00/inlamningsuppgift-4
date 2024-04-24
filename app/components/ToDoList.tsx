'use client'
import React, { useState, useEffect } from 'react';
import { faTrashCan, faPlus, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { openDB } from 'idb';
import Select from 'react-select';

interface ToDoItem {
    id: number;
    text: string;
    checked: boolean;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'high' | 'medium' | 'low';
    subject: 'home' | 'work';
}


interface StatusOption {
    value: ToDoItem['status'];
    label: string;
}

interface PriorityOptions {
    value: ToDoItem['priority'];
    label: string;
}

interface SubjectOptions {
    value: ToDoItem['subject'];
    label: string;
}


// Define the options for the Select component
const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];

const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];

const subjectOptions = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
];


const ToDoList: React.FC = () => {
    const [list, setList] = useState<ToDoItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [hideChecked, setHideChecked] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<PriorityOptions | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<SubjectOptions | null>(null);
    

    useEffect(() => {
        const init = async () => {
            try {
                const db = await openDB('todo-db', 1, {
                    upgrade(db) {
                        db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
                    },
                });
                const todos = await db.getAll('todos');

                setList(todos);
            } catch (error) {
                console.error("Error initializing database:", error);
            }
        };
        init();
        console.log("init");
    }, []);

    const addItem = async () => {
        const newItem: Omit<ToDoItem, 'id'> = {
            text: inputValue,
            checked: false,
            status: 'pending',
            priority: selectedPriority ? selectedPriority.value : 'low', // Default to 'low' if not selected
            subject: selectedSubject ? selectedSubject.value : 'home', // Default to 'home' if not selected
        };
        console.log("Adding item:", newItem);
        setInputValue('');
        try {
            const db = await openDB('todo-db', 1);
            const tx = db.transaction('todos', 'readwrite');
            const store = tx.objectStore('todos');
            const request = store.add(newItem);
    
            request.then(async (id) => {
                const completeItem: ToDoItem = { ...newItem, id: id as number };
                setList([...list, completeItem]);
            }).catch((error) => {
                console.error("Error adding item:", error);
            });
    
            await tx.done;
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const toggleItemChecked = async (id: number) => {
        try {
            const db = await openDB('todo-db', 1);
            const transaction = db.transaction('todos', 'readwrite');
            const objectStore = transaction.objectStore('todos');
            const item = list.find(item => item.id === id);
    
            if (item) {
                item.checked = !item.checked;
                await objectStore.put(item);

                // Updates the UI
                const updatedList = list.map(function(currentItem) {
                    if(currentItem.id == item.id) {
                        return item;
                    }
                    return currentItem;
                })

                setList(updatedList);
            }
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const updateStatus = async (id: number,  selectedOption: StatusOption) => {
        
        try {
            const status = selectedOption.value;
            const db = await openDB('todo-db', 1);
            const transaction = db.transaction('todos', 'readwrite');
            const objectStore = transaction.objectStore('todos');
            const item = list.find(item => item.id === id);
    
            if (item) {                
                item.status = status;
                await objectStore.put(item);
                // Updates the UI
                const updatedList = list.map(function(currentItem) {
                    if(currentItem.id == item.id) {
                        return item;
                    }
                    return currentItem;
                })

                setList(updatedList);
            }
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };
    

    const removeItem = async (id: number) => {
        try {
            const db = await openDB('todo-db', 1);
            const transaction = db.transaction('todos', 'readwrite');
            const objectStore = transaction.objectStore('todos');
            const request = objectStore.delete(id); // Ensure the key type matches
    
            transaction.oncomplete = () => {
                // Update the UI here after the transaction completes
                const newList = list.filter(item => item.id !== id);
                setList(newList);
            };
        } catch (error) {
            console.error("Error opening database or starting transaction:", error);
        }
    };

    const filteredList = hideChecked ? list.filter(item => !item.checked) : list;
    const filteredByStatus = selectedStatus 
        ? filteredList.filter(item => item.status === selectedStatus.value) 
        : filteredList;


    return (
        
    );
};

export default ToDoList;