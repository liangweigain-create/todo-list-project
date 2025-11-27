import "./styles/index.css";
import * as domInterface from "./modules/domInterface.js";
import * as appLogic from "./modules/appLogic.js";

appLogic.init();
domInterface.renderProjectList();
domInterface.renderTodoList();


const sidebar = document.querySelector('.sidebar');
const currentProject = appLogic.getCurrentProject();
const projectDialog = document.querySelector('#dialog-project');
const projectInput = document.querySelector('#project-name-input');
const projectForm = document.querySelector('#form-project');
const cancelBtn = document.querySelector('.btn-secondary')

sidebar.addEventListener('click', (e) => {
    const clickedBtn = e.target;
    switch (clickedBtn.className) {
        case 'active-project': 
            if (clickedBtn.id === currentProject.id) {
                return;
            }
            appLogic.setCurrentProjectId(clickedBtn.id);
            domInterface.renderTodoList();
            break;
        case 'icon-btn':
            projectDialog.showModal();
            break;
        default:
            return 'nothing';
    }
})

projectForm.addEventListener('submit', (e) => {
    // 1. PREVENT the browser from submitting to a server (refreshing page)
    e.preventDefault(); 
    
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
        appLogic.createNewProject(projectName);
        domInterface.renderProjectList();
        projectForm.reset();
        projectDialog.close();
});

cancelBtn.addEventListener('click', () => {
    projectForm.reset();
    projectDialog.close();
})