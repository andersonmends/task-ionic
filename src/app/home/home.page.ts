import { Component } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { TaskService } from '../services/task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public type: string = "pending";
  public tasks: Observable<any[]>;

  constructor(private alertController: AlertController,
    public taskService: TaskService,
    public toastController: ToastController,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.tasks = this.taskService.getFromFirestone();
  }


  async presentAlertDelete(id) {
    const alert = await this.alertController.create({
      header: 'Excluir Tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => this.taskService.deleteOnFireStore(id)
        }
      ]
    });

    await alert.present();
  }

  async presentAlertUpdate(id, task) {
    const alert = await this.alertController.create({
      header: 'Atualizar Tarefa?',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'tarefa',
          value: task.value
        },
        {
          name: 'date',
          type: 'date',
          min: '2017-03-01',
          max: '2025-12-31',
          value: task.date ? task.date.toDate().getFullYear() + "-" +
            ((task.date.toDate().getMonth() + 1) < 10 ? "0" + task.date.toDate().getMonth() + 1 : task.date.toDate().getMonth() + 1)
            + "-" +
            ((task.date.toDate().getDate()) < 10 ? "0" + task.date.toDate().getDay() : task.date.toDate().getDate()):""
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Atualizar',
          handler: (alertData) => {
            if (alertData.task != "")
              this.taskService.updateTask(id, alertData.task, alertData.date,task.done);
            else {
              this.presentToast();
              this.presentAlertUpdate(id, task);
            }
          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlertAdd() {
    const alert = await this.alertController.create({
      header: 'Adicionar Tarefa',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'tarefa'
        },
        {
          name: 'date',
          type: 'date',
          min: '2017-03-01',
          max: '2025-12-31'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: (alertData) => {
            if (alertData.task != "")
              this.taskService.addTask(alertData.task, alertData.date);
            else {
              this.presentToast();
              this.presentAlertAdd();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Preencha tarefa!",
      duration: 2000
    });
    toast.present();
  }

  async presentPopover(e: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: e,
      translucent: true
    });

    return await popover.present();

  }
}
