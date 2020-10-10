
/*

The Tokenizer, Parser and Interpeter should be pretty robust, but just in case,
here are some possible test values:

"(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((("
    -> Expected token after (, got none

"((14+14d37)+(((45-45d62)-(32-32d56))*(((19-19d22)+((37*37d66)-((29*11)/(48-48d54))))-((((14/8)*(91+3))+((17/17d17)*(69-69d100)))*(((44*10)-(85-5))*((76+1)-(55-8)))))))"
    -> Valid result

"((((((44-10)-(86/11))d((28d3)*(86d9)))d(((98d2)/(86d3))+((99d8)/(71+11))))d((((20d8)d(52+10))/((98d6)/(4-9)))/(((26/3)*(19/1))+((98d11)+(80d5)))))/(((((77*10)+(80*10))+((2*7)d(25+10)))/(((56-7)+(95-4))d((32+4)-(79*9))))d((((71+8)/(60/1))d((7-11)+(21d11)))+(((37-2)*(65*10))/((12d1)-(35-2))))))" 
    -> Infinity

"5d-"
    -> Unexpected token - after d

""
    -> No tokens to parse

"+"
    -> Unexpected token + after undefined

*/

/**
 * Turns a string into a list of Tokens, or an Error if something went wrong
 *
 * @param {string} str Input string
 * @returns {(string[] | Error)} List of tokens or Error
 */
function tokenize(str) {
    if (!str || str.length === 0) return [];
    // lower-case and no whitespace
    str = str.toLowerCase().replace(/\s/g, "");

    // try to find bad tokens by matching anything that is not in the accepted token set
    // accepted tokens: digits [\d], operators [\*, \+, \-, \/, d], parentheses [\(\)]
    const unrecognized = str.match(/[^d\+\-\*\/\d\(\)]+/);
    if (unrecognized !== null) throw new Error(`Unexpected token ${unrecognized[0]} at ${unrecognized.index}`);

    // tokenization is basically just regex matching all the accepted tokens
    const tokenList = [...str.match(/(\d+)|[\+\-\*\/d\(\)]/g)];
    return tokenList;
}

/**
 * Recursive descent parser
 */
class Parser {
    #tokens = [];
    #pointer = 0;

    /**
     * @param {string[]} tokens valid list of tokens
     */
    constructor(
        tokens
    ) {
        this.#tokens = tokens;
        this.#pointer = 0;

        if (this.#tokens.length === 0) throw new Error(`No tokens to parse`);
    }

    /**
     * @type {(string|undefined)}
     */
    get #current() { 
        return this.#tokens[this.#pointer];
    }

    /**
     * @type {(string|undefined)}
     */
    get #previous() {
        return this.#tokens[this.#pointer - 1];
    }

    #advance() {
        this.#pointer += 1;
        return this.#previous;
    }

    /**
     * Recursively parses the token list, transforming it into reverse polish notation (https://en.wikipedia.org/wiki/Reverse_Polish_notation)
     *
     * @returns {string[]} Instructions in reverse polish notation
     * @throws {Error} Error that is definitely descriptive enough
     */
    parse() {
        // Operator precedence is built into these functions
        // It works by descending down the list of operators, from the lowest precendence to the highest precedence.
        // That way, once we arrive at a value or an operator, we know that all the operators of higher precedence have been
        // parsed already. 
        const insts = this.#parse_binary0();
        if (this.#pointer < this.#tokens.length) {
            // Could not parse the entire token list, which means there were either extra or not enough tokens.
            // This is a user error.
            throw new Error(`FeelsDankMan you did something wrong.`);
        }
        return insts;
    }

    // binary operators with precedence 0 (+, -)
    #parse_binary0() {
        let left = this.#parse_binary1();
        while (["+", "-"].includes(this.#current)) {
            const op = this.#advance();
            const right = this.#parse_binary1();
            left = [...left, ...right, op];
        }
        return left;
    }

    // binary operators with precedence 1 (*, /)
    #parse_binary1() {
        let left = this.#parse_unary();
        while (["*", "/"].includes(this.#current)) {
            const op = this.#advance();
            const right = this.#parse_unary();
            left = [...left, ...right, op];
        }
        return left;
    }

    // unary operators (+, -)
    #parse_unary() {
        if (this.#current === "-") {
            this.#advance();
            return [...this.#parse_dice(), "~"];
        }
        return this.#parse_dice();
    }

    // dice operator (d)
    #parse_dice() {
        let left = this.#parse_terminal();
        if (this.#current === "d") {
            this.#advance();
            const right = this.#parse_terminal();
            left = [...left, ...right, "d"];
        }
        return left;
    }

    // terminal value (parentheses or numbers)
    #parse_terminal() {
        if (this.#current === "(") {
            this.#advance();
            const expr = this.#parse_binary0();
            if (this.#current != ")") {
                throw new Error(`Expected a matching ")" after ${this.#previous}`);
            }
            this.#advance();
            return expr;
        } else if (this.#current !== undefined && !Number.isNaN(Number(this.#current))) {
            return [Number(this.#advance())];
        } else {
            if (this.#current === undefined) {
                throw new Error(`Expected token after ${this.#previous}, got none`);
            } else {
                throw new Error(`Unexpected token ${this.#current} after ${this.#previous}`);
            }
        }
    }
}

