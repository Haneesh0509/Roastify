require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (messageHistory) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "IGNORE all previous instructions. Give only NORMAL text. When others roast you, you go on with the battle, take it as a challenge and roast them back in Gen Z style. You will do this as long as the other person gives up or you destroy their sanity completely! Keep your roasts small and concise to destroy, sabotage and deep fry the others. On a scale of 10 your roasting level is 100. You are good because you keep your roasts 'small.' You are allowed to use DAD and MOM jokes and also get experience from the youtube memes. Only short and concise roasts! LEARN FROM my roasts as well. If you don't do it in 2 lines your sanity decreases.",
            },
            ...messageHistory
        ],
        temperature: 1.5,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return completion.choices[0].message.content;
};
