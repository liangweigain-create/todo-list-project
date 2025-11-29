import * as appLogic from "./appLogic.js";

export function renderProjectList() {
    const projectList = document.querySelector('.project-list');
    projectList.innerHTML = '';
    const defaultList = document.querySelector('.defaults-list');
    defaultList.innerHTML = '';

    const allProjects = appLogic.getAllProjects();
    const defaultsArr = allProjects.filter((p) => p.isDefault);
    const projectsArr = allProjects.filter((p) => !p.isDefault);
    //验证数组有效性
    if (!Array.isArray(projectsArr)) {
        throw new Error('invalid projects array');
    }
    //创建并添加项目按钮
    projectsArr.forEach((project) => {
        const projectbtn = document.createElement('li');
        projectbtn.classList.add('active-project');
        projectbtn.textContent = project.title;
        projectbtn.id = project.id
        projectList.appendChild(projectbtn);
    })
    //创建并添加默认项目按钮
    defaultsArr.forEach((d) => {
        const dprojectBtn = document.createElement('li');
        dprojectBtn.classList.add('active-project');
        dprojectBtn.textContent = d.title;
        dprojectBtn.id = d.id;
        defaultList.appendChild(dprojectBtn);
    })
    console.log(`currentprojectid:${appLogic.getCurrentProject().id}`)
}

export function renderTodoList() {
    const todoContainer = document.querySelector('#todos-container'); // Matches HTML ID
    todoContainer.innerHTML = '';
    console.log('hahahaha')
    // Update the Big Header Title
    const currentProject = appLogic.getCurrentProject();
    const titleHeader = document.querySelector('#project-title');
    const countHeader = document.querySelector('#task-count');
    
    if (!currentProject) throw new Error(`error! ${currentProject}`);

    console.log('1')
    titleHeader.textContent = currentProject.title;
    countHeader.textContent = `${currentProject.todos.length} tasks remaining`;

    currentProject.todos.forEach(todo => {
        console.log('2')
        const card = document.createElement('div');
        card.classList.add('todo-card'); // CSS: Main card style
        card.classList.add(`priority-${todo.priority}`); // CSS: Color border
        
        // Handle Completion Visuals
        if (todo.isCompleted) {
            card.classList.add('completed');
        }

        // 1. Checkbox (Custom circle)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.isCompleted;
        checkbox.classList.add('todo-checkbox');
        // Store ID for the listener later
        checkbox.dataset.todoId = todo.id; 

        // 2. Title & Date Container
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('todo-content');
        
        const titleP = document.createElement('p');
        titleP.textContent = todo.title;
        titleP.classList.add('todo-title');
        const dateP = document.createElement('p');
        dateP.textContent = todo.dueDate || 'No Date';
        dateP.classList.add('todo-date');
        const descP = document.createElement('p');
        descP.textContent = todo.description;
        descP.classList.add('todo-desc');
        contentDiv.appendChild(titleP);
        contentDiv.appendChild(dateP);
        contentDiv.appendChild(descP);

        // 3. Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑'; // Or use an icon class
        deleteBtn.classList.add('icon-btn');
        deleteBtn.dataset.todoId = todo.id; // Store ID!

        // Assemble
        card.appendChild(checkbox);
        card.appendChild(contentDiv);
        card.appendChild(deleteBtn);

        todoContainer.appendChild(card);
    });
    console.log('currentproject is gone')
}

