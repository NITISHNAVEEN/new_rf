'use client';
import { useState, useEffect, useReducer, useCallback } from 'react';
import type {
  TaskType,
  Hyperparameters,
  Metrics,
  FeatureImportance,
  Prediction,
  ChartDataPoint,
} from '@/lib/types';
import housingDataset from '@/lib/data/california-housing.json';
import wineDataset from '@/lib/data/wine-quality.json';
import { getFeatureImportanceInsights } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'loading' | 'success' | 'error';

const regressionInitialState = {
  task: 'regression' as TaskType,
  hyperparameters: {
    n_estimators: 100,
    max_depth: 10,
    min_samples_split: 2,
    min_samples_leaf: 1,
  },
  selectedFeatures: [
    'MedInc',
    'HouseAge',
    'AveRooms',
    'AveBedrms',
    'Population',
    'AveOccup',
    'Latitude',
    'Longitude',
  ],
  targetColumn: 'MedHouseVal',
};

const classificationInitialState = {
  task: 'classification' as TaskType,
  hyperparameters: {
    n_estimators: 100,
    max_depth: 10,
    min_samples_split: 2,
    min_samples_leaf: 1,
  },
  selectedFeatures: [
    'fixed_acidity',
    'volatile_acidity',
    'citric_acid',
    'residual_sugar',
    'chlorides',
    'free_sulfur_dioxide',
    'total_sulfur_dioxide',
    'density',
    'pH',
    'sulphates',
    'alcohol',
  ],
  targetColumn: 'quality',
};


type State = {
  task: TaskType;
  hyperparameters: Hyperparameters;
  selectedFeatures: string[];
  targetColumn: string;
};

type Data = {
  dataset: Record<string, any>[];
  metrics: (Metrics & { confusionMatrix?: number[][] }) | null;
  featureImportance: FeatureImportance[];
  history: Prediction[];
  chartData: ChartDataPoint[] | null;
  insights: string;
};

type Action =
  | { type: 'SET_TASK'; payload: TaskType }
  | { type: 'SET_HYPERPARAMETERS'; payload: Partial<Hyperparameters> }
  | { type: 'SET_SELECTED_FEATURES'; payload: string[] }
  | { type: 'SET_TARGET_COLUMN'; payload: string };

const initialState: State = regressionInitialState;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TASK': {
        if (action.payload === 'regression') {
            return regressionInitialState;
        } else {
            return classificationInitialState;
        }
    }
    case 'SET_HYPERPARAMETERS':
      return { ...state, hyperparameters: { ...state.hyperparameters, ...action.payload } };
    case 'SET_SELECTED_FEATURES':
      return { ...state, selectedFeatures: action.payload };
    case 'SET_TARGET_COLUMN': {
      const currentDataset = state.task === 'regression' ? housingDataset : wineDataset;
      const allHeaders = Object.keys(currentDataset[0] ?? {});
      const newFeatures = allHeaders.filter(h => h !== action.payload);
      return { ...state, targetColumn: action.payload, selectedFeatures: newFeatures };
    }
    default:
      return state;
  }
};

