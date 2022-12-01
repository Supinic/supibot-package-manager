declare type ReplaceeFunction = () => (string | RegExp);
declare type ReplacerFunction = (string: string, ...rest: string[]) => string;

declare type ParameterType = string | RegExp | number | ReplaceeFunction | ReplacerFunction;
declare type Parameter<T> = {
    type: T;
    required?: boolean;
}

declare interface TemplateBanphrase {
    name: string;
    parameters: Record<string, Parameter<ParameterType>>;
}

declare interface SimpleReplacementBanphrase extends TemplateBanphrase {
    name: "simple-replacement";
    parameters: {
        replacee: {
            type: string | RegExp;
            required: true;
        };
    };
}

declare interface AdvancedReplacementBanphrase extends TemplateBanphrase {
    name: "advanced-replacement";
    parameters: {
        replacee: {
            type: string | RegExp | ReplaceeFunction;
            required: true;
        };
        replacer: {
            type: ReplacerFunction;
            required: true;
        };
    };
}

declare interface CountChangeBanphrase extends TemplateBanphrase {
    name: "count-change";
    parameters: {
        query: {
            type: string | RegExp;
            required: true;
        };
        count: {
            type: number;
            required: true;
        };
        change: {
            type: string;
            required: false;
        };
        appendix: {
            type: number;
            required: false;
        };
    };
}
