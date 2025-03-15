// import "dotenv/config";

export default async function getCompletion(query: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer <api key>`,
      // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1",
      messages: [
        {
          role: "user",
          content: `Consider the sentence by the user, rate it from 0 to 1 in the following parameters
      upto 2 decimals, the rating should only be high for one of the following at a time, we are trying to simulate a multi class classification model 
      toxic, severely toxic, obscene, threat, insult, identity_hate
      
      ${query}
      
      If the rating is high on one it should not be high on another but should still show the values of the other parameters.
      
      Give the output in raw JSON.`,
        },
      ],
    }),
  });
  return await res.json();
}
