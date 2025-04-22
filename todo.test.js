// __tests__/TodoApp.test.js

// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      })
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
  // Mock DOM elements
  document.getElementById = jest.fn(id => {
    if (id === 'todo-list') return document.createElement('ul');
    if (id === 'add-button') {
      const button = document.createElement('button');
      button.id = 'add-button';
      return button;
    }
    if (id === 'task-description') {
      const input = document.createElement('input');
      input.id = 'task-description';
      return input;
    }
    if (id === 'due-date') {
      const input = document.createElement('input');
      input.id = 'due-date';
      return input;
    }
    if (id === 'clear-completed-button') {
      const button = document.createElement('button');
      button.id = 'clear-completed-button';
      return button;
    }
    return null;
  });
  
  // Import the TodoApp class - you might need to adjust the import based on your setup
  // For the workshop, you might need to modify your TodoApp code to be importable
  // const { TodoApp } = require('../path/to/todo-app');
  
  describe('TodoApp', () => {
    let todoApp;
    
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
      localStorageMock.clear();
      
      // Create a new instance of TodoApp
      todoApp = new TodoApp();
    });
  
    test('should initialize with empty todos if none in storage', () => {
      expect(todoApp.todos).toEqual([]);
    });
  
    test('should load todos from localStorage on initialization', () => {
      // Setup initial data in localStorage
      const mockTodos = [
        { id: 1, description: 'Test todo', dueDate: '2023-12-31', status: 'pending' }
      ];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockTodos));
      
      // Re-initialize TodoApp to test loading
      todoApp = new TodoApp();
      
      expect(todoApp.todos).toEqual(mockTodos);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('todos');
    });
  
    test('should add a new todo', () => {
      // Setup
      todoApp.taskInput.value = 'New task';
      todoApp.dateInput.value = '2023-12-31';
      
      // Execute
      todoApp.addTodo();
      
      // Assert
      expect(todoApp.todos.length).toBe(1);
      expect(todoApp.todos[0].description).toBe('New task');
      expect(todoApp.todos[0].dueDate).toBe('2023-12-31');
      expect(todoApp.todos[0].status).toBe('pending');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  
    test('should toggle todo status', () => {
      // Setup - add a todo first
      todoApp.todos = [{ id: 1, description: 'Test todo', status: 'pending' }];
      
      // Execute
      todoApp.toggleStatus(1);
      
      // Assert
      expect(todoApp.todos[0].status).toBe('completed');
      
      // Execute again to toggle back
      todoApp.toggleStatus(1);
      
      // Assert
      expect(todoApp.todos[0].status).toBe('pending');
    });
  
    test('should delete a todo', () => {
      // Setup
      todoApp.todos = [{ id: 1, description: 'Test todo', status: 'pending' }];
      
      // Execute
      const result = todoApp.deleteTodo(1);
      
      // Assert
      expect(result).toBe(true);
      expect(todoApp.todos.length).toBe(0);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  
    test('should clear completed tasks', () => {
      // Setup
      todoApp.todos = [
        { id: 1, description: 'Pending task', status: 'pending' },
        { id: 2, description: 'Completed task', status: 'completed' }
      ];
      
      // Execute
      todoApp.clearCompletedTasks();
      
      // Assert
      expect(todoApp.todos.length).toBe(1);
      expect(todoApp.todos[0].status).toBe('pending');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  
    // More advanced test - testing the event listener setup
    test('should set up event listeners in constructor', () => {
      // Check if event listeners were added
      expect(todoApp.addButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      expect(todoApp.clearCompletedButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });