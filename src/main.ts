import { LoxRunner } from "./lib/runner.js";
import { ParseArgsOptionsConfig, parseArgs } from "node:util";

const runner = new LoxRunner();

const options = {
    file: { 
	type: "string", 
	short: "f"
    },
// So cringe, had to add this line cuz typescript thinks type: "string" is type: string
} satisfies ParseArgsOptionsConfig;

const { values } = parseArgs({options});

if (values.file == null) {
    runner.runPrompt();
} else {
    runner.runFile(values.file);
}
