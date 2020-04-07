import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import myNotes from './funcNote';

interface Iprops {

}

interface Istate {
    noteName: string;

}

class Form extends React.Component<Iprops, Istate> {
    constructor(props: Readonly<Iprops>) {
        super(props);
        this.state = {
            noteName: ""

        }
        myNotes.getInitialData()
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: any) {
        this.setState({
            noteName: event.target.value
        });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        myNotes.addNote(this.state.noteName);
        this.setState({ noteName: "" })
        console.log(event);
        console.log(this.state.noteName);
    }
    render() {
        return (
            <div className="container-sm p-4 my-4  bg-dark text-white" >
                <h1>Todo - List </h1>
                < form className="form-group" onSubmit={this.handleSubmit} >
                    <div className="row" >
                        <div className="col" >
                            <input type='text' placeholder="Name Task" className="form-control"
                                value={this.state.noteName} onChange={this.handleChange} />
                        </div>
                        < button type="submit" className="btn btn-success " >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        );

    }

}
export default Form;