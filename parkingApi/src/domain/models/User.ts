import { Role } from './Role';
import { Parking } from './Parking';

export class User {
    constructor(
        public id: string,
        public name: string,
        public document: string,
        public password?: string,
        public email?: string,
        public role?: Role,
        public parking?: Parking[]
    ) {}
}
