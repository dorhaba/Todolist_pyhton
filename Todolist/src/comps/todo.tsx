import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { GoCheck } from "react-icons/go";
import myNotes from './funcNote';

interface Iprops {
    idTodo: number;
    idNote: number;
    changeComp(idTodo: number): void;
}

class Todo extends React.Component<Iprops>{

    render() {
        const { idNote, idTodo } = this.props;
        const todo = myNotes.notes[idNote].todos[idTodo];
        return (
            <div>
                <div className="list-group" >
                    <div className=
                        {(!todo.completed) ?
                            "list-group-item list-group-item-action list-group-item-info d-flex justify-content-between align-items-center" :
                            "list-group-item list-group-item-action list-group-item-danger d-flex justify-content-between align-items-center"
                        }>
                        <h5 > {todo.title}</h5>
                        <div>
                            <GoCheck color="Green" onClick={() => this.props.changeComp(idTodo)} />
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default Todo;