# Survey Client - React UI

This client provides a modern React-based interface for the AI Survey Server.

## Features

- Register and login with JWT authentication
- Create new surveys (with correct expiry date handling)
- Search for surveys by keywords
- Submit responses to surveys directly from the search results
- Generate and view AI summaries for each survey
- View AI summary for all responses to a survey ("Show All Responses AI Summary")

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode on [http://localhost:5173](http://localhost:5173) (default).

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

---

## Usage Notes

- The backend server must be running on port 3000 for API requests to work.
- When creating a survey, the expiry date is sent as an ISO string to avoid timezone issues.
- Only surveys created after June 12, 2025, will accept responses (old surveys may appear as expired).
- You can submit a response and generate an AI summary for any survey directly from the search results.
- The "Show All Responses AI Summary" button displays the AI summary for all responses to a survey below the survey in the UI.

---

## Learn More

- [React documentation](https://reactjs.org/)
- [Create React App documentation](https://github.com/facebook/create-react-app)
