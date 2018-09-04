export class User {
    public password: string;
    private token: string;
    public _id: string;

    getToken() {
        return this.token;
    }
    setToken(token) {
        this.token = token;
    }
    
    constructor(
        public username: string,
        public email: string,
        public fullname: string,
        public role: string
    ) {}
}