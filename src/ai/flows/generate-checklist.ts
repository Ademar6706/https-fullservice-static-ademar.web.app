// src/ai/flows/generate-checklist.ts
'use server';

/**
 * @fileOverview Generates a checklist of vehicle inspection points based on vehicle information.
 *
 * - generateChecklist - A function that generates the checklist.
 * - GenerateChecklistInput - The input type for the generateChecklist function.
 * - GenerateChecklistOutput - The return type for the generateChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChecklistInputSchema = z.object({
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  year: z.string().describe('The year of the vehicle.'),
});
export type GenerateChecklistInput = z.infer<typeof GenerateChecklistInputSchema>;

const GenerateChecklistOutputSchema = z.object({
  checklist: z.string().describe('A checklist of inspection points for the vehicle.'),
});
export type GenerateChecklistOutput = z.infer<typeof GenerateChecklistOutputSchema>;

export async function generateChecklist(input: GenerateChecklistInput): Promise<GenerateChecklistOutput> {
  return generateChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChecklistPrompt',
  input: {schema: GenerateChecklistInputSchema},
  output: {schema: GenerateChecklistOutputSchema},
  prompt: `You are an expert automotive service advisor.

  Based on the following vehicle information, generate a checklist of inspection points that a service advisor should review during vehicle reception. The checklist should be comprehensive but concise, covering all major areas of the vehicle. Focus on items relevant to routine maintenance and safety inspections.

  Make: {{{make}}}
  Model: {{{model}}}
  Year: {{{year}}}

  Checklist:`,
});

const generateChecklistFlow = ai.defineFlow(
  {
    name: 'generateChecklistFlow',
    inputSchema: GenerateChecklistInputSchema,
    outputSchema: GenerateChecklistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
