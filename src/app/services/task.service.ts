import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [];
  private collectionName: string = "Task";

  constructor(private firestore: AngularFirestore) { }

  public getTasks(): Task[] {
    console.log(this.tasks);

    return this.tasks;
  }

  public addTask(value: string, date: string) {
    let task: Task;
    if (date != '') {
      date = date.replace("-", "/");
      task = { value: value, date: new Date(date), done: false };
    } else {
      task = { value: value, done: false };
    }
    // date = date.replace("-", "/");
    // task = { value: value, date: new Date(date), done: false };
    this.tasks.push(task);
    this.addToFirestore(task);
    this.setToStorage();

  }
  public deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.setToStorage();
  }

  public updateTask(id, value: string, date: string, done: boolean) {
    let task: Task;
    if (date != '') {
      date = date.replace("-", "/");
      task = { value: value, date: new Date(date), done: done };
    } else {
      task = { value: value, done: done };
    }
    this.updateOnFirestore(id, task);
  }

  public async setToStorage() {
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify(this.tasks)
    });
    console.log(this.tasks);
  };

  public async getFromStorage() {
    const resp = await Preferences.get({ key: 'tasks' });
    let tempTasks: any[] = JSON.parse(resp.value);
    if (!tempTasks != null) {
      for (let t of tempTasks) {
        if (t.date != null) {
          t.date = t.date.substring(0, 10)
          t.date = t.date.replace("-", "/")
        } else {
          t.date = ""
        }
        let task: Task = { value: t.value, date: new Date(t.date), done: false };
        this.tasks.push(task);
      }
    }
  }

  public updateTaskDone(id, task) {
    task.done = !task.done;
    this.updateOnFirestore(id, task);
  }

  public addToFirestore(record: Task) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  public getFromFirestone() {
    return this.firestore.collection(this.collectionName).valueChanges({ idField: "id" });
  }

  public updateOnFirestore(recordId, record: Task) {
    this.firestore.doc(this.collectionName + "/" + recordId).update(record);
  }

  public deleteOnFireStore(recordId) {
    this.firestore.doc(this.collectionName + "/" + recordId).delete();
  }
}


export interface Task {
  value: string;
  date?: Date;
  done: boolean;
}

