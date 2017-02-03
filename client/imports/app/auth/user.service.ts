import { Injectable } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../../../../both/models/user.model';

@Injectable()
export class UserService extends MeteorComponent {
  currentUser$ = new BehaviorSubject<User>(null);
  currentUserId: string;

  constructor() { super(); }
  
  // You can move this part into constructor(), but for me, to call it explicitly is more clear to me.
  // Also, next example you will see for some data, you only need subscribe when you need. lo del chino
  subscribeCurrentUser() {
    this.subscribe('users.currentUser', () => {
      this.autorun(() => {
        this.currentUser$.next(<User>Meteor.user());    // <User> here is to convert the type Meteor.User to my custom interface User
        this.currentUserId = Meteor.userId();
      });
    });
  }
}