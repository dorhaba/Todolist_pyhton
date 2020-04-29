import { observable, IObservableArray } from 'mobx';
import axios from 'axios';

export class ITodo {
    todoId: number = 0;
    title: string = '';
    completed: boolean = false;
}

export class INotes {
    id: number = 0;
    noteName: string = '';
    todos: ITodo[] = [];
    dateCreated: Date = new Date();
    lastUpdated: Date = new Date();
    openList: boolean = false;
}

class funcNotes {
    @observable notes: IObservableArray<INotes> = observable([]);
    @observable maxNotes: number = 10;
    @observable currentNotesCount = 0;

    public async getInitialData() {
        await axios.get('https://my-json-server.typicode.com/dorhaba/NoteJson/note')
            .then(response => {
                console.log(response)
                myNotes.notes = response.data;
            })
            .catch(error => {
                console.log(error)
            });
    }

    public async deleteNoteToServer(id: number) {
        await axios.delete('https://my-json-server.typicode.com/dorhaba/NoteJson/note/' + id)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            });
    }

    public async addNoteToServer(note: INotes) {
        await axios.post('https://my-json-server.typicode.com/dorhaba/NoteJson/note', note)
            .then(response => {
                console.log(response);
                this.getInitialData();
                console.log("add");
            })
            .catch(error => {
                console.log(error)
            });;

    }

    public async updateNoteToServer(note: INotes) {
        await axios.patch('https://my-json-server.typicode.com/dorhaba/NoteJson/note/' + note.id, note)
            .then(response => {
                console.log(response);
                console.log("update");
            })
            .catch(error => {
                console.log(error)
            });
    }

    public addNote(noteName: string) {
        if (this.currentNotesCount < this.maxNotes) {
            const newNote = new INotes();
            console.log(noteName + "cdccd");
            if (myNotes.notes.length === 0) {
                newNote.id = 0;
            }
            else {
                newNote.id = myNotes.notes[myNotes.notes.length - 1].id + 1;
            }
            newNote.noteName = noteName;
            this.notes.push(newNote);
            this.currentNotesCount = this.currentNotesCount + 1;
            this.addNoteToServer(newNote);
        }
    }

    public findNote(id: number) {
        return this.notes.findIndex(note => note.id === id);
    }

    public addTodo(id: number, todoName: string) {
        const newTodo = new ITodo();
        newTodo.todoId = myNotes.notes[id].todos.length;
        newTodo.title = todoName;
        this.notes[id].todos.push(newTodo);
        this.updateNoteToServer(myNotes.notes[id]);
    }


    public markComplete(idNote: number, idTodo: number) {
        myNotes.notes[idNote].todos[idTodo].completed = !myNotes.notes[idNote].todos[idTodo].completed;
        this.updateNoteToServer(myNotes.notes[idNote]);
    }

    public OpenList(idNote: number) {
        myNotes.notes[idNote].openList = !myNotes.notes[idNote].openList;
        this.updateNoteToServer(myNotes.notes[idNote]);
    }

    public deleteNote(id: number) {
        this.notes.replace([...this.notes.filter(note => note.id !== id)]);
        this.currentNotesCount = this.currentNotesCount - 1;
        this.deleteNoteToServer(id);
    }

}
const myNotes = new funcNotes();
export default myNotes;