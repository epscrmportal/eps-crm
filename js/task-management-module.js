/**
 * TASK MANAGEMENT MODULE
 * Provides Kanban board, task management, reminders, and filters
 */

window.TaskModule = {
    tasks: [],
    
    init: function() {
        console.log('📋 Task Management Module Initialized');
        this.injectUI();
        this.loadFromStorage();
        this.renderBoard();
    },
    
    injectUI: function() {
        const mainContent = document.querySelector('.container');
        if (!mainContent) return;
        
        const taskHTML = `
            <div id="taskManagementPanel" style="display: none; margin-top: 30px;">
                <h2>📋 Task Management</h2>
                
                <div style="margin: 20px 0; display: flex; gap: 10px;">
                    <input type="text" id="taskFilterInput" placeholder="Filter tasks..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    <select id="taskPriorityFilter" style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="">All Priorities</option>
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="Low">🟢 Low</option>
                    </select>
                    <button onclick="TaskModule.openAddTaskModal()" class="btn-success" style="padding: 10px 20px;">➕ New Task</button>
                </div>
                
                <div id="kanbanBoard" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px;">
                    <div id="todoBucket" style="background: #f0f0f0; border-radius: 8px; padding: 15px; min-height: 400px;">
                        <h3>📝 To Do (0)</h3>
                        <div id="todoTasks" style="display: flex; flex-direction: column; gap: 10px;"></div>
                    </div>
                    
                    <div id="inProgressBucket" style="background: #fffbeb; border-radius: 8px; padding: 15px; min-height: 400px;">
                        <h3>⚙️ In Progress (0)</h3>
                        <div id="inProgressTasks" style="display: flex; flex-direction: column; gap: 10px;"></div>
                    </div>
                    
                    <div id="doneBucket" style="background: #f0fdf4; border-radius: 8px; padding: 15px; min-height: 400px;">
                        <h3>✅ Done (0)</h3>
                        <div id="doneTasks" style="display: flex; flex-direction: column; gap: 10px;"></div>
                    </div>
                </div>
            </div>
            
            <!-- Add Task Modal -->
            <div id="addTaskModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 1000; min-width: 400px;">
                <h3>➕ Create New Task</h3>
                <form onsubmit="TaskModule.addTask(event)">
                    <div style="margin: 15px 0;">
                        <label>Task Title *</label>
                        <input type="text" id="taskTitle" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    
                    <div style="margin: 15px 0;">
                        <label>Description</label>
                        <textarea id="taskDescription" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 80px;"></textarea>
                    </div>
                    
                    <div style="margin: 15px 0; display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label>Priority</label>
                            <select id="taskPriority" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                                <option value="Low">🟢 Low</option>
                                <option value="Medium" selected>🟡 Medium</option>
                                <option value="High">🔴 High</option>
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <label>Due Date</label>
                            <input type="date" id="taskDueDate" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0; display: flex; gap: 10px;">
                        <button type="submit" class="btn-success">✅ Create Task</button>
                        <button type="button" onclick="TaskModule.closeAddTaskModal()" class="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        mainContent.insertAdjacentHTML('afterend', taskHTML);
        
        // Add modal background
        const modalBg = document.createElement('div');
        modalBg.id = 'taskModalBackground';
        modalBg.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999;';
        modalBg.onclick = () => this.closeAddTaskModal();
        document.body.appendChild(modalBg);
    },
    
    openAddTaskModal: function() {
        document.getElementById('addTaskModal').style.display = 'block';
        document.getElementById('taskModalBackground').style.display = 'block';
    },
    
    closeAddTaskModal: function() {
        document.getElementById('addTaskModal').style.display = 'none';
        document.getElementById('taskModalBackground').style.display = 'none';
    },
    
    addTask: function(event) {
        event.preventDefault();
        
        const task = {
            id: Date.now(),
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value,
            status: 'todo',
            createdAt: new Date(),
            reminders: []
        };
        
        this.tasks.push(task);
        this.saveToStorage();
        this.renderBoard();
        this.closeAddTaskModal();
        
        // Clear form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskPriority').value = 'Medium';
        document.getElementById('taskDueDate').value = '';
        
        // Notify
        if (window.ModuleManager) {
            window.ModuleManager.notify('success', 'Task Created', `"${task.title}" added to your tasks`);
        }
    },
    
    renderBoard: function() {
        const todoTasks = this.tasks.filter(t => t.status === 'todo');
        const inProgressTasks = this.tasks.filter(t => t.status === 'in_progress');
        const doneTasks = this.tasks.filter(t => t.status === 'done');
        
        // Update buckets
        document.querySelector('#todoBucket h3').textContent = `📝 To Do (${todoTasks.length})`;
        document.querySelector('#inProgressBucket h3').textContent = `⚙️ In Progress (${inProgressTasks.length})`;
        document.querySelector('#doneBucket h3').textContent = `✅ Done (${doneTasks.length})`;
        
        // Render tasks
        document.getElementById('todoTasks').innerHTML = this.renderTasks(todoTasks);
        document.getElementById('inProgressTasks').innerHTML = this.renderTasks(inProgressTasks);
        document.getElementById('doneTasks').innerHTML = this.renderTasks(doneTasks);
    },
    
    renderTasks: function(tasks) {
        return tasks.map(task => `
            <div style="
                background: white;
                padding: 12px;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                cursor: move;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333;">${task.title}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">${task.description || ''}</div>
                        ${task.dueDate ? `<div style="font-size: 11px; color: #999; margin-top: 4px;">Due: ${task.dueDate}</div>` : ''}
                    </div>
                    <div style="display: flex; gap: 5px; margin-left: 10px;">
                        <span style="
                            display: inline-block;
                            padding: 3px 8px;
                            border-radius: 3px;
                            font-size: 11px;
                            font-weight: bold;
                            background: ${task.priority === 'High' ? '#fee' : task.priority === 'Medium' ? '#fef3c7' : '#f0fdf4'};
                            color: ${task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#d97706' : '#059669'};
                        ">${task.priority}</span>
                    </div>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    ${task.status !== 'done' ? `<button onclick="TaskModule.moveTask(${task.id}, 'done')" style="flex: 1; padding: 5px; background: #10b981; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;">✅ Done</button>` : ''}
                    <button onclick="TaskModule.deleteTask(${task.id})" style="flex: 1; padding: 5px; background: #ef4444; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    },
    
    moveTask: function(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            this.saveToStorage();
            this.renderBoard();
        }
    },
    
    deleteTask: function(taskId) {
        if (confirm('Delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveToStorage();
            this.renderBoard();
        }
    },
    
    saveToStorage: function() {
        try {
            localStorage.setItem('crm_tasks', JSON.stringify(this.tasks));
        } catch (e) {
            console.log('localStorage not available');
        }
    },
    
    loadFromStorage: function() {
        try {
            const saved = localStorage.getItem('crm_tasks');
            if (saved) {
                this.tasks = JSON.parse(saved);
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    }
};

// Initialize when module loads
window.TaskModule.init();

console.log('✅ Task Management Module Ready');
