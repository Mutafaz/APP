# Style Assistant

This is a React-based web application that helps you get outfit recommendations.

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**

    This project uses the Gemini API and OpenWeatherMap API. You need to create a `.env` file in the root of the project and add your API keys:

    ```
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
    ```

    You can get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and your OpenWeatherMap API key from [OpenWeatherMap](https://openweathermap.org/api).

## Running the application

```bash
npm start
```

This will start the development server, and you can view the application at `http://localhost:5173`. 