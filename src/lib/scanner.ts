import { ScannerError } from  "./scannerError.js";
import { TokenType, Token, Literal, LITERAL_KEYWORDS }  from "./token.js"

/*
 * This is the scanner, scan throught list of characters, group into lexeme, then we have tokens.
 * lexemes are the smallest sequence to represent somethin, a token
 */
export class Scanner {
    source: string; 
    tokens: Token[] = [];

    private scannerError: ScannerError;

    private start = 0;
    private next: number = this.start;
    private lineNumber = 1;

    constructor(source: string) {
	this.source = source;
	this.scannerError = new ScannerError();
    }

    scanTokens(): Token[] {
	while (!this.isAtEnd()) {
	    const c = this.advance();
	    switch(c) {
		case "(": this.addTokenNullLiteral(TokenType.LEFT_PAREN); break;
		case ")": this.addTokenNullLiteral(TokenType.RIGHT_PAREN); break;
		case "{": this.addTokenNullLiteral(TokenType.LEFT_BRACE); break;
		case "}": this.addTokenNullLiteral(TokenType.RIGHT_BRACE); break;
		case ",": this.addTokenNullLiteral(TokenType.COMMA); break;
		case ".": this.addTokenNullLiteral(TokenType.DOT); break;
		case "-": this.addTokenNullLiteral(TokenType.MINUS); break;
		case "+": this.addTokenNullLiteral(TokenType.PLUS); break;
		case ";": this.addTokenNullLiteral(TokenType.SEMICOLON); break;
		case "*": this.addTokenNullLiteral(TokenType.STAR); break;
		case "!":
		    this.addTokenNullLiteral((this.match("=") 
			? TokenType.BANG_EQUAL : TokenType.BANG));
		    break;
		case "=":
		    this.addTokenNullLiteral((this.match("=")
			? TokenType.EQUAL_EQUAL : TokenType.EQUAL));
		    break;
		case ">":
		    this.addTokenNullLiteral((this.match("=")
			? TokenType.GREATER_EQUAL : TokenType.GREATER));
		    break;
		case "<":	
		    this.addTokenNullLiteral((this.match("=")
			? TokenType.LESS_EQUAL : TokenType.LESS));
		    break;
		case "/":
		    if (this.match("/")) {
			while(this.peek() != "\n" && !this.isAtEnd()) {this.advance()};
		    } else {
			this.addTokenNullLiteral(TokenType.SLASH);
		    }
		    break;

		//Whitespaces - we ignore them
		case " ":
		case "\r":
		case "\t":
		    break;
		
		//New line
		case "\n":
		    this.lineNumber++;
		    break;

		//string literals
		case "\"":
		    this.tokenizeString();
		    break;
		default:
		    //number literals
		    if (this.isNumber(c)) {
			this.tokenizeNumber();
		    //identifer
		    } else if (this.isAlpha(c)) {
			this.tokenizeIdentifier();
		    } else {
			this.scannerError.error(this.lineNumber, `Unexpected Character: ${c}`);
		    }
		    break;
	    }
	    this.start = this.next;
	}
	this.tokens.push(new Token(TokenType.EOF, "", null, this.lineNumber));
	return this.tokens;
    }

    tokenizeString() {
	while(this.peek() != "\"" && !this.isAtEnd()) {
	    this.advance();
	}
	//edge case: EOF-> incomplete String
	if (this.isAtEnd()) {
	    this.scannerError.error(this.lineNumber, "Unterminated String");
	    return;
	}

	// go one more to consume ending "\"
	this.advance();
	//trim off the quotes: " [string] " 
	this.addToken(TokenType.STRING, this.source.slice(this.start + 1, this.next - 1));
	return;
    }

    tokenizeNumber(){
	while(this.isNumber(this.peek())) {
	    this.advance();
	}

	if (this.peek() === "." && this.peekMore()) {
	    this.advance();
	    while(this.isNumber(this.peek())) {
		this.advance();
	    }
	}
	this.addToken(TokenType.NUMBER, Number(this.source.slice(this.start, this.next)));
    }

    tokenizeIdentifier(){
	while(this.isAlphaNumber(this.peek())) {
	    this.advance();
	}
	const lexeme = this.source.slice(this.start, this.next);
	const tokenType = LITERAL_KEYWORDS[lexeme] ?? TokenType.IDENTIFIER;
	this.addTokenNullLiteral(tokenType);
    }

    isNumber(val: string): boolean {
	return /^\d$/.test(val);
    }

    isAlpha(val: string): boolean {
	//yes _ is considered alpha in the book, gigachad
	return /^[a-zA-Z_]$/.test(val);
    }

    isAlphaNumber(val: string) {
	return this.isAlpha(val) || this.isNumber(val);
    }

    addTokenNullLiteral(tokenType: TokenType) {
	this.addToken(tokenType, null);
    }

    addToken(tokenType: TokenType, literal: Literal) {
	const lexeme = this.source.slice(this.start, this.next);
	this.tokens.push(new Token(tokenType, lexeme, literal, this.lineNumber));
    }

    advance(): string {
	return this.source.charAt(this.next++); 
    }

    match(expected: string): boolean{
	if (this.isAtEnd()) return false;
	if (expected != this.source.charAt(this.next)) return false;

	this.next++;
	return true;
    }

    peek(): string {
	if (this.isAtEnd()) return '\0';
	return this.source.charAt(this.next);
    }

    peekMore(): string {
	const nextNext = this.next + 1;
	if (nextNext >= this.source.length) return '\0';
	return this.source.charAt(nextNext);
    }

    isAtEnd(): boolean {
	return this.next >= this.source.length;
    }

}
