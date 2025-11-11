

export type TaskType = 'regression' | 'classification';
export type UserLevel = 'beginner' | 'advanced';

export type Hyperparameters = {
  n_estimators: number;
  max_depth: number;
  min_samples_split: number;
  min_samples_leaf: number;
  max_features: 'sqrt' | 'log2' | null;
  bootstrap: boolean;
  min_impurity_decrease: number;
  criterion: 'gini' | 'entropy';
  class_weight: 'balanced' | 'balanced_subsample' | null;
};

export type RegressionMetric = {
  r2: number;
  rmse: number;
  mae: number;
};

export type ClassificationMetric = {
  accuracy: number;
  precision: number;
  recall: number;
  confusionMatrix: number[][];
};

export type Metric = RegressionMetric | ClassificationMetric;

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
  individualPredictions?: number[];
  forestSimulation?: ForestSimulation;
};

export type ChartDataPoint = {
  actual: number;
  prediction: number;
};

export type LeafNode = {
  type: 'leaf';
  value: number[]; // For regression: [value]. For classification: [class1_count, class2_count, ...]
  samples: number;
};

export type DecisionNode = {
  type: 'node';
  feature: string;
  threshold: number;
  samples: number;
  impurity: number;
  criterion: 'MSE' | 'Gini' | 'Entropy';
  value: number[]; // For regression: [value]. For classification: [class1-count, class2_count, ...]
  children: [DecisionTree, DecisionTree];
};

export type DecisionTree = DecisionNode | LeafNode;

export type CurveDataPoint = {
  x: number;
  y: number;
};

export type PdpPoint = {
  featureValue: number;
  prediction: number;
};

export type PdpData = {
  [feature: string]: PdpPoint[];
};

export type TreeSimulation = {
    id: number;
    prediction: number;
    keyFeatures: string[];
    tree: DecisionTree;
    samples: number;
};

export type ForestSimulation = {
    trees: TreeSimulation[];
};

export type DatasetOption = {
    name: string;
    value: string;
    data: Record<string, any>[];
    target: string;
}

export type DatasetMetadata = {
  story: string;
  attributes: Record<string, {
      description: string;
      type: string;
  }>;
};

export type Data = {
  dataset: Record<string, any>[];
  metrics: (Metric & { confusionMatrix?: number[][] }) | null;
  featureImportance: FeatureImportance[];
  history: Prediction[];
  chartData: ChartDataPoint[] | null;
  insights: string;
  baselineMetrics: (Metric & { confusionMatrix?: number[][] }) | null;
  baselineFeatureImportance: FeatureImportance[];
  baselineChartData: ChartDataPoint[] | null;
  decisionTree: DecisionTree | null;
  rocCurveData: CurveDataPoint[] | null;
  prCurveData: CurveDataPoint[] | null;
  pdpData: PdpData | null;
  forestSimulation: ForestSimulation | null;
  metadata: DatasetMetadata | null;
  placeholderValues: Record<string, any> | null;
};

export type Role = 'doctor' | 'coach' | 'seller';

export type SyntheticPatientData = {
    "Blood Pressure (Systolic)": number;
    "Cholesterol": number;
    "Heart Rate": number;
    "Blood Sugar": number;
    "Risk": "risky" | "risk less";
};
