import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Users } from '../services/users';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less']
})
export class UsersListComponent implements OnInit, OnDestroy {
  public usersOrigin: Array<User>;
  public users$: Observable<User[]>;
  public users: Array<User>;
  public usersArrNotChanged: boolean = true;

  private ngUnsubscribe  = new Subject();
  
  constructor() { }

  ngOnInit() {
    this.getUsers();
    this.users$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.users = data;
    });
  }
  ngOnDestroy() {
    // when the component get's destroyed, unsubscribe all the subscriptions
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
}
  public compareArrays(): void {
    this.usersArrNotChanged = JSON.stringify(this.users) === JSON.stringify(this.usersOrigin);
  }
  private getUsers(): void {
    this.usersOrigin = Users.map(user => {return {id: user.id, name: user.name, email: user.email }});
    this.users$ = of(Users);
  }
}
