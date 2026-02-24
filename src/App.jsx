import { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";
import { use } from "react";

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return props.tasks;
      }
    }
    return props.tasks;
  });
  // ================ GEOLOCATION ================
 const geoFindMe = () => {
 if (!navigator.geolocation) {
 console.log("Geolocation is not supported by your browser");
 } else {
 console.log("Locating…");
 navigator.geolocation.getCurrentPosition(success, error);
 }
 };
 const success = (position) => {
 const latitude = position.coords.latitude;
 const longitude = position.coords.longitude;
 console.log(latitude, longitude);
 console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
 console.log(`Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
 locateTask(lastInsertedId, {
 latitude: latitude,
 longitude: longitude,
 error: "",
 });};
 const error = () => {
 console.log("Unable to retrieve your location");
 };
   // ================ GEOLOCATION ================

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [filter, setFilter] = useState("All");
// new hook for geolocation
const [lastInsertedId, setLastInsertedId] = useState(""); 

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
 

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) return { ...task, completed: !task.completed };
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  // this function replaces the editTask function, it locates the task by ID and updates its location property with the geolocation data
 function locateTask(id, location) {
 console.log("locate Task", id, " before");
 console.log(location, tasks);
 const locatedTaskList = tasks.map((task) => {
 // if this task has the same ID as the edited task
 if (id === task.id) {
 //
 return { ...task, location: location };
 }
 return task;
 });
 console.log(locatedTaskList);
 setTasks(locatedTaskList);
}

  // edit function backup in case I mess this up
  // function editTask(id, newName) {
  //   const editedTaskList = tasks.map((task) => {
  //     if (id === task.id) return { ...task, name: newName };
  //     return task;
  //   });
  //   setTasks(editedTaskList);
  // }

  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        latitude={task.latitude}
        longitude={task.longitude}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        locateTask={locateTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = { 
      id: id, 
      name: name, 
      completed: false, 
      location: {latitude: "##", longitude: "##", error: "##"}, };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe} /> {""}
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        aria-labelledby="list-heading"
        className="todo-list stack-large stack-exception"
        role="list"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;