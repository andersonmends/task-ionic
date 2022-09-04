import { Component } from '@angular/core';
// import { AlertController } from '@ionic/angular/providers/alert-controller';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  type: string = "pending";

  constructor(private alertController: AlertController,
    public taskService: TaskService,
    public toastController: ToastController,
    public popoverController: PopoverController
  ) { }


  async presentAlertDelete(index: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => this.taskService.deleteTask(index)
        }
      ]
    });

    await alert.present();
  }

  async presentAlertUpdate(index: number, task) {
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
          value: task.date.getFullYear() +
            "-" +
            ((task.date.getMonth() + 1) < 10 ? "0" + task.date.getMonth() + 1 : task.date.getMonth() + 1) +
            "-" +
          ((task.date.getDay()+1) <10 ? "0"+task.date.getDay():task.date.getDay())
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
              this.taskService.updateTask(index, alertData.task, alertData.date);
             else {
              this.presentToast();
              this.taskService.updateTask(index, alertData.task, alertData.date);
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

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: e,
    });

    return await popover.present();
  
  }
}
