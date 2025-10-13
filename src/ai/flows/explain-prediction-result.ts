'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining a specific prediction result.
 *
 * It takes the feature values of a data point and the prediction as input, and returns
 * a textual explanation of why the model made that prediction, highlighting the key
 * features that contributed to the result.
 *
 * @exports explainPredictionResult - The main function to call for explaining a prediction.
 * @exports ExplainPredictionResultInput - The input type for the explainPredictionResult function.
 * @exports ExplainPredictionResultOutput - The output type for the explainPredictionResult function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPredictionResultInputSchema = z.object({
  featureValues: z.record(z.number()).describe('A map of feature names to their values for the data point.'),
  prediction: z.number().describe('The predicted value for the data point.'),
  featureNames: z.array(z.string()).describe('List of feature names used in the model.'),
  taskType: z.enum(['regression', 'classification']).describe('The type of task: regression or classification.'),
});
export type ExplainPredictionResultInput = z.infer<typeof ExplainPredictionResultInputSchema>;

const ExplainPredictionResultOutputSchema = z.object({
  explanation: z.string().describe('A textual explanation of why the model made the prediction.'),
});
export type ExplainPredictionResultOutput = z.infer<typeof ExplainPredictionResultOutputSchema>;

export async function explainPredictionResult(input: ExplainPredictionResultInput): Promise<ExplainPredictionResultOutput> {
  return explainPredictionResultFlow(input);
}

const explainPredictionResultPrompt = ai.definePrompt({
  name: 'explainPredictionResultPrompt',
  input: {schema: ExplainPredictionResultInputSchema},
  output: {schema: ExplainPredictionResultOutputSchema},
  prompt: `You are an AI expert explaining machine learning model predictions.

  You are provided with the feature values of a data point, the model's prediction for that data point, the feature names and the type of task the model is solving.

  Based on this information, explain why the model made the prediction it did. Focus on the key features that most influenced the prediction.

  Task Type: {{{taskType}}}
  Feature Names: {{featureNames}}
  Feature Values: {{{featureValues}}}
  Prediction: {{{prediction}}}

  Explanation: `,
});

const explainPredictionResultFlow = ai.defineFlow(
  {
    name: 'explainPredictionResultFlow',
    inputSchema: ExplainPredictionResultInputSchema,
    outputSchema: ExplainPredictionResultOutputSchema,
  },
  async input => {
    const {output} = await explainPredictionResultPrompt(input);
    return output!;
  }
);
