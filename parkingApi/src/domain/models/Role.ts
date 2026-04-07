import { User } from './User';

export class Role {
    constructor(
        public id: string,
        public name: string,
        public users?: User[]
    ) {}
}
