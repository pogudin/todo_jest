class TodoApp {
    constructor() {
        this.storage = localStorage;
        this.todoKey = 'todos';
        this._loadTodos();
        this.todoListElement = document.getElementById('todo-list');
        this.addButton = document.getElementById('add-button');
        console.log("addButton:", this.addButton);
        this.taskInput = document.getElementById('task-description');
        this.dateInput = document.getElementById('due-date');
        this.clearCompletedButton = document.getElementById('clear-completed-button');
        this.addButton.addEventListener('click', () => this.addTodo());
        this.clearCompletedButton.addEventListener('click', () => this.clearCompletedTasks());

        this.renderTodos();
    }

    _loadTodos() {
        const storedTodos = this.storage.getItem(this.todoKey);
        this.todos = storedTodos ? JSON.parse(storedTodos) : [];
    }

    _saveTodos() {
        this.storage.setItem(this.todoKey, JSON.stringify(this.todos));
    }

    addTodo() {
        const description = this.taskInput.value.trim();
        const dueDate = this.dateInput.value;
        if (description) {
            const newTodo = {
                id: Date.now(),
                description,
                dueDate,
                status: 'pending',
            };
            this.todos.push(newTodo);
            this._saveTodos();
            this.taskInput.value = '';
            this.dateInput.value = '';
            this.renderTodos();
        }
    }

    getTodos() {
        return [...this.todos];
    }

    getTodo(id) {
        return this.todos.find((todo) => todo.id === Number(id)) || null;
    }

    updateTodo(id, updates) {
        const todoIndex = this.todos.findIndex((todo) => todo.id === Number(id));
        if (todoIndex !== -1) {
            this.todos[todoIndex] = { ...this.todos[todoIndex], ...updates };
            this._saveTodos();
            this.renderTodos();
            return true;
        }
        return false;
    }

    deleteTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== Number(id));
        this._saveTodos();
        this.renderTodos();
        return true;
    }

    toggleStatus(id) {
        const todo = this.getTodo(id);
        if (todo) {
            this.updateTodo(id, { status: todo.status === 'pending' ? 'completed' : 'pending' });
        }
    }

    clearCompletedTasks() {
        this.todos = this.todos.filter((todo) => todo.status !== 'completed');
        this._saveTodos();
        this.renderTodos();
    }

    renderTodos() {
        this.todoListElement.innerHTML = '';
        this.todos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.classList.add('todo-item');
            if (todo.status === 'completed') {
                listItem.classList.add('completed');
            }

            const descriptionSpan = document.createElement('span');
            descriptionSpan.classList.add('description');
            descriptionSpan.textContent = todo.description;

            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('due-date');
            dueDateSpan.textContent = todo.dueDate ? `(Due: ${todo.dueDate})` : '';
            dueDateSpan.style.fontSize = '0.8em';
            dueDateSpan.style.color = 'gray';
            dueDateSpan.style.marginLeft = '5px';

            const statusSpan = document.createElement('span');
            statusSpan.classList.add('status');
            statusSpan.textContent = `Status: ${todo.status}`;

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            const toggleButton = document.createElement('button');
            toggleButton.textContent = todo.status === 'pending' ? 'Complete' : 'Undo';
            toggleButton.addEventListener('click', () => this.toggleStatus(todo.id));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));

            actionsDiv.appendChild(toggleButton);
            actionsDiv.appendChild(deleteButton);

            listItem.appendChild(descriptionSpan);
            listItem.appendChild(dueDateSpan);
            listItem.appendChild(statusSpan);
            listItem.appendChild(actionsDiv);

            this.todoListElement.appendChild(listItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});