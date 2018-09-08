export class User {
    public password: string;
    public token: string;
    public _id: string;

    public getToken() {
        return this.token;
    }
    public setToken(token) {
        this.token = token;
    }
    
    constructor(
        public username: string,
        public email: string,
        public fullname: string,
        public role: string
    ) {}
}