// Mock function to simulate model training
const mockTrainModel = async (
  state: State,
  dataset: Record<string, any>[]
): Promise<Omit<Data, 'dataset'>> => {
  await new Promise((res) => setTimeout(res, 1500));

  const { task, selectedFeatures, targetColumn } = state;

  if (Math.random() < 0.1) {
    throw new Error('Model training failed. Please try adjusting parameters.');
  }

  // Generate mock metrics
  let metrics: Data['metrics'];
  if (task === 'regression') {
    metrics = {
      r2: Math.random() * 0.2 + 0.75, // 0.75 - 0.95
      rmse: Math.random() * 0.2 + 0.3, // 0.3 - 0.5
      mae: Math.random() * 0.2 + 0.2, // 0.2 - 0.4
    };
  } else {
    metrics = {
      accuracy: Math.random() * 0.1 + 0.88, // 0.88 - 0.98
      precision: Math.random() * 0.1 + 0.87, // 0.87 - 0.97
      recall: Math.random() * 0.1 + 0.89, // 0.89 - 0.99
      confusionMatrix: [
        [Math.floor(Math.random() * 10 + 85), Math.floor(Math.random() * 5 + 1)],
        [Math.floor(Math.random() * 5 + 2), Math.floor(Math.random() * 10 + 90)],
      ],
    };
  }

  // Generate mock feature importance
  const featureImportance = selectedFeatures
    .map((feature) => ({
      feature,
      importance: Math.random(),
    }))
    .sort((a, b) => b.importance - a.importance);

  // Generate mock predictions
  const history: Prediction[] = dataset.slice(0, 15).map((row, i) => {
    const actual = row[targetColumn];
    let prediction: number;
    if (task === 'regression') {
      prediction = actual * (Math.random() * 0.4 + 0.8); // prediction is within 20% of actual
    } else {
        // Simple classification mock: if alcohol > 10, predict 1, else 0
        const threshold = 10;
        prediction = row['alcohol'] > threshold ? (Math.random() > 0.1 ? 1 : 0) : (Math.random() > 0.9 ? 1 : 0);
    }

    const features = selectedFeatures.reduce((acc, feat) => {
      acc[feat] = row[feat];
      return acc;
    }, {} as Record<string, number>);

    return {
      id: `pred_${Date.now()}_${i}`,
      date: new Date().toISOString(),
      features,
      actual: actual,
      prediction: task === 'classification' ? prediction : parseFloat(prediction.toFixed(3)),
    };
  });
  
  const chartData = history.map(p => ({ actual: p.actual, prediction: p.prediction }));

  return { metrics, featureImportance, history, chartData, insights: '' };
};

export const useRandomForest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [data, setData] = useState<Data>({
    dataset: housingDataset,
    metrics: null,
    featureImportance: [],
    history: [],
    chartData: null,
    insights: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const { toast } = useToast();

  useEffect(() => {
    const newDataset = state.task === 'regression' ? housingDataset : wineDataset;
    setData(d => ({...d, dataset: newDataset}));
  }, [state.task]);

  const handleStateChange = <T extends Action['type']>(type: T) => (payload: Extract<Action, { type: T }>['payload']) => {
    dispatch({ type, payload } as Action);
  };
  
  const actions = {
    setTask: handleStateChange('SET_TASK'),
    setHyperparameters: handleStateChange('SET_HYPERPARAMETERS'),
    setSelectedFeatures: handleStateChange('SET_SELECTED_FEATURES'),
    setTargetColumn: handleStateChange('SET_TARGET_COLUMN'),
    trainModel: useCallback(async () => {
      setStatus('loading');
      try {
        const currentDataset = state.task === 'regression' ? housingDataset : wineDataset;
        const trainedData = await mockTrainModel(state, currentDataset);
        setData(d => ({ ...d, ...trainedData, insights: '' }));

        const featureImportancesForAI = trainedData.featureImportance.reduce((acc, item) => {
            acc[item.feature] = item.importance;
            return acc;
        }, {} as Record<string, number>);

        getFeatureImportanceInsights({
            featureImportances: featureImportancesForAI,
            targetColumn: state.targetColumn,
        }).then(insights => {
            setData(d => ({ ...d, insights }));
        }).catch(err => {
            console.error("AI insight generation failed:", err);
            setData(d => ({ ...d, insights: 'Could not generate AI insights.' }));
        });

        setStatus('success');
        toast({ title: 'Model Trained Successfully', description: 'Dashboard has been updated with new results.' });
      } catch (error) {
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ title: 'Training Error', description: errorMessage, variant: 'destructive' });
        setData(d => ({ ...d, metrics: null, featureImportance: [], history: [] }));
      }
    }, [state, toast]),
  };

  // Debounced retraining
  useEffect(() => {
    if (status === 'idle') return; // Don't train on initial load

    const handler = setTimeout(() => {
      actions.trainModel();
    }, 1000); // 1-second debounce

    return () => {
      clearTimeout(handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hyperparameters, state.selectedFeatures, state.targetColumn, state.task]); // Retrain on these changes

  return { state, data, status, actions };
};
