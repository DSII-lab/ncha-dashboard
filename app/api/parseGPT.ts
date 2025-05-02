'use server';

import OpenAI from "openai";

const client = new OpenAI();

export async function parsePrompt(prompt: string) {
  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: "Search through the files, and find the most relavant question id, subquestion id (if the question has a subquestion), the value of the demographical group that the user's prompt is asking (from Total, Age, Class Year, GPA, Gender, Sexual Orientation, Relationship Status), and the year of the data that the user wanted to use (from Fall 2024, Fall 2022, and Fall 2020). Then output the result in JSON format, and ONLY 1 JSON Object (no other texts allowed, no more than 1 JSON Object allowed, no markdown, pure JSON)! Such as: {questionId: string, subquestionId: string | null, demoGroup: string, year: string}. The default demographical group is \"total\". The default year is \"Fall 2024\".",
      input: "Here are the user's questions: " + prompt,
      tools: [{
        type: "file_search",
        vector_store_ids: ["vs_680714c91c7c8191975a378e4a4548e9"],
      }]
    })
    console.log(response.output_text)

    const question_data = JSON.parse(response.output_text);

    return {
      status: 0,
      data: question_data
    }
  } catch (err: any) {
    console.log(err);
    return {
      status: 1,
      msg: err.message
    }
  }
}