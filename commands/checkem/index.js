module.exports = {
    Name: "checkem",
    Aliases: ["check'em"],
    Author: "supinic",
    Cooldown: 30000,
    Description: "",
    Flags: ["mention", "pipe","skip-banphrase"],
    Whitelist_Response: null,
    Static_Data: (() => ({
        checks: {
            2: "dubs",
            3: "trips",
            4: "quads",
            5: "quints",
            6: "sexes",
            7: "septs",
            8: "octs",
            9: "nons",
            10: "decs"
        }
    })),
    Code: (async function checkEm (context) {
        let messageNumber;
        if (context.platform.Name === "twitch") {
            if (!context.append.messageID) {
                return {
                    success: false,
                    reply: `No message ID available! FeelsBadMan`
                };
            }
            
            messageNumber = BigInt("0x" + context.append.messageID.replace(/-/g, ""));
        }
        else if (context.platform.Name === "discord") {
            if (!context.append.messageID) {
                return {
                    success: false,
                    reply: `No message ID available on Discord just yet! Coming soon™`
                };
            }

            messageNumber = BigInt(context.append.messageID);
        }
        else {
            return {
                success: false,
                reply: `This command is not available on ${context.platform.capital}!`
            };
        }

        const list = String(messageNumber).split("");
        const repeatedDigit = list.pop();

        let repeatsAmount = 1;
        let currentDigit = list.pop();
        while (currentDigit === repeatedDigit) {
            repeatsAmount++;
            currentDigit = list.pop();
        }

        if (repeatsAmount === 1) {
            return {
                reply: String(messageNumber)
            };
        }

        const checkEmName = this.staticData.checks[repeatsAmount];
        if (!checkEmName) {
            return {
                reply: `${messageNumber} - you got more than 10 repeating digits?! Big gratz!`
            };
        }

        return {
            reply: `${messageNumber} - VisLaud Clap Congratulations on the ${checkEmName}!`
        };
    }),
    Dynamic_Description: null
};