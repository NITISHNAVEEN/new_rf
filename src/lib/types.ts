export type TaskType = 'regression' | 'classification';

export type Hyperparameters = {
  n_estimators: number;
  max_depth: number;
  min_samples_split: number;
  min_samples_leaf: number;
};

export type RegressionMetrics = {
  r2: number;
  rmse: number;
  mae: number;
};

export type ClassificationMetrics = {
  accuracy: number;
  precision: number;
  recall: number;
  confusionMatrix: number[][];
};

export type Metrics = RegressionMetrics | ClassificationMetrics;

export type FeatureImportance = {
  feature: string;
  importance: number;
};

export type Prediction = {
  id: string;
  date: string;
  features: Record<string, number>;
  actual: number;
  prediction: number;
};

export type ChartDataPoint = {
  actual: number;
  prediction: number;
};
