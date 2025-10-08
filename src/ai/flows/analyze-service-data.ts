'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing past service data to identify common issues for specific vehicle models.
 *
 * - analyzeServiceData - A function that orchestrates the analysis of service data.
 * - AnalyzeServiceDataInput - The input type for the analyzeServiceData function.
 * - AnalyzeServiceDataOutput - The output type for the analyzeServiceData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeServiceDataInputSchema = z.object({
  vehicleModel: z.string().describe('The model of the vehicle to analyze service data for.'),
});
export type AnalyzeServiceDataInput = z.infer<typeof AnalyzeServiceDataInputSchema>;

const AnalyzeServiceDataOutputSchema = z.object({
  commonIssues: z
    .string()
    .describe(
      'A summary of common issues identified for the specified vehicle model based on past service data.'
    ),
  suggestedServices: z
    .string()
    .describe(
      'Proactive service suggestions based on the identified common issues, aimed at addressing potential problems.'
    ),
  inventoryRecommendations: z
    .string()
    .describe(
      'Recommendations for optimizing inventory based on the common issues and suggested services, to ensure necessary parts are readily available.'
    ),
});
export type AnalyzeServiceDataOutput = z.infer<typeof AnalyzeServiceDataOutputSchema>;

export async function analyzeServiceData(input: AnalyzeServiceDataInput): Promise<AnalyzeServiceDataOutput> {
  return analyzeServiceDataFlow(input);
}

const analyzeServiceDataPrompt = ai.definePrompt({
  name: 'analyzeServiceDataPrompt',
  input: {schema: AnalyzeServiceDataInputSchema},
  output: {schema: AnalyzeServiceDataOutputSchema},
  prompt: `You are an expert automotive service analyst.
  Analyze past service data for {{vehicleModel}} vehicles to identify common issues. Based on these issues, suggest proactive services and provide inventory recommendations.
  Return a JSON object with commonIssues, suggestedServices, and inventoryRecommendations fields. The commonIssues field should summarize the most frequent problems. The suggestedServices field should list services that can address these problems. The inventoryRecommendations should suggest parts to keep in stock based on the identified issues and service suggestions.
  Ensure the response is well-formatted and easy to understand.
  Vehicle Model: {{{vehicleModel}}}`,
});

const analyzeServiceDataFlow = ai.defineFlow(
  {
    name: 'analyzeServiceDataFlow',
    inputSchema: AnalyzeServiceDataInputSchema,
    outputSchema: AnalyzeServiceDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeServiceDataPrompt(input);
    return output!;
  }
);
