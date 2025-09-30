from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:3000", # Your Next.js frontend
    # "http://localhost", # If your frontend is served from root localhost
    # "http://127.0.0.1:3000", # Another common localhost address
    # Add any other origins where your frontend might be hosted in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of origins that are allowed to make requests
    allow_credentials=True, # Allow cookies to be included in cross-origin requests
    allow_methods=["*"], # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allow all headers
)
# Load the trained model, scaler, and columns
try:
    model = joblib.load('KNN_heart.pkl')
    scaler = joblib.load('scaler.pkl')
    model_columns = joblib.load('columns.pkl')
except FileNotFoundError:
    raise RuntimeError("Ensure 'KNN_heart.pkl', 'scaler.pkl', and 'columns.pkl' are in the same directory as main.py")

class HeartbeatData(BaseModel):
    Age: int
    Sex: str 
    ChestPainType: str
    RestingBP: int
    Cholesterol: int
    FastingBS: int 
    RestingECG: str 
    MaxHR: int
    ExerciseAngina: str 
    Oldpeak: float
    ST_Slope: str

@app.post("/predict_heart_disease/")
async def predict_heart_disease(data: HeartbeatData):
    try:
        input_dict = data.dict()

        
        input_df = pd.DataFrame(columns=model_columns)
        input_df.loc[0] = 0

        input_df['Age'] = input_dict['Age']
        input_df['RestingBP'] = input_dict['RestingBP']
        input_df['Cholesterol'] = input_dict['Cholesterol']
        input_df['FastingBS'] = input_dict['FastingBS']
        input_df['MaxHR'] = input_dict['MaxHR']
        input_df['Oldpeak'] = input_dict['Oldpeak']

        if input_dict['Sex'] == 'M':
            input_df['Sex_M'] = 1

        chest_pain_type = input_dict['ChestPainType']
        if f'ChestPainType_{chest_pain_type}' in input_df.columns:
            input_df[f'ChestPainType_{chest_pain_type}'] = 1
        else:
            raise HTTPException(status_code=400, detail=f"Invalid ChestPainType: {chest_pain_type}")

        resting_ecg = input_dict['RestingECG']
        if f'RestingECG_{resting_ecg}' in input_df.columns:
            input_df[f'RestingECG_{resting_ecg}'] = 1
        else:
           
            if resting_ecg not in ['Normal', 'ST']:
                 pass 
            else:
                 raise HTTPException(status_code=400, detail=f"Invalid RestingECG: {resting_ecg}")


        if input_dict['ExerciseAngina'] == 'Y':
            input_df['ExerciseAngina_Y'] = 1

        st_slope = input_dict['ST_Slope']
        if f'ST_Slope_{st_slope}' in input_df.columns:
            input_df[f'ST_Slope_{st_slope}'] = 1
        else:
            
            if st_slope not in ['Up', 'Flat']:
                pass 
            else:
                raise HTTPException(status_code=400, detail=f"Invalid ST_Slope: {st_slope}")

        if 'HeartDisease' in input_df.columns:
            input_df = input_df.drop(columns=['HeartDisease'])
        
        feature_columns_for_scaling = [col for col in model_columns if col != 'HeartDisease']
        
        input_df = input_df[feature_columns_for_scaling]

        
        scaled_input = scaler.transform(input_df)

        prediction = model.predict(scaled_input)
        prediction_proba = model.predict_proba(scaled_input)

        
        result = {
            "prediction": int(prediction[0]),
            "probability_no_heart_disease": float(prediction_proba[0][0]),
            "probability_heart_disease": float(prediction_proba[0][1])
        }
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
