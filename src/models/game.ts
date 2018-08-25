export class Game {
    constructor(
        public _id: string,
        public opponent: string,
        public competition: string,
        public date: Date,
        public rating: number,
        public minutes: number,
        public effect: Array<{
            statistics: string,
            value: number,
            specificStat: boolean 
        }>
    ){}
}