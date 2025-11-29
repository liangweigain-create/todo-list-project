export default class Todo {
    #title;
    #addedToProjectId;
    #dueDate;
    #priority;
    #id;

    constructor({
        title,
        description = '',
        dueDate = null,
        priority = 'low',
        addedToProjectId = "Project-testing",
        id = null
    }) {
        this.#id = id ? id : `todo-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        this.title = title;
        this.description = description.trim();
        this.dueDate = dueDate;
        this.priority = priority;
        this.isCompleted = false;
        this.addedToProjectId = addedToProjectId;
    }

    //setter & getter methods
    get id() {
        return this.#id;
    }
    get title() {
        return this.#title;
    }
    set title(val) {
        this.#validateTitle(val);
        this.#title = val;
    }
    get addedToProjectId() {
        return this.#addedToProjectId;
    }
    set addedToProjectId(val) {
        this.#validateProjectId(val);
        this.#addedToProjectId = val;
    }
    get dueDate() {
        return this.#dueDate;
    }
    set dueDate(val) {
        this.#validateDueDate(val);
        this.#dueDate = val;
    }
    get priority() {
        return this.#priority;
    }
    set priority(val) {
        this.#validatePriority(val);
        this.#priority = val;
    }

    //数据校验私有方法
    #validateTitle(title) {
        if (typeof title !== 'string' || title.trim() === '') {
            throw new Error('Title must be a string and not an empty value!')
        }
    }
    #validateProjectId(projectId) {
        if (
            !projectId || 
            typeof projectId !== 'string' ||
            !projectId.startsWith('Project-')
        ){
            throw new Error('Project ID is invalid!')
        }
    }
    #validateDueDate(val) {
        if (val !== null && !(val instanceof Date) || (val instanceof Date && isNaN(val.getTime()))){
            throw new Error('dueDate must be a valid date object or null')
        }
    }
    #validatePriority(val) {
        const priorityLevels = ['high','medium','low']
        if (!priorityLevels.includes(val)) {
            throw new Error('priority must be either high, medium and low');
        }
    }

    //切换完成状态
    toggleCompleted() {
        this.isCompleted = !this.isCompleted;
    }

    // Change the method to accept an object
    editTodo({ title, description, dueDate, priority }) {
        // If 'title' is provided in the object, update it. If not, keep existing.
        if (title !== undefined) this.title = title;
        if (description !== undefined) this.description = description;
        if (dueDate !== undefined) this.dueDate = dueDate;
        if (priority !== undefined) this.priority = priority;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            isCompleted: this.isCompleted,
            addedToProjectId: this.addedToProjectId
        }
    }
}   
