// This file is mostly meant to be used as a form of documentation for the $js
// command, and can also be used by more technical users to help them make
// advanced aliases.

// To use these type definitions, you can copy this file to your project and
// remove the export statement below, which will make all of these declarations global
// to your project.

export { };

/****************************************************************************/
// These types taken from supinic/supi-core/@types/classes/command.d.ts
declare type JSONifiable = null | boolean | number | string | { [P: string]: JSONifiable; } | JSONifiable[];
declare type SupibotParameterType = "string" | "number" | "boolean" | "date" | "object" | "regex";
declare type SupibotParameterParsedType = string | number | boolean | Date | Record<string, JSONifiable> | RegExp;
declare type SupibotParameterDescriptor = {
	type: SupibotParameterType;
	name: string;
};

/**
 * The type of the global `utils` object.
 */
declare type SupibotDankDebugUtils = {
	/**
	 * Returns the first emote from the list that is available from in the current context.
	 * If none of the emotes are available, the fallback is returned instead.
	 */
	getEmote(emotes: string[], fallback: string): Promise<string>,

	/**
	 * Returns a list of all emotes available for supibot to post in the current context.
	 */
	fetchEmotes(): Promise<string[]>,

	/**
	 * Returns the string with an invisible character inserted after the first character.
	 */
	unping(string: string): string;

	/**
	 * Takes a string value, and parses it according as the provided type.
	 * This is the underlying function used to parse parameters for all supibot commands.
	 */
	parseParameter(value: string, type: SupibotParameterType): SupibotParameterParsedType;

	/**
	 * Parses parameters from arguments in the same manner supibot does for commands.
	 * @param paramsDefinition The definitions of the parameters to parse
	 * @param argsArray The message to parse, split on a space.
	 */
	parseParametersFromArguments(
		paramsDefinition: SupibotParameterDescriptor[],
		argsArray: string[]
	): {
		success: true;
		parameters: Record<string, SupibotParameterParsedType>;
		args: string[];
	} | {
		success: false;
		reply?: string;
	};

	// These are all sb.Utils methods:
	/**
	 * Capitalizes the string's first letter.
	 */
	capitalize(string): string;

	/**
	 * Returns a random array element.
	 */
	randArray<T>(arr: T[]): T | undefined;

	/**
	 * Returns a random integer between min and max, inclusively.
	 */
	random(min: number, max: number): number;

	/**
	 * Creates a random string using the characters provided, or the base ASCII alphabet.
	 */
	randomString<T extends string>(length: number, characters?: T): T;

	/**
	 * Removes all (central European?) accents from a string.
	 */
	removeAccents(string: string): string;

	/**
	 * Returns a formatted string, specifying an amount of time delta from current date to provided date.
	 */
	timeDelta(target: Date | number, skipAffixes?: boolean, respectLeapYears?: boolean, deltaTo?: Date): string;

	/**
	 * Wraps the input string into the given amount of characters, discarding the rest.
	 */
	wrapString(string: string, length: number, options?: { keepWhitespace?: boolean; }): string;

	/**
	 * Pads a number with specified number of zeroes.
	 */
	zf(number: number, padding: number): string;
};

/** A value that can be stored in a supibot store */
declare type SupibotStoreValue = string | number | boolean | null | undefined;

/** A place to store persistent data within supibot */
declare interface SupibotStore {
	set(key: string, value: SupibotStoreValue): void;
	get(key: string): SupibotStoreValue;
	getKeys(): string[];
}

/**
 * The global object.
 */
declare const global: typeof globalThis;

/**
 * A list of aliases that are currently "in execution" for the current user. Similar to a call stack.
 * The first element of the array is the "highest level" alias in the stack (the one the user typed).
 * The last element is the name of the alias that started this $js invocation.
 */
declare const aliasStack: string[];

/**
 * This variable is conditionally set based on how $js is invoked:
 * Using the function parameter, this variable will be a string array of input passed to the $js command.
 * Using the arguments parameter, this variable will be the JSON parsed form the value of the parameter (including primitives).
 *
 * In all other cases when neither the function parameter nor the arguments parameter is provided, the value is null.
 */
declare const args: null | string[] | JSONifiable;

/**
 * The channel the command is being executed in.
 * On discord, the channel is the string channel ID.
 */
declare const channel: string;

/**
 * The username of the user the command was executed by.
 */
declare const executor: string;

/**
 * The platform the command is being executed in.
 */
declare const platform: string;

/**
 * Readonly access to the tee, see the help for `$abb tee`.
 */
declare const tee: string[];

/**
 * Push an item to the tee.
 */
declare const _teePush: (value: string) => void;

/**
 * A persistent key/value store tied to the current channel.
 */
declare const channelCustomData: SupibotStore;

/**
 * A persistent key/value store tied to the current user.
 */
declare const customData: SupibotStore;

/**
 * Utils methods built into supibot.
 */
declare const utils: SupibotDankDebugUtils;
