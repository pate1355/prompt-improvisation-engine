# Prompt Improvise

Prompt Improvise is a full-stack application designed to optimize and execute AI prompts using the Groq API. It helps users refine their prompts for token efficiency and better results, leveraging the power of large language models.

## Features

-   **Smart Prompt Optimization**: Automatically rewrite user prompts to be more token-efficient and effective.
-   **Multi-Model Support**: Choose from various Groq-hosted models like `llama-3.3-70b-versatile` and `llama-3.1-8b-instant`.
-   **Real-time Usage Tracking**: Monitor token usage and requests per minute/day to stay within API limits.
-   **Clean & Modern UI**: A responsive interface built with React and Tailwind CSS.
-   **Secure Backend**: Express.js server handles API requests securely using `groq-sdk`.

## Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Lucide React
-   **Backend**: Node.js, Express, Groq SDK
-   **Tools**: npm, Nodemon, ESLint

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js (v18 or higher) installed.
-   npm (v9 or higher) installed.
-   A valid [Groq API Key](https://console.groq.com/keys).

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/prompt-improvise.git
    cd prompt-improvise
    ```

2.  **Install dependencies**:
    
    *   For the server:
        ```bash
        cd server
        npm install
        ```
    *   For the client:
        ```bash
        cd ../client
        npm install
        ```

## Configuration

1.  Create a `.env` file in the `server` directory:
    ```bash
    cd server
    touch .env
    ```

2.  Add your Groq API key to the `.env` file:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    PORT=3000
    ```

## Usage

1.  **Start the Backend Server**:
    Open a terminal and run:
    ```bash
    cd server
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

2.  **Start the Frontend Client**:
    Open a new terminal window and run:
    ```bash
    cd client
    npm run dev
    ```
    The client will start (usually on `http://localhost:5173`).

3.  **Open the Application**:
    Navigate to the URL provided by the client terminal (e.g., `http://localhost:5173`) in your web browser.

4.  **Optimize & Execute**:
    -   Enter your prompt in the text area.
    -   Click "Smart Optimize (Groq)" to refine it.
    -   Select a target model and click "Execute API Call" to get the result.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature-name`.
3.  Make your changes and commit them: `git commit -m 'Add some feature'`.
4.  Push to the branch: `git push origin feature/your-feature-name`.
5.  Submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).
