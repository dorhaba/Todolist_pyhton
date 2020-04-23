import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Notes from "./note";
import myNotes from './funcNote';
import { observer } from "mobx-react";

interface Iprops {

}


@observer
class Todolist extends Component<Iprops> {

    render() {

        return (
            <div className="container-sm p-4 my-4  bg-dark text-white" >
                {myNotes.notes.map((note) => {
                    return (
                        <Notes key={note.id} id={myNotes.findNote(note.id)} />
                    );
                })}
            </div>
        );
    }
}

export default Todolist;