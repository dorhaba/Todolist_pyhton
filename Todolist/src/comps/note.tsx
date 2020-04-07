import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { GoTrashcan, GoListUnordered } from "react-icons/go";
import Todo from "./todo";
import myNotes from "./funcNote";
import { observer } from "mobx-react";

interface Iprops {
    id: number;
}

interface Istate {
    todoName: string;
    checked: boolean;
}

@observer
class Notes extends React.Component<Iprops, Istate> {
    constructor(props: Readonly<Iprops>) {
        super(props);
        this.state = {
            todoName: "",
            checked: false
        }
        myNotes.getInitialData()
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeComp = this.changeComp.bind(this);
    }

    handleChange(event: any) {
        this.setState({
            todoName: event.target.value
        });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        myNotes.addTodo(this.props.id, this.state.todoName);
        this.setState({ todoName: "" })
    }

    changeComp(idTodo: number) {
        myNotes.markComplete(this.props.id, idTodo);
        this.setState({ checked: !this.state.checked })
        console.log(idTodo);
    }

    changList() {

    }

    render() {
        return (

            <div>
                <div className="card bg-success text-white my-4 " >
                    <div className="card-body" >
                        <div className="d-flex justify-content-between">
                            <h4 className="card-title">{myNotes.notes[this.props.id].noteName} </h4>
                            < div className="row" >
                                <label>{myNotes.notes[this.props.id].lastUpdated}</label>
                                < GoListUnordered />
                                <GoTrashcan color="red"
                                    onClick={(e) => { myNotes.deleteNote(myNotes.notes[this.props.id].id) }} />
                            </div>
                        </div>
                        <div>
                            <form className="form-group" onSubmit={this.handleSubmit}>
                                <div className="row" >
                                    <div className="col" >
                                        <input type='text' placeholder="Name Task"
                                            className="form-control" value={this.state.todoName}
                                            onChange={this.handleChange} />
                                    </div>
                                    < button type="submit" className="btn btn-info " > Add </button>
                                </div>
                            </form>
                            {myNotes.notes[this.props.id].todos.map((todo) => {
                                return (
                                    <Todo
                                        key={todo.todoId}
                                        idTodo={todo.todoId}
                                        idNote={this.props.id}
                                        changeComp={this.changeComp} />);
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}


export default Notes;