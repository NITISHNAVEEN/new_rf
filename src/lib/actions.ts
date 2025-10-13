'use server';
import {
  generateFeatureImportanceInsights,
  GenerateFeatureImportanceInsightsInput,
} from '@/ai/flows/generate-feature-importance-insights';
import {
  explainPredictionResult,
  ExplainPredictionResultInput,
} from '@/ai/flows/explain-prediction-result';

export async function getFeatureImportanceInsights(
  input: GenerateFeatureImportanceInsightsInput
) {
  const result = await generateFeatureImportanceInsights(input);
  return result.insights;
}

export async function getPredictionExplanation(
  input: ExplainPredictionResultInput
) {
  const result = await explainPredictionResult(input);
  return result.explanation;
}
