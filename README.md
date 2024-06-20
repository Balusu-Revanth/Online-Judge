
# CodeMasters

CodeMasters is an online judge platform where users can sign in, sign up, and solve coding problems. This repository contains both the frontend and backend code for the project.


## Table of Contents

- [CodeMasters](#codemasters)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Demo](#demo)
  - [Installation](#installation)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
  - [Usage](#usage)
## Technologies Used

**Frontend:**
- React.js
- Material UI

**Backend:**
- Node.js
- Express.js

**Database**
- MongoDB

**Authentication:**
- Firebase
## Demo

Check out the demo video [here](https://www.loom.com/share/38949be44e31430ebee48f51f8fc2e92)
## Installation

### Frontend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Balusu-Revanth/Online-Judge.git
    cd codemasters/online-judge-frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` directory and add the following Firebase configuration variables:
    ```env
    REACT_APP_API_URL=http://localhost:8000
    REACT_APP_API_KEY=<your_firebase_api_key>
    REACT_APP_AUTH_DOMAIN=<your_firebase_auth_domain>
    REACT_APP_PROJECT_ID=<your_firebase_project_id>
    REACT_APP_STORAGE_BUCKET=<your_firebase_storage_bucket>
    REACT_APP_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
    REACT_APP_APP_ID=<your_firebase_app_id>
    REACT_APP_MEASUREMENT_ID=<your_firebase_measurement_id>
    ```

4. Start the development server:
    ```bash
    npm start
    ```

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd ../online-judge-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add the following configuration variables:
    ```env
    CLIENT_URL=<your_frontend_url>
    MONGO_URI=<your_mongodb_uri>
    SERVICE_ACCOUNT_KEY_PATH=<path_to_your_firebase_service_account_key>
    ```

   Replace `<path_to_your_firebase_service_account_key>` with the actual path to your Firebase service account key file.

4. Start the backend server:
    ```bash
    npm start
    ```

## Usage

Once the frontend and backend servers are running, you can access the application at `http://localhost:3000`.

