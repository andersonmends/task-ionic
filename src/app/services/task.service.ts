import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [];

  constructor() { }

  public getTasks(): Task[] {
    console.log(this.tasks);
    
    return this.tasks;
  }

  public addTask(value: string, date: string) {
    date = date.replace("-", "/");
    let task: Task = { value: value, date: new Date(date), done: false };
    this.tasks.push(task);
    this.setToStorage();

  }
  public deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.setToStorage();
  }

  public updateTask(index: number, value: string, date: string) {
    let task: Task = this.tasks[index];
    task.value = value;
    date = date.replace("-", "/");
    task.date = new Date(date);
    this.tasks.splice(index, 1, task);
    this.setToStorage();
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
}


interface Task {
  value: string;
  date: Date;
  done?: boolean;
}

