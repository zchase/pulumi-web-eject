import { Argv, ArgumentsCamelCase } from "yargs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

interface Command {
    name: string;
    description: string;
    options?: (argv: Argv) => Argv;
    handler: (args: ArgumentsCamelCase) => void;
}

export class CLI {
    private cli: Argv;

    constructor() {
        this.cli = yargs(hideBin(process.argv));
    }

    addCommand(cmd: Command) {
        cmd.options = cmd.options ? cmd.options : (yargs) => yargs;
        this.cli.command(cmd.name, cmd.description, cmd.options, cmd.handler);
    }

    init() {
        this.cli.demandCommand(1).parse();
    }
}
