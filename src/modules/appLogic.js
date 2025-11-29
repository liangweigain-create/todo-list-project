import Project from "./Project.js";
import Todo from "./Todo.js";

let projects = [];
let currentProjectId = null;
/**
 * 第一次进入，如果数据库中没有数据，应该默认显示inbox（default project）
 * 如果数据库中有数据，应该读取数据并创建对应的todos 和projects
 */
export function init() {
    const savedProjects = localStorage.getItem('todoProjects');
    const savedCurrentId = localStorage.getItem('currentProjectId');
    
    if (savedProjects) {
        // 从本地存储恢复数据
        const parsedProjects = JSON.parse(savedProjects);
        projects = parsedProjects.map(projectData => {
            const project = new Project(projectData.title, projectData.id);
            project.setIsDefault(projectData.isDefault)
            
            // 恢复todos
            projectData.todos.forEach(todoData => {
                const todo = new Todo({
                    id: todoData.id,
                    title: todoData.title,
                    description: todoData.description,
                    dueDate: todoData.dueDate ? new Date(todoData.dueDate) : null,
                    priority: todoData.priority,
                    addedToProjectId: todoData.addedToProjectId
                });
                todo.isCompleted = todoData.isCompleted;
                project.addTodo(todo);
            });
            return project;
        });
        
        if (savedCurrentId) {
            currentProjectId = savedCurrentId;
        }
    } else {
        // 首次加载创建默认项目
        const inbox = new Project('Inbox');
        inbox.toggleDefault();
        projects.push(inbox);
        currentProjectId = inbox.id;
        saveToLocalStorage(); // 保存初始数据
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
    //保存数据。。
    saveToLocalStorage();
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
    saveToLocalStorage();
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
    //保存数据。。。。
    saveToLocalStorage();
    return newTodo;
}
export function deleteTodo(todoId) {
    const currentProject = projects.find(p => p.id === currentProjectId);
    if (!currentProject) throw new Error('currentProject not found');
    currentProject.deleTodo(todoId);
    saveToLocalStorage();
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
    saveToLocalStorage();
}
export function getAllProjects() {
    return projects;
}

//切换完成状态
export function toggleCheckbox(todoId) {
    const currentProject = projects.find(p => p.id === currentProjectId);
    if (!currentProject) throw new Error('currentProject not found');
    const targetTodo = currentProject.todos.find(todo => todo.id === todoId);
    targetTodo.toggleCompleted();
    saveToLocalStorage();
}
// 在appLogic.js中添加
function saveToLocalStorage() {
    // 由于类实例不能直接序列化，需要转换为普通对象
    const serializedProjects = projects.map(project => ({
        id: project.id,
        title: project.title,
        isDefault: project.isDefault,
        todos: project.todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate ? todo.dueDate.toISOString() : null, // 日期序列化
            priority: todo.priority,
            isCompleted: todo.isCompleted,
            addedToProjectId: todo.addedToProjectId
        }))
    }));
    
    localStorage.setItem('todoProjects', JSON.stringify(serializedProjects));
    localStorage.setItem('currentProjectId', currentProjectId);
}