import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getData, postData, putData, deleteData } from './services/ApiServices.js'; // Importing the ApiServices
import './App.css';

function App() {
  const { control, handleSubmit, reset } = useForm();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedId, setId] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null); // Clear the error message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts or error changes
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null); // Clear the success message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts or success changes
    }
  }, [success]);


  const getAllTaskList = async () => {
    const url = "task/list/get/all";
    try {
      let result = await getData(url);
      setTasks(result.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        completed: task.isCompleted,
      })));
    } catch (e) {
      setError(e.response.data.message);
    }
  }

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    getAllTaskList();
  }, []);

  const onSubmit = async (data) => {
    if (selectedId != null) {
      const obj = {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        isCompleted: data.completed,
      }
      const url = `task/list/${selectedId}`;
      try {
        let result = await putData(url, obj);
        closeModal();
        setSuccess(result);
      } catch (e) {
        console.log('====================================');
        console.log(e);
        console.log('====================================');
        setSuccess("");
        setShowForm(false);
        setError(e.response.data.message);
      } finally {
        getAllTaskList()
      }
    } else {
      const url = "task/list/";
      try {
        let result = await postData(url, data);
        closeModal();
        setSuccess(result);
      } catch (e) {
        setShowForm(false);
        setError(e.response.data.message);
      } finally {
        getAllTaskList();
      }
    }
    reset();
  };

  const handleEdit = async (id) => {
    const url = `task/list/${id}`;
    try {
      let result = await getData(url);
      if (result && Object.keys(result).length) {
        reset({
          id: result._id,
          title: result.title,
          description: result.description,
          deadline: result.deadline ? result.deadline.split('T')[0] : '',
          completed: result.isCompleted
        });
      }
      setShowForm(true);
    } catch (e) {
      setShowForm(false);
      setError(e.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    const url = `task/list/${id}`;
    try {
      let result = await deleteData(url);
      setSuccess(result);
    } catch (e) {
      setSuccess("");
      setError(e.response.data.message);
    } finally {
      getAllTaskList();
    }
  };

  const openModal = () => {
    setShowForm(true);
  }

  const closeModal = () => {
    setShowForm(false);
    reset();
    setError('');
    setSuccess('');
  }

  return (
    <div className="App">
      <h1>Task Manager</h1>
      {error && <div className="error-message">{error}</div>} {/* Displaying the error message */}
      {success && <div className="success-message">{success}</div>} {/* Displaying the success message */}

      <button className="add-button" onClick={openModal}>
        {showForm ? 'Close Form' : 'Add Task'}
      </button>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <label>
                Title:
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => <input type="text" {...field} required />}
                />
              </label>
              <label>
                Description:
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Description is required' }}
                  render={({ field }) => <input type="text" {...field} required />}
                />
              </label>
              <label>
                Deadline:
                <Controller
                  name="deadline"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Deadline is required' }}
                  render={({ field }) => <input type="date" {...field} required />}
                />
              </label>
              {selectedId && (
                <label>
                  Status:
                  <Controller
                    name="completed"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          type="radio"
                          value={true}
                          {...field}
                          onChange={() => {
                            field.onChange(true);
                          }}
                          checked={field.value === true}
                        />{' '}
                        Yes
                        <input
                          type="radio"
                          value={false}
                          {...field}
                          onChange={() => {
                            field.onChange(false);
                          }}
                          checked={field.value === false}
                        />{' '}
                        No
                      </>
                    )}
                  />
                </label>
              )}

              <button type="submit">
                {selectedId != null ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      <h2>Task List</h2>
      <div className="task-list">
        {(tasks && tasks.length) ? (tasks.map((task, index) => (
          <div className="task-card" key={index}>
            <div className="task-details">
              <h3>{task.title}</h3>
              <p className="description">{task.description}</p>
              <div className="deadline">Deadline: {task.deadline}</div>
            </div>
            <div className="task-actions">
              <button className="edit-button" onClick={() => { handleEdit(task.id); setId(task.id) }}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
            <div className={`status-badge ${task.completed ? 'completed' : 'not-completed'}`}>
              {task.completed ? 'Completed' : 'Not Completed'}
            </div>
          </div>
        ))) : <h2>No data found</h2>}
      </div>
    </div>
  );
}

export default App;
