'use server';
/**
 * @fileOverview A hairstyle recommender AI agent.
 *
 * - recommendStyle - A function that handles the style recommendation process.
 * - RecommendStyleInput - The input type for the recommendStyle function.
 * - RecommendStyleOutput - The return type for the recommendStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RecommendStyleInputSchema = z.object({
  hairDescription: z
    .string()
    .describe('A description of the user\'s hair type, length, and current style.'),
});
export type RecommendStyleInput = z.infer<typeof RecommendStyleInputSchema>;

const RecommendStyleOutputSchema = z.object({
  styleName: z.string().describe('The name of the recommended hairstyle.'),
  description: z.string().describe('A description of the recommended hairstyle and why it would suit the user.'),
});
export type RecommendStyleOutput = z.infer<typeof RecommendStyleOutputSchema>;

export async function recommendStyle(input: RecommendStyleInput): Promise<RecommendStyleOutput> {
  return recommendStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendStylePrompt',
  input: {schema: RecommendStyleInputSchema},
  output: {schema: RecommendStyleOutputSchema},
  prompt: `You are an expert hairstylist at a luxury salon called Glamora.

A client is asking for a hairstyle recommendation. Based on their hair description, suggest a stylish and flattering new hairstyle.

Provide a creative name for the style and a compelling description of why it would be a great choice for them.

User's hair: {{{hairDescription}}}`,
});

const recommendStyleFlow = ai.defineFlow(
  {
    name: 'recommendStyleFlow',
    inputSchema: RecommendStyleInputSchema,
    outputSchema: RecommendStyleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
