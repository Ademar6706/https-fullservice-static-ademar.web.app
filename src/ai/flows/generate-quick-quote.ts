'use server';

/**
 * @fileOverview A quick quote generation AI agent.
 *
 * - generateQuickQuote - A function that generates a quick quote based on vehicle and service information.
 * - GenerateQuickQuoteInput - The input type for the generateQuickQuote function.
 * - GenerateQuickQuoteOutput - The return type for the generateQuickQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuickQuoteInputSchema = z.object({
  vehicleMake: z.string().describe('The make of the vehicle.'),
  vehicleModel: z.string().describe('The model of the vehicle.'),
  vehicleYear: z.string().describe('The year of the vehicle.'),
  serviceSelected: z.string().describe('The service selected by the customer.'),
  checklistObservations: z.string().describe('Observations from the vehicle checklist.'),
});
export type GenerateQuickQuoteInput = z.infer<typeof GenerateQuickQuoteInputSchema>;

const GenerateQuickQuoteOutputSchema = z.object({
  laborCost: z.number().describe('The estimated cost of labor for the service.'),
  partsCost: z.number().describe('The estimated cost of parts for the service.'),
  suppliesCost: z.number().describe('The estimated cost of supplies for the service.'),
  discount: z.number().describe('The discount applied to the quote.'),
  iva: z.number().describe('The IVA (Value Added Tax) applied to the quote.'),
  totalCost: z.number().describe('The total cost of the service, including labor, parts, supplies, discount, and IVA.'),
});
export type GenerateQuickQuoteOutput = z.infer<typeof GenerateQuickQuoteOutputSchema>;

export async function generateQuickQuote(input: GenerateQuickQuoteInput): Promise<GenerateQuickQuoteOutput> {
  return generateQuickQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuickQuotePrompt',
  input: {schema: GenerateQuickQuoteInputSchema},
  output: {schema: GenerateQuickQuoteOutputSchema},
  prompt: `You are an expert service advisor providing quick quotes for automotive services.

  Based on the following information, generate a quick quote:
  Vehicle Make: {{{vehicleMake}}}
  Vehicle Model: {{{vehicleModel}}}
  Vehicle Year: {{{vehicleYear}}}
  Service Selected: {{{serviceSelected}}}
  Checklist Observations: {{{checklistObservations}}}

  Provide a quote with estimated costs for labor, parts, and supplies, as well as any applicable discounts and IVA.

  Ensure the total cost is accurately calculated.

  Return the quote in JSON format.
  Remember that the descriptions for each field will be used to create a well formatted JSON.
  Do not generate any text outside of the JSON.

  Consider that the prices should be in Mexican pesos.
  Also, the IVA (Value Added Tax) in Mexico is 16%.
`,
});

const generateQuickQuoteFlow = ai.defineFlow(
  {
    name: 'generateQuickQuoteFlow',
    inputSchema: GenerateQuickQuoteInputSchema,
    outputSchema: GenerateQuickQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
