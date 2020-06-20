from fastapi import FastAPI
from fastapi.responses import JSONResponse
import pyodbc
import json
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class INotes(BaseModel):
    id: int
    noteName: str
    todos: list
    dateCreated: str
    lastUpdated: str
    openList: bool = True


cnn = pyodbc.connect(
    'DRIVER = {SQL Server};DSN=DSQL;SERVER=DESKTOP-TS5ILJ2\\SQLEXPRESS;DATABASE=Todolist;UID=dorJob;PWD=1234;')
cursor = cnn.cursor()


@app.get("/note")
def ReadData():
    jsonFinished = []
    jsonFile = {}
    todosList = []
    notesList = []
    cursor.execute('SELECT id FROM Todolist.dbo.INotes')
    for rows in cursor:
        notesList.append(rows)
    for note in notesList:
        cursor.execute(
            'SELECT * FROM Todolist.dbo.ITodo WHERE todoId=any(SELECT idTodo FROM Todolist.dbo.NoteTodo where idNote=' + str(note.id) + ')')
        for row in cursor:
            todo = {}
            if (row.completed == 1):
                flag = True
            else:
                flag = False
            todo = {
                "todoId": int(row.todoId),
                "title": str(row.title),
                "completed": bool(flag)}
            todosList.append(todo)
        cursor.execute(
            'SELECT * FROM Todolist.dbo.INotes WHERE id = ?', str(note.id))
        nt = cursor.fetchone()
        if (nt.openList == 1):
            flag = True
        else:
            flag = False
        jsonFile = {
            "id": int(nt.id),
            "noteName": str(nt.noteName),
            "todos": todosList,
            "dateCreated": nt.dateCreated,
            "lastUpdated": nt.lastUpdated,
            "openList": bool(flag)}
        jsonFinished.append(jsonFile)
        todosList = []
    ToServer = json.dumps(jsonFinished)
    return JSONResponse(content=ToServer)


@app.post("/note")
async def create_Note(note: INotes):
    cursor.execute(
        "INSERT INTO Todolist.dbo.INotes( noteName, dateCreated, lastUpdated, openList) VALUES (?,?,?,?)", note.noteName, note.dateCreated, note.lastUpdated, note.openList)
    cnn.commit()


@app.delete("/note/{id}")
async def DeleteNoteFromDataBase(id: int):
    print("dcdc")
    cursor.execute(
        "SELECT idTodo FROM Todolist.dbo.NoteTodo WHERE idNote =?", id)
    todoIds = cursor.fetchall()
    cursor.execute(
        "DELETE FROM Todolist.dbo.NoteTodo WHERE idNote=?", id)
    cnn.commit()
    for x in todoIds:
        cursor.execute(
            "DELETE FROM Todolist.dbo.ITodo WHERE todoId=?", x.idTodo)
        cnn.commit()
    cursor.execute("DELETE FROM Todolist.dbo.INotes WHERE id=?", id)
    cnn.commit()
    print(cursor)


@app.post("/note/addNote")
async def updateDataBase(note: INotes):
    print("updateDataBase")
    todos = note.todos
    cursor.execute(
        "INSERT INTO Todolist.dbo.ITodo(title,completed) VALUES (?,?)", todos[-1]["title"], todos[-1]["completed"])
    cnn.commit()
    cursor.execute(
        "SELECT Max(todoId) FROM Todolist.dbo.ITodo")
    max_id = cursor.fetchone()[0]
    print(max_id)
    print(note.id)
    cursor.execute(
        "INSERT INTO Todolist.dbo.NoteTodo(idNote,idTodo) VALUES (?,?)", note.id, max_id)
    cnn.commit()


@app.post("/note/update")
async def updateComp(note: INotes):
    print('INSIDE updateComp')
    todos = note.todos
    if (todos[-1]["completed"]):
        flag = 0
    else:
        flag = 1
    cursor.execute("UPDATE Todolist.dbo.ITodo SET completed =" +
                   str(flag) + " WHERE todoId = " + str(todos[-1]["todoId"]))
    cnn.commit()


@app.post("/note/updateNote")
async def updateOpenList(note: INotes):
    if (note.openList):
        flag = 0
    else:
        flag = 1
    cursor.execute("UPDATE Todolist.dbo.INotes SET openList =" +
                   str(flag)+" WHERE id = "+str(note.id))
    cnn.commit()
