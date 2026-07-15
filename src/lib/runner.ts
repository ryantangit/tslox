import * as readline from "node:readline/promises";
import { readFileSync } from "node:fs";
import { stdin, stdout } from "node:process";


/** 
 * The main entry should have two entrances
 * 1.	The first entrance is a REPL, where lox is interpreted line by line.
 * 2.	The second entrance is a file reader, where the entire file is read and executed.
 */
export class LoxRunner {

    /** 
     * Read the file and then execute on the content
     *
     */
    runFile(filename: string) {
	const contents = readFileSync(filename, {encoding:'utf-8'});
	this.run(contents);
    };

    runPrompt() {
	const rl = readline.createInterface(
	    {
		input: stdin,
		output: stdout, 
		prompt: "> ",
		terminal: true
	    }); 
	rl.on('SIGINT', () => {
	    rl.pause();
	});
	rl.on('line', (input)=> {
	    this.run(input);
	    rl.prompt();
	});


	rl.prompt();
    }
    
    /**
     * Run the interpreter on a string.
     *
     * @param line string of lox code
     */
    private run(line: string) {
	console.log(`< ${line}`);
    }
}

