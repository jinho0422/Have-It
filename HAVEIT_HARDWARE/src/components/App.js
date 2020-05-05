import React, {Component} from 'react';
import PageTemplate from './PageTemplate';
import InputTodo from './InputTodo';
import TodoList from './TodoList';


const initialTodos = new Array(5000).fill(0).map(
    (foo, index) => ({id: index, text:`일정${index}`, done: false})
);

class App extends Component {
    state = {
        input: '',
        todos: [
 
        ]
    };

    onChangeHandler = (e) => {
        const { value } = e.target;
        this.setState({
            input: value,
        });
    };

    id = 1;
    getId = () => ++this.id;

    dataInsertHandler = () => {
        const { todos, input } = this.state;
        if (input) {
            const newTodos = [
                ...todos,
                {
                    id: this.getId(),
                    text: input,
                    done: false
                }
            ];

            this.setState({
                todos: newTodos,
                input: ""
            });
        }
    };

    detaRemoveHandler = (id) => {
        const { todos } = this.state;
        const index = todos.findIndex(todo => todo.id === id);

        const newTodos = [
            ...todos.slice(0, index),
            ...todos.slice(index + 1, todos.length)
        ];
        this.setState({
            todos: newTodos
        })
    };

    toggleHandler = (id) => {
        const { todos } = this.state;
        const index = todos.findIndex(todo => todo.id === id);

        const toggled = {
            ...todos[index],
            done: !todos[index].done
        };

        const newTodos = [
            ...todos.slice(0, index),
            toggled,
            ...todos.slice(index + 1, todos.length)
        ];
        this.setState({
            todos: newTodos
        })
    };


    render() {
        const {input, todos} = this.state;
        const {onChangeHandler, dataInsertHandler,  toggleHandler, dataRemoveHandler} = this;

        return (
            <PageTemplate>
                <InputTodo onChange={onChangeHandler} value ={input} onInsert={dataInsertHandler}/>
                <TodoList todos={todos} onToggle={toggleHandler} onRemove={dataRemoveHandler}/>
            </PageTemplate>

        );
    }
}

export default App;