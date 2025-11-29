import Project from "./Project.js";
import Todo from "./Todo.js";

let projects = [];
let currentProjectId = null;
/**
 * 第一次进入，如果数据库中没有数据，应该默认显示inbox（default project）
 * 如果数据库中有数据，应该读取数据并创建对应的todos 和projects
 */
export function init() {
    //后续学习如何从localstorage获取用户的本地数据
    //获取数据后创建todos和projects的逻辑
    //假设没有任何数据，代表用户第一次进入app，应该创建初始project供用户快速创建todos
    if (projects.length === 0) {
        //判断没有数据，则创建初始project-inbox
        const inbox = new Project('Inbox');
        inbox.toggleDefault();
        projects.push(inbox);
        currentProjectId = inbox.id;
    }
}

/**
 * 
 * @param {string} title index.js后续需要在用户点击提交新增项目表单的按钮是触发这个事件并传入title
 * 参数校验交给index，只负责创建project 
 * 创建完成后应该直接将currentprojectid设置为新建的项目id
 */
export function createNewProject(title) {
    const newProject = new Project(title);
    projects.push(newProject);
    currentProjectId = newProject.id;
    console.log(`project ${newProject.title} created`);
    //保存数据。。
    return newProject;
}

export function deleteProject(projectId) {
    //不能删除默认的inbox项目
    const targetProject = projects.find(p => p.id === projectId)
    if (targetProject.isDefault) throw new Error(`Can't delete the inbox!`);
    //从项目群中删除
    projects = projects.filter(project => project.id !== projectId);
    //如果当前项目正在被删除，切换当前项目id为默认inbox
    currentProjectId = currentProjectId === projectId ? projects.find(p => p.isDefault).id : currentProjectId;
}

export function createNewTodo(title, description, dueDate, priority) {
    //通过projectid获取当前的项目
    const currentProject = projects.find(p => p.id === currentProjectId);
    if (!currentProject) throw new Error('currentProject not found');
    const newTodo = new Todo({
        title,
        description,
        dueDate,
        priority,
        addedToProjectId: currentProjectId
    })

    currentProject.addTodo(newTodo);
    console.log(currentProject.todos);
    //保存数据。。。。
    return newTodo;
}

export function getCurrentProject() {
    if (!currentProjectId) {
        throw new Error('currentProject buu not found');
    }
    return projects.find(p => p.id === currentProjectId);
}

export function setCurrentProjectId(projectId) {
    const targetProject = projects.find(p => p.id === projectId);
    if (!targetProject) {throw new Error('targetProject not found!')};
    currentProjectId = targetProject.id;
}
export function getAllProjects() {
    return projects;
}
