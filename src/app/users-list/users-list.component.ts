import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../models/user';
import { Observable, of, from, Subject, throwError, BehaviorSubject } from 'rxjs';
import { map, tap, mergeMap, toArray, filter, takeUntil, catchError } from 'rxjs/operators';
import { Users } from '../services/users';
import { v4 as uuid } from 'uuid';

interface UserView extends User {
  selected?: boolean;
}
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UsersListComponent implements OnInit, OnDestroy {

  private usersSubject_ = new BehaviorSubject<UserView[]>(
    Users.map(u => ({ ...u, selected: false }))
  );
  public newUser: User = {
    id: uuid(),
    email: "azero79@gmail.com",
    name: "Aslan"
  };
  public users$: Observable<UserView[]> = this.usersSubject_.asObservable();
  public usersChanged$: Observable<Boolean>;

  get getUsers() {
    return this.usersSubject_.getValue();
  }
  set setUsers(users: UserView[]) {
    this.usersSubject_.next(users);
  }

  constructor() {
    this.usersChanged$ = this.users$.pipe(
      map(users => {
        const reset = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
        return JSON.stringify(reset) !== JSON.stringify(Users);
      })
    );
  }

  ngOnInit() { }

  public userTrackByFn = (i, user) => user.id;

  public onEmailInput(event, userId): void {
    const user = this.getUsers.find(u => u.id === userId);
    if (user) {
      user.email = event.target.value;
      this.setUsers = [...this.getUsers];
    }
  }

  public addUser(): void {
    Users.push({ ...this.newUser, id: uuid() });
    this.setUsers = [...Users];
  }

  public saveChanges(): void {
    console.log(this.getUsers);
    this.setUsers = [...this.getUsers];
  }

  ngOnDestroy() { }

}
