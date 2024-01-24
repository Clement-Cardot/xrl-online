export class ProjectReport {

    constructor(
        public lastXrlGraph: string,
        public linearGraphs?: { [key: string]: string },
        public completeLinearGraph?: string,
        public compareWithInitialGraph?: string,
        public compareTwoLastGraphs?: string,
        public lang?: string,
    ) { }
}