//Temporary random function used during testing so this whole chunk of code can be dumped into a devtools console
// window.sb = { Utils: { random: (min, max) => Math.random() * (max - min) + min } };

function roll_dice(times, sides) {
    let sum = 0;
    while (times --> 0) {
        sum += sb.Utils.random(1, sides);
    }
    return sum;
}

const bin_ops = {
    "+": (left, right) => left + right,
    "-": (left, right) => left - right,
    "*": (left, right) => left * right,
    "/": (left, right) => left / right,
    "d": (left, right) => roll_dice(left, right)
}

const un_ops = {
    "~": (value) => -value,
}

/**
 * This is a stack-based "bytecode interpreter", which interprets reverse polish notation (https://en.wikipedia.org/wiki/Reverse_Polish_notation)
 * 
 * @param {string[]} insts Instructions in reverse polish notation
 */
function evaluate(insts) {
    // program stack
    let stack = [];
    // instruction pointer
    let ip = 0;
    // while we have instructions left
    while (ip < insts.length) {
        // grab the next instruction
        const inst = insts[ip++];
        // check if it's an operator
        if (inst in bin_ops) {
            // if it is, pop the right and left values off the stack (hence the "reverse" in reverse polish notation)
            const right = stack.pop();
            const left = stack.pop();
            // apply the operation to them, and push the result onto the stack
            stack.push(bin_ops[inst](left, right));
        } else if (inst in un_ops) {
            const value = stack.pop();
            stack.push(un_ops[inst](value));
        } else {
            // otherwise, we have a value, push it onto the stack
            stack.push(inst);
        }
    }
    // This should be a programmer error
    if (stack.length !== 1) throw new Error(`monkaS Something went horribly wrong`);
    // At the end, we're left with a single value, which is the final result
    return stack.pop();
}

module.exports = {
	Name: "roll",
	Aliases: null,
	Author: "supinic",
	Cooldown: 5000,
	Description: "Rolls a random number. If nothing is specified, rolls 1-100. You can specify min and max values, or some expression using standard dice notation.",
	Flags: ["mention","pipe","skip-banphrase"],
	Whitelist_Response: null,
	Static_Data: null,
	Code: (async function roll (context, ...args) {
        /*

        Error-handling here is complicated

        Consider the following: "$roll 5d6 +"
        This has 2 arguments, but both are NaN, so the first part will fail (with some error)
        Then the second part will fail too (with some error), because it is not a valid expression
        So, which error do we use?

        For now, errors are ignored, and will redirect the command to the $help roll command.

        */

        if (args.length === 0) {
            const result = sb.Utils.random(1, 100);
            if (context.append.pipe) {
                return { reply: String(result) };
            } else {
                return { reply: `Your roll is ${result}` };
            }
        }

        // Try to parse as "$roll MIN MAX" first
        if (args.length === 2) {
            const [first, second] = args.map(arg => Number(arg));
            // TODO(jprochazk): proper error handling?
            if (!(
                // If both arguments are numbers
                (Number.isNaN(first) || Number.isNaN(second)) || 
                // And they fit within the range (-MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
                (Math.max(first, second) > Number.MAX_SAFE_INTEGER || Math.min(first, second) < -Number.MAX_SAFE_INTEGER)
            )) {
                // Execute it as "$roll MIN MAX"
                const result = sb.Utils.random(first, second);
                if (context.append.pipe) {
                    return { reply: String(result) };
                } else {
                    return { reply: `Your roll is ${result}` };
                }
            }
        }

        // Try to parse "$roll <dice notation>"

        // Join the arguments into a single string
        let expression = args.join("");
        try {
            // tokenize the expression
            const tokenList = tokenize(expression);
            // parse it
            const parsedExpression = (new Parser(tokenList)).parse();
            // evaluate it
            const result = evaluate(parsedExpression);
            if (context.append.pipe) {
                return { reply: String(result) };
            } else {
                return { reply: `Your roll is ${result}` };
            }
        } catch (error) {
            // TODO(jprochazk): proper error handling?
        }

        return await sb.Commands.get("help").execute(context, "roll");
	}),
	Dynamic_Description: null
};