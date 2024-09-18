import { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import './Todo.css';

function Todo() {
  // State to toggle between viewing "Todo" and "Completed" tasks
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  
  // State to store all incomplete tasks
  const [allTodos, setTodos] = useState([]);
  
  // States to handle new task input values
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  // State to store all completed tasks
  const [completedTodos, setCompletedTodos] = useState([]);
  
  // State to track the currently edited task index
  const [currentEdit, setCurrentEdit] = useState("");
  
  // State to hold the current values of the task being edited
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  // Function to add a new task
  const handleAddTodo = () => {
    // Create a new task object
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    // Add the new task to the list of all todos
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);

    // Save the updated list to localStorage
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  // Function to delete a task by index
  const handleDeleteTodo = index => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1); // Remove the task at the specified index

    // Update the state and save the updated list to localStorage
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  // Function to mark a task as completed
  const handleComplete = index => {
    // Get current date and time
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1; // January is 0!
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = `${dd}-${mm}-${yyyy} at ${h}:${m}:${s}`;

    // Create a completed task object with the completion timestamp
    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    // Add the completed task to the list of completed tasks
    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);

    // Remove the task from the list of all todos
    handleDeleteTodo(index);

    // Save the updated list of completed tasks to localStorage
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  // Function to delete a completed task by index
  const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1); // Remove the task at the specified index

    // Update the state and save the updated list to localStorage
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  // useEffect to load todos and completed tasks from localStorage on initial render
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo); // Load saved todos
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo); // Load saved completed todos
    }
  }, []);

  // Function to start editing a task
  const handleEdit = (ind, item) => {
    setCurrentEdit(ind); // Set the index of the task being edited
    setCurrentEditedItem(item); // Set the current values of the task being edited
  };

  // Function to update the title of the task being edited
  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  // Function to update the description of the task being edited
  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  // Function to save the edited task
  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem; // Update the task with the edited values
    setTodos(newToDo);
    setCurrentEdit(""); // Clear the edit mode
  };

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          {/* Input for new task title */}
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>

          {/* Input for new task description */}
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>

          {/* Button to add new task */}
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        {/* Toggle buttons for viewing Todo or Completed tasks */}
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {/* Displaying Todo tasks */}
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                // Edit mode for the task
                return (
                  <div className='edit__wrapper' key={index}>
                    <input 
                      placeholder='Updated Title' 
                      onChange={(e) => handleUpdateTitle(e.target.value)} 
                      value={currentEditedItem.title}  
                    />
                    <textarea 
                      placeholder='Updated Description' 
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)} 
                      value={currentEditedItem.description}  
                    />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div> 
                );
              } else {
                // Normal view mode for the task
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(index)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit  
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?" 
                      />
                    </div>
                  </div>
                );
              }
            })}

          {/* Displaying Completed tasks */}
          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>

                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Todo;
