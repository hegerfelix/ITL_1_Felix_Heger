import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonContent,
  IonIcon, IonInput, IonSpinner,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, createOutline, personAddOutline,
  refreshOutline, checkmarkOutline
} from 'ionicons/icons';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonContent,
    IonIcon, IonInput, IonSpinner,
  ],
})
export class Tab1Page implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';

  newUser: User = { firstName: '', lastName: '', email: '' };
  editingUser: User | null = null;

  private avatarColors = [
    'linear-gradient(135deg, #6c63ff, #3dc2ff)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #ffecd2, #fcb69f)',
    'linear-gradient(135deg, #667eea, #764ba2)',
  ];

  constructor(
    private userService: UserService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ trashOutline, createOutline, personAddOutline, refreshOutline, checkmarkOutline });
  }

  ngOnInit() {
    this.loadUsers();
  }

  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not connect to server. Is the backend running on port 3000?';
        this.loading = false;
      }
    });
  }

  addUser() {
    if (!this.newUser.firstName || !this.newUser.email) {
      this.showToast('Please fill in First Name and Email.', 'warning');
      return;
    }
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.showToast('User created! ✅', 'success');
        this.newUser = { firstName: '', lastName: '', email: '' };
        this.loadUsers();
      },
      error: () => this.showToast('Error creating user ❌', 'danger')
    });
  }

  startEdit(user: User) {
    this.editingUser = { ...user };
  }

  saveEdit() {
    if (!this.editingUser || !this.editingUser.id) return;
    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: () => {
        this.showToast('User updated! ✅', 'success');
        this.editingUser = null;
        this.loadUsers();
      },
      error: () => this.showToast('Error updating user ❌', 'danger')
    });
  }

  cancelEdit() {
    this.editingUser = null;
  }

  async deleteUser(user: User) {
    const alert = await this.alertCtrl.create({
      header: 'Delete User',
      message: `Delete ${user.firstName} ${user.lastName}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete', role: 'destructive',
          handler: () => {
            this.userService.deleteUser(user.id!).subscribe({
              next: () => {
                this.showToast('User deleted 🗑️', 'success');
                this.loadUsers();
              },
              error: () => this.showToast('Error deleting user ❌', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2200, color, position: 'bottom',
      cssClass: 'modern-toast'
    });
    await toast.present();
  }
}
