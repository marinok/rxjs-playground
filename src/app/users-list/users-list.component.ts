import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { Observable, of, from, Subject, throwError } from 'rxjs';
import { map, mergeMap, toArray, filter, takeUntil, catchError } from 'rxjs/operators';
import { Users } from '../services/users';
import { v4 as uuid } from 'uuid';
interface UserView extends User {
  selected?: boolean;
}
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less']
})
export class UsersListComponent implements OnInit, OnDestroy {
  public selectedUsers: Array<UserView>;
  public users$: Observable<UserView[]>;
  public users: Array<UserView>;
  public usersView: Array<UserView>;
  public usersArrNotChanged: boolean = true;

  private usersOrigin: Array<UserView>;
  private ngUnsubscribe = new Subject();

  constructor() { }

  ngOnInit() {
    this.getUsers();
    this.users$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.users = data;
    });

    this.getUsersView().subscribe(item => {
      console.log('item', item);
      this.usersView = item;
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  public compareArrays(): void {
    this.usersArrNotChanged = JSON.stringify(this.users) === JSON.stringify(this.usersOrigin);
  }
  public saveChanges(): void {
    this.usersOrigin = this.users.map(user => ({ id: user.id, name: user.name, email: user.email }));
    this.compareArrays();
  }
  public addUser(): void {
    Users.push({
      id: uuid(),
      name: 'Lisa Nuor',
      email: 'lisa@domainname.com'
    });
  }
  public updateSelectedArr(): void {
    this.selectedUsers = this.usersView.filter(data => data.selected === true);
  }
  private getUsers(): void {
    this.usersOrigin = Users.map(user => ({ id: user.id, name: user.name, email: user.email }));
    this.users$ = of(Users);
  }
  private getUsersView(): Observable<UserView[]> {
    return of(Users).pipe(
      mergeMap(item => item),
      map(user => {
        return { ...user, selected: false };
      }),
      toArray(),
      catchError(error => throwError('Error ' + error)));
  }

}
