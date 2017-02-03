import { Pipe, PipeTransform } from '@angular/core';
import { Meteor } from 'meteor/meteor';

import { User } from '../../../../both/models/user.model';

@Pipe({
  name: 'displayName'
})
export class DisplayNamePipe implements PipeTransform {
  transform(user: User): string {
    if (!user) {
      return '';
    }

    if (user.profile.firstName) {
      return user.profile.firstName;
    }

    if (user.emails) {
      return user.emails[0].address;
    }

    return '';
  }
}
