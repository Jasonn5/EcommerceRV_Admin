import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserDatastoreService } from './user-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userDatastoreService: UserDatastoreService) { }

  public addUser(user) {
    var newUser = new User();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.email = user.email;
    newUser.roles = user.selectedRoles;

    return this.userDatastoreService.add(newUser)
  }

  public updateUser(userToEdit: User, user) {
    userToEdit.username = user.username;
    userToEdit.firstName = user.firstName;
    userToEdit.lastName = user.lastName;
    userToEdit.givenName = user.givenName;
    userToEdit.email = user.email;
    userToEdit.isEnabled = user.isEnabled;
    userToEdit.roles = user.selectedRoles;

    return this.userDatastoreService.update(userToEdit);
  }

  public listUsers() {
    return this.userDatastoreService.list();
  }

  public findById(id) {
    return this.userDatastoreService.findById(id);
  }

  public changePassword(user: User, credentials) {
    user.oldPassword = credentials.oldPassword;
    user.password = credentials.password;
    user.confirmPassword = credentials.confirmPassword;

    return this.userDatastoreService.changePassword(user);
  }
}
