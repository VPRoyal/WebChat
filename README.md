# WebChat

WebChat is a real-time chat application designed to facilitate seamless communication between users over the web. This application supports user authentication, message persistence, and a responsive design to ensure accessibility across various devices.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Component Overview](#component-overview)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-time Messaging**: Instant communication between users.
- **User Authentication**: Secure login and registration processes.
- **Message Persistence**: Storage of chat history for future reference.
- **Responsive Design**: Optimized for both desktop and mobile platforms.

## Project Structure

The project is organized as follows:

```bash
WebChat/
├── .vscode/             # Visual Studio Code settings
├── bin/                 # Application startup scripts
├── database/            # Database models and configurations
├── middlewares/         # Custom middleware functions
├── routes/              # Application routes
├── server/              # Server configuration and initialization
├── services/            # Business logic and services
├── test/                # Test cases
├── utils/               # Utility functions
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
├── Notes.txt            # Project notes and documentation
├── nodemon.json         # Nodemon configuration
├── package-lock.json    # Dependency lock file
└── package.json         # Project metadata and dependencies
```

## Component Overview

### `.vscode/`
Contains settings specific to Visual Studio Code, such as debugging configurations and workspace preferences.

### `bin/`
Includes scripts to initialize and start the application, commonly containing a `www` file to set up the server.

### `database/`
Houses database models and configuration files, defining the structure and relationships of data entities and managing database connections.

### `middlewares/`
Contains middleware functions that process requests before they reach the main route handlers. These can handle tasks such as authentication, logging, and request parsing.

### `routes/`
Defines the application's API endpoints and associates them with controller functions to handle incoming requests.

### `server/`
Manages server setup and configuration, including initializing the Express application, setting up middleware, and configuring ports.

### `services/`
Implements the core business logic, such as handling user authentication, managing chat sessions, and processing messages.

### `test/`
Contains test cases to ensure the application's components function as intended, potentially using frameworks like Mocha or Jest.

### `utils/`
Provides utility functions and helpers used across the application, promoting code reuse and modularity.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/VPRoyal/WebChat.git
   cd WebChat
   ```

2. **Install dependencies:**

   Ensure [Node.js](https://nodejs.org/) is installed, then run:

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and specify the necessary environment variables. Refer to `Notes.txt` for detailed configuration information.

## Usage

To start the application:

### **Development Mode:**
```bash
npm run dev
```
This command uses Nodemon to automatically restart the server upon code changes.

### **Production Mode:**
```bash
npm start
```
This command starts the server without automatic restarts.

By default, the application will be accessible at:  
📌 `http://localhost:3000`

## Contributing

Contributions are welcome! To contribute:

1. **Fork the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "Add YourFeature"
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a pull request.**
