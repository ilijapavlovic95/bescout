import { Player } from "./player";
import { Game } from "./game";

export class Report {

    public user: string;

    constructor(
        public _id: string,
        public startDate: Date,
        public endDate: Date,
        public player: Player,
        public skills: Array<{
            title: string,
            value: number
        }>,
        public games: Array<Game>,
        public likes: string[],
        public dislikes: string[]
    ) { }
}