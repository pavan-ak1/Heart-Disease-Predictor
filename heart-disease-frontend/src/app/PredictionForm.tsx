'use client'; // This directive is necessary for client-side components in Next.js App Router

import React, { useState } from 'react';

interface PredictionResult {
  prediction: number;
  probability_no_heart_disease: number;
  probability_heart_disease: number;
}

interface FormData {
  Age: number;
  Sex: string;
  ChestPainType: string;
  RestingBP: number;
  Cholesterol: number;
  FastingBS: number;
  RestingECG: string;
  MaxHR: number;
  ExerciseAngina: string;
  Oldpeak: number;
  ST_Slope: string;
}

const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    Age: 40,
    Sex: 'M',
    ChestPainType: 'ATA',
    RestingBP: 140,
    Cholesterol: 289,
    FastingBS: 0,
    RestingECG: 'Normal',
    MaxHR: 172,
    ExerciseAngina: 'N',
    Oldpeak: 0.0,
    ST_Slope: 'Up',
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const inputType = e.target.type; // Get the actual type of the input element

    setFormData((prev) => {
      let newValue: string | number;

      // Check if it's a number input (type="number") or the FastingBS select (which stores a number)
      if (inputType === 'number' || name === 'FastingBS') {
        if (value === '') {
          newValue = 0; // Default empty number fields to 0
        } else {
          const parsed = parseFloat(value);
          // If parsed is NaN, default to 0. This prevents `NaN` from ever being set.
          newValue = isNaN(parsed) ? 0 : parsed;
        }
      } else {
        // For all other types (text, string-based select options)
        newValue = value;
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict_heart_disease/`, { // Ensure this URL matches your FastAPI backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong with the prediction.');
      }

      const data: PredictionResult = await response.json();
      setPredictionResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prediction.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Heart Disease Predictor</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {/* Age */}
        <div>
          <label htmlFor="Age" style={labelStyle}>Age:</label>
          <input
            type="number"
            id="Age"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Sex */}
        <div>
          <label htmlFor="Sex" style={labelStyle}>Sex:</label>
          <select
            id="Sex"
            name="Sex"
            value={formData.Sex}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {/* ChestPainType */}
        <div>
          <label htmlFor="ChestPainType" style={labelStyle}>Chest Pain Type:</label>
          <select
            id="ChestPainType"
            name="ChestPainType"
            value={formData.ChestPainType}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="ATA">ATA (Typical Angina)</option>
            <option value="NAP">NAP (Atypical Angina)</option>
            <option value="TA">TA (Non-Anginal Pain)</option>
            <option value="ASY">ASY (Asymptomatic)</option>
          </select>
        </div>

        {/* RestingBP */}
        <div>
          <label htmlFor="RestingBP" style={labelStyle}>Resting Blood Pressure:</label>
          <input
            type="number"
            id="RestingBP"
            name="RestingBP"
            value={formData.RestingBP}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Cholesterol */}
        <div>
          <label htmlFor="Cholesterol" style={labelStyle}>Cholesterol:</label>
          <input
            type="number"
            id="Cholesterol"
            name="Cholesterol"
            value={formData.Cholesterol}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* FastingBS */}
        <div>
          <label htmlFor="FastingBS" style={labelStyle}>Fasting Blood Sugar greater than  120 mg/dl:</label>
          <select
            id="FastingBS"
            name="FastingBS"
            value={formData.FastingBS}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value={0}>No (0)</option>
            <option value={1}>Yes (1)</option>
          </select>
        </div>

        {/* RestingECG */}
        <div>
          <label htmlFor="RestingECG" style={labelStyle}>Resting ECG:</label>
          <select
            id="RestingECG"
            name="RestingECG"
            value={formData.RestingECG}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="Normal">Normal</option>
            <option value="ST">ST-T wave abnormality</option>
            <option value="LVH">Left ventricular hypertrophy</option>
          </select>
        </div>

        {/* MaxHR */}
        <div>
          <label htmlFor="MaxHR" style={labelStyle}>Maximum Heart Rate Achieved:</label>
          <input
            type="number"
            id="MaxHR"
            name="MaxHR"
            value={formData.MaxHR}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* ExerciseAngina */}
        <div>
          <label htmlFor="ExerciseAngina" style={labelStyle}>Exercise Induced Angina:</label>
          <select
            id="ExerciseAngina"
            name="ExerciseAngina"
            value={formData.ExerciseAngina}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="N">No</option>
            <option value="Y">Yes</option>
          </select>
        </div>

        {/* Oldpeak */}
        <div>
          <label htmlFor="Oldpeak" style={labelStyle}>Oldpeak (ST depression):</label>
          <input
            type="number"
            id="Oldpeak"
            name="Oldpeak"
            value={formData.Oldpeak}
            onChange={handleChange}
            step="0.1"
            required
            style={inputStyle}
          />
        </div>

        {/* ST_Slope */}
        <div>
          <label htmlFor="ST_Slope" style={labelStyle}>ST Slope:</label>
          <select
            id="ST_Slope"
            name="ST_Slope"
            value={formData.ST_Slope}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="Up">Up-sloping</option>
            <option value="Flat">Flat</option>
            <option value="Down">Down-sloping</option>
          </select>
        </div>
        
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Predicting...' : 'Get Prediction'}
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>Error: {error}</p>}

      {predictionResult && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#e9f7ff' }}>
          <h2 style={{ textAlign: 'center', color: '#007bff' }}>Prediction Result:</h2>
          <p style={resultStyle}>
            <span style={{ fontWeight: 'bold' }}>Heart Disease:</span>{' '}
            {predictionResult.prediction === 1 ? 'Predicted YES' : 'Predicted NO'}
          </p>
          <p style={resultStyle}>
            <span style={{ fontWeight: 'bold' }}>Probability of No Heart Disease:</span>{' '}
            {(predictionResult.probability_no_heart_disease * 100).toFixed(2)}%
          </p>
          <p style={resultStyle}>
            <span style={{ fontWeight: 'bold' }}>Probability of Heart Disease:</span>{' '}
            {(predictionResult.probability_heart_disease * 100).toFixed(2)}%
          </p>
          {predictionResult.prediction === 1 ? (
            <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
              * Based on the inputs, there is a higher probability of heart disease. Please consult a medical professional.
            </p>
          ) : (
            <p style={{ color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
              * Based on the inputs, there is a lower probability of heart disease.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Basic inline styles (consider using a CSS module or Tailwind for larger projects)
const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '12px 25px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.2s ease',
};

const resultStyle: React.CSSProperties = {
  fontSize: '1.1em',
  marginBottom: '10px',
  lineHeight: '1.5',
};


export default PredictionForm;