import { TokenType } from "./token.js";
import { Scanner } from "./scanner.js";
import { expect, describe, it } from "vitest";

//Starting point for tests, ofc add more if errors pop-up, feature gets added, etc
//1. Correct termination logic
//	a. assumption of next/start/end are all correct
//	b. when done we finish with a EOF token
//2. Individual cases for tokenTypes
//3. Tokenization of string, int and literals
//4. Comments
//5. TODO: Multi-line comments
describe("Scanner Positional Tests", () => {
  it("should return an EOF token", () => {
    const scanner = new Scanner("");
    const tokens = scanner.scanTokens();
    expect(tokens.at(-1)?.type).toBe(TokenType.EOF);
  });

  it("should move a line when encountering a new line", () => {
    const testString = '"Hello" \n "World"';
    const scanner = new Scanner(testString);
    const tokens = scanner.scanTokens();
    expect(scanner.next == testString.length);
    expect(scanner.lineNumber == 2);
    expect(tokens.at(0)?.type).toBe(TokenType.STRING);
    expect(tokens.at(1)?.type).toBe(TokenType.STRING);
  });
});

describe("Scanner Tokenization Checks", () => {
  it("should ignore comments", () => {
    const testString = "//HelloThereTHISIsNothing";
    const scanner = new Scanner(testString);
    const tokens = scanner.scanTokens();
    expect(tokens.at(0)?.type).toBe(TokenType.EOF);
  });

  it("should tokenize a blend of tokens #1", () => {
    //this test string is me vommiting on the keyboard
    const testString = "()=.>>=";
    const scanner = new Scanner(testString);
    const tokens = scanner.scanTokens();
    expect(tokens.map((token) => token.type)).toEqual([
      TokenType.LEFT_PAREN,
      TokenType.RIGHT_PAREN,
      TokenType.EQUAL,
      TokenType.DOT,
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
      TokenType.EOF,
    ]);
  });

  it("should tokenize a blend of tokens #2", () => {
    const testString = '123 (123) "string" identifier while for';
    const scanner = new Scanner(testString);
    const tokens = scanner.scanTokens();
    expect(tokens.map((token) => token.type)).toEqual([
      TokenType.NUMBER,
      TokenType.LEFT_PAREN,
      TokenType.NUMBER,
      TokenType.RIGHT_PAREN,
      TokenType.STRING,
      TokenType.IDENTIFIER,
      TokenType.WHILE,
      TokenType.FOR,
      TokenType.EOF,
    ]);
  });

  it("should tokenize a blend of tokens #3", () => {
    const testString = `
    !=>=>><=/ 
    //thisisacomment
    identifier`;
    const scanner = new Scanner(testString);
    const tokens = scanner.scanTokens();
    expect(tokens.map((token) => token.type)).toEqual([
      TokenType.BANG_EQUAL,
      TokenType.GREATER_EQUAL,
      TokenType.GREATER,
      TokenType.GREATER,
      TokenType.LESS_EQUAL,
      TokenType.SLASH,
      TokenType.IDENTIFIER,
      TokenType.EOF,
    ]);
  });
});
