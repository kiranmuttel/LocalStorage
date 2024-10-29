import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user = { name: '', email: '' }; // Model to bind the form
  users: any[] = []; // Array to store list of users
  isEdit = false; // Flag to indicate if we are editing an existing user
  editIndex: number = -1; // Initialize editIndex to -1 to avoid undefined errors

  constructor() {}

  ngOnInit() {
    this.loadUsers(); // Load users from storage on initialization
  }

  // Save or update a user
  async saveForm() {
    if (this.isEdit) {
      // Update existing user
      this.users[this.editIndex] = { ...this.user };
      this.isEdit = false;
    } else {
      // Add new user
      this.users.push({ ...this.user });
    }

    // Save the updated user list to local storage
    await Storage.set({
      key: 'users',
      value: JSON.stringify(this.users),
    });

    // Reset the form
    this.user = { name: '', email: '' };
    this.editIndex = -1; // Reset editIndex
    this.loadUsers(); // Reload the user list
  }

  // Load users from local storage
  async loadUsers() {
    const { value } = await Storage.get({ key: 'users' });
    if (value) {
      this.users = JSON.parse(value);
    }
  }

  // Edit user from the list
  editUser(index: number) {
    this.user = { ...this.users[index] }; // Pre-fill form with user data
    this.isEdit = true; // Switch to edit mode
    this.editIndex = index; // Store the index of the user being edited
  }

  // Delete user from the list
  async deleteUser(index: number) {
    this.users.splice(index, 1); // Remove the user from the array

    // Update local storage with the modified user list
    await Storage.set({
      key: 'users',
      value: JSON.stringify(this.users),
    });

    this.loadUsers(); // Reload the user list
  }
}
