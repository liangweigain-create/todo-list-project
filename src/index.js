import "./styles/index.css";
import * as domInterface from "./modules/domInterface.js";
import * as appLogic from "./modules/appLogic.js";
import { isValid, parseISO, format, addDays, isBefore } from 'date-fns';

appLogic.init();
domInterface.renderProjectList();
domInterface.renderTodoList();


const sidebar = document.querySelector('.sidebar');
const addBtn = document.getElementById('btn-add-project');
const projectDialog = document.querySelector('#dialog-project');
const projectInput = document.querySelector('#project-name-input');
const projectForm = document.querySelector('#form-project');
const cancelBtn = document.querySelectorAll('.btn-secondary')

//添加项目按钮点击事件
sidebar.addEventListener('click', (e) => {
    const clickedBtn = e.target;
    if (clickedBtn.tagName !== 'LI') return;
    const currentProject = appLogic.getCurrentProject();
    if (clickedBtn.id === currentProject.id) return;
    appLogic.setCurrentProjectId(clickedBtn.id);
    domInterface.renderTodoList();
})
//添加新增项目按钮点击事件
addBtn.addEventListener('click', () => {
    projectDialog.showModal();
})

projectForm.addEventListener('submit', (e) => {
    // 1. PREVENT the browser from submitting to a server (refreshing page)
    e.preventDefault(); 
    const projectName = projectInput.value.trim();
    
    // 校验项目名称
    if (!projectName) {
        alert('请输入项目名称！');
        return;
    }
    if (appLogic.getAllProjects().some(p => p.title === projectName)) {
        alert('该项目名称已存在！');
        return;
    }

    // 创建项目并更新 UI
    const newProject = appLogic.createNewProject(projectName);
    domInterface.renderProjectList();
    appLogic.setCurrentProjectId(newProject.id);
    domInterface.renderTodoList();
    projectForm.reset();
    projectDialog.close();
});

//添加todo点击事件
const todoDialog = document.querySelector('#dialog-todo');
const todoForm = document.querySelector('#form-todo');
const addTodoBtn = document.getElementById('btn-add-todo');

addTodoBtn.addEventListener('click', () => {
    todoDialog.showModal();
})

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(todoForm);
    const data = Object.fromEntries(formData.entries());
    const title = data.title;
    const desc = data.description;
    const dueDate = parseISO(data["due-date"]);
    const priority = data.priority;
    appLogic.createNewTodo(title, desc, dueDate, priority);
    domInterface.renderTodoList();
    todoForm.reset();
    todoDialog.close();
})

cancelBtn.forEach((btn,i) => {
    btn.addEventListener('click', () => {
        projectForm.reset();
        projectDialog.close();
        todoForm.reset();
        todoDialog.close();
    })
})
//删除todo事件
const todoContainer = document.querySelector('.todos-container');

todoContainer.addEventListener('click', (e) => {
    const todoId = e.target.dataset.todoId;
    if (e.target.classList.contains('icon-btn')){
        appLogic.deleteTodo(todoId);
        domInterface.renderTodoList();
    }
    if (e.target.classList.contains('todo-checkbox')) {
        appLogic.toggleCheckbox(todoId);
        domInterface.renderTodoList();
    }
})
//checked事件
