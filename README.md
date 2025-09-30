
# Heart Disease Prediction Project

This project provides a full-stack solution for predicting heart disease based on various patient parameters. It includes a FastAPI backend that hosts a pre-trained K-Nearest Neighbors (KNN) machine learning model and a Next.js frontend (with TypeScript) that allows users to input data and receive predictions.

## Features

*   **FastAPI Backend**:
    *   Exposes a `/predict_heart_disease/` endpoint for making predictions.
    *   Loads a pre-trained KNN model, scaler, and column information from pickle files.
    *   Handles data preprocessing (one-hot encoding, scaling) for incoming requests.
    *   Configured with CORS middleware to allow requests from the Next.js frontend.
*   **Next.js Frontend (TypeScript)**:
    *   Interactive form for users to input patient data (Age, Sex, Chest Pain Type, etc.).
    *   Sends user input to the FastAPI backend and displays the prediction results.
    *   Uses environment variables for easy configuration of the backend API URL.

## Technologies Used

*   **Backend**:
    *   Python 3.x
    *   FastAPI
    *   Uvicorn (ASGI server)
    *   Pandas
    *   Numpy
    *   Scikit-learn
    *   Joblib
*   **Frontend**:
    *   Next.js (React Framework)
    *   TypeScript
    *   HTML/CSS

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Python 3.8+
*   Node.js 18+ and npm
*   Git (optional, but recommended for cloning)

### 1. Backend Setup

1.  **Clone the repository (if applicable) or create the `heart-disease-backend` directory.**
    ```bash
    mkdir heart-disease-backend
    cd heart-disease-backend
    ```

2.  **Place Model Files:** Ensure your trained model files are in this directory:
    *   `KNN_heart.pkl`
    *   `scaler.pkl`
    *   `columns.pkl`

    *(If you need to regenerate these, refer to your ML training script.)*

3.  **Create `requirements.txt`**:
    Create a file named `requirements.txt` in the `heart-disease-backend` directory with the following content:
    ```
    fastapi
    uvicorn[standard]
    pandas
    numpy
    scikit-learn
    joblib
    ```

4.  **Create `main.py`**:
    Create a file named `main.py` in the `heart-disease-backend` directory with the FastAPI code provided previously (including the CORS middleware).

5.  **Create a Virtual Environment (Recommended)**:
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```

6.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

7.  **Run the FastAPI Backend**:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will run on `http://127.0.0.1:8000`. You can access its interactive API documentation at `http://127.0.0.1:8000/docs`. Leave this terminal window open.

### 2. Frontend Setup

1.  **Clone the repository (if applicable) or create the `heart-disease-frontend` directory.**
    ```bash
    # If you're in heart-disease-backend, go up one level first:
    # cd ..
    npx create-next-app@latest heart-disease-frontend --typescript
    cd heart-disease-frontend
    ```
    (Select `Yes` for TypeScript, `Yes` for ESLint, `No` for Tailwind (or `Yes` if you want it), `Yes` for `src/` directory, `Yes` for App Router, `No` for custom import alias.)

2.  **Create `.env.local`**:
    Create a file named `.env.local` in the **root** of your `heart-disease-frontend` directory (next to `package.json`).
    Add the following line to it:
    ```
    NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
    ```
    *   Remember `NEXT_PUBLIC_` prefix is required for client-side environment variables in Next.js.

3.  **Update `src/app/PredictionForm.tsx`**:
    Replace the content of `src/app/PredictionForm.tsx` with the latest version provided, including the refined `handleChange` function and the usage of `API_BASE_URL`.

4.  **Update `src/app/page.tsx`**:
    Replace the content of `src/app/page.tsx` with the code that imports and renders `PredictionForm`.

5.  **Update `src/app/globals.css` (Optional)**:
    Add the basic global styles to `src/app/globals.css` for better appearance.

6.  **Install Node.js Dependencies**:
    ```bash
    npm install
    ```

7.  **Run the Next.js Frontend**:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:3000`. Open your browser to this address.

## Usage

1.  Ensure both the FastAPI backend (`http://127.0.0.1:8000`) and the Next.js frontend (`http://localhost:3000`) are running.
2.  Navigate to `http://localhost:3000` in your web browser.
3.  Fill out the form with the required patient parameters.
4.  Click the "Get Prediction" button.
5.  The prediction (whether heart disease is likely) and associated probabilities will be displayed below the form.

## Troubleshooting

*   **CORS Error**: If you see a CORS error in your browser console (e.g., "Access to fetch... blocked by CORS policy"), double-check that you've correctly added the `CORSMiddleware` to your `main.py` and that the `allow_origins` list includes `http://localhost:3000`. Remember to restart your FastAPI server after making changes to `main.py`.
*   **`NaN` Warnings in Console**: If you see warnings like "Received NaN for the `value` attribute", ensure your `handleChange` function in `PredictionForm.tsx` is correctly parsing number inputs and defaulting empty or invalid numerical values to `0`. Restart your Next.js frontend after making changes to `PredictionForm.tsx`.
*   **Backend Not Found**: If the frontend shows a network error or "Failed to fetch prediction", verify that your FastAPI backend is running and accessible at the URL specified in `NEXT_PUBLIC_BACKEND_URL` in `.env.local`.
*   **Missing Pickle Files**: If the backend fails to start with a `FileNotFoundError`, ensure `KNN_heart.pkl`, `scaler.pkl`, and `columns.pkl` are in the same directory as `main.py`.

