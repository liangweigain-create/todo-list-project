export default class Project {
    #id;
    #todos;
    #title;
    #isDefault;

    constructor(title, id = null) {
        this.#id = id ? id : `Project-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        this.title = title;
        this.#todos = [];
        this.#isDefault = false;
    }
    get title() {
        return this.#title;
    }
    set title(val) {
        this.#validateTitle(val);
        this.#title = val;
    }
    get id() {
        return this.#id;
    }
    get todos() {
        return this.#todos;
    }
    get isDefault() {
        return this.#isDefault;
    }
    //title参数验证
    #validateTitle(val) {
        if (typeof val !== 'string' || val.trim() === '') {
            throw new Error('不能传入空的项目名称！');
        }
    }
    toggleDefault() {
        this.#isDefault = !this.#isDefault;
    }
    setIsDefault(val) {
        this.#isDefault = val;
    }
    addTodo(todoObj) {
        //是否验证todo有效性？
        this.#todos.push(todoObj);
    }
    deleTodo(todoId) {
        //不需要验证todo是否存在于该project中，因为filter即使没有找到也不会报错
        this.#todos = this.#todos.filter(todo => todo.id !== todoId);
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            todos: this.todos // This often needs recursive toJSON calls in real apps
        };
    } 
}
