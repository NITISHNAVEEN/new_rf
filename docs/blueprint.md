# **App Name**: Forest Insights

## Core Features:

- Task Selection: Choose between regression and classification tasks, dynamically updating the target column options.
- CSV Data Upload & Preview: Upload CSV files and preview the first few rows for verification and store data to Firebase Storage, if necessary.
- Feature & Target Selection: Select input features and the target column for model training with validation.
- Hyperparameter Tuning: Adjust hyperparameters such as n_estimators, max_depth, etc., and trigger real-time retraining.
- Random Forest Training and Prediction: Train the Random Forest model in Firebase Functions using Python, and store the predictions in Firestore.
- Performance Metrics & Visualizations: Calculate and display key performance indicators such as R², RMSE, Accuracy, Feature Importance and generate plots to represent these.
- Prediction History: Stores and displays a history of model predictions in a table in Firestore, including input features and date/time.

## Style Guidelines:

- Primary color: Soft blue (#A0CFEC) evoking reliability and trust, for the dashboard's overall feel.
- Background color: Very light gray (#F0F4F8), almost white, for a clean and professional look.
- Accent color: Teal (#46A5AA) providing a vibrant highlight for interactive elements and important data points.
- Body and headline font: 'Inter' (sans-serif) for a modern and neutral appearance, suitable for both headlines and body text.
- Use a set of minimalistic and consistent icons, preferably from a single library to maintain visual coherence.
- Employ a responsive design with a clear separation of concerns, using a sidebar for navigation and main content area for data presentation.
- Incorporate subtle animations for transitions and loading states, providing feedback to the user and enhancing the overall experience.