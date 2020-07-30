import { Injectable } from '@nestjs/common';
import { User } from '../types';

@Injectable()
export class UserService {

    allUsers(): User[] {
        return [
            {
                id: 1,
                email: 'john.doe@example.com',
                password: 'password123'
            },
            {
                id: 1,
                email: 'jane.doe@example.com',
                password: 'password321Password'
            },
            {
                id: 1,
                email: 'some.user@testing.com',
                password: 'testing20200801'
            }
        ];
    }
}
