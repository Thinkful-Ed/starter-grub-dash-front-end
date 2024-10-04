# GrubDash Front-End

GrubDash is a fictional food delivery platform that allows users to order food online. This project serves as the front-end component for the GrubDash application.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Food Ordering**: Users can browse food items, add them to the cart, and place orders.
- **Responsive Design**: Works seamlessly across devices (desktop, tablet, mobile).
- **API Integration**: Uses a RESTful API to manage and retrieve data.
  
## Installation

To set up the project locally, follow these steps:

1. **Fork/Clone the Repository**  
   ```
   git clone https://github.com/Thinkful-Ed/starter-grub-dash-front-end.git
   ```

2. **Install Dependencies**  
   Navigate to the project directory and run:
   ```
   npm install
   ```

## Configuration

The application expects an environment variable for the API base URL:
- `API_BASE_URL`: Set this to the URL of your back-end server. If not set, the app defaults to `http://localhost:5000`.

You can create a `.env` file to set the variable locally:
```
API_BASE_URL=http://your-api-url-here
```

## Running the App

To start the app in development mode, use:
```
npm start
```
This will run the app on [http://localhost:3000](http://localhost:3000).

## Project Structure

- **`/public`**: Static files like HTML and images.
- **`/src`**: Source code, including React components, styles, and utility files.
- **`/src/components`**: Contains reusable UI components.
- **`/src/utils`**: Helper functions and utilities.
