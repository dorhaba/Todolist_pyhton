import { observable, IObservableArray } from 'mobx';
import axios from 'axios';

export class ITodo {
    todoId: number = 0;
    title: string = '';
    completed: boolean = false;
}

export class INotes {
    _id?: string;
    id: number = 0;
    noteName: string = '';
    todos: ITodo[] = [];
    dateCreated: Date = new Date();
    lastUpdated: Date = new Date();
}
const url = 'http://localhost:3010/note';
class funcNotes {


    @observable notes: IObservableArray<INotes> = observable([]);
    @observable maxNotes: number = 10;
    @observable currentNotesCount = 0;

    public async getInitialData() {
        console.log("1");
        const homePage = await axios.get('http://localhost:3010/note/');
        console.log("2");
        myNotes.notes = homePage.data;
        console.log("3");
    }

    public async deleteNoteToServer(id: number) {
        await axios.delete('http://localhost:3010/note/' + id);

    }

    public async addNoteToServer(note: INotes) {
        await axios.post(url, note);
        this.getInitialData();
    }

    public async updateNoteToServer(note: INotes) {
        await axios.patch('http://localhost:3010/note/' + note._id, note);
        console.log("dcdcdc");
    }

    public addNote(noteName: string) {
        if (this.currentNotesCount < this.maxNotes) {
            const newNote = new INotes();
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


    public deleteNote(id: number) {
        this.notes.replace([...this.notes.filter(note => note.id !== id)]);
        this.currentNotesCount = this.currentNotesCount - 1;
        this.deleteNoteToServer(id);
    }

}
const myNotes = new funcNotes();
export default myNotes;