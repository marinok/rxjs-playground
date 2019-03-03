import { v4 as uuid } from 'uuid';
import { User } from '../models/user';

export const Users: Array<User> = [
    {
        id: uuid(),
        name: 'Bob Fisher',
        email: 'bob@domainname.com'
    },
    {
        id: uuid(),
        name: 'Jack Murral',
        email: ''
    },
    {
        id: uuid(),
        name: 'Sarah Connor',
        email: ''
    },
];