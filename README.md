# Client Project Tracker

A full-stack client project management application built with Laravel and React. The application allows users to create, view, edit, delete, search, filter, and sort projects.

## Features

* Create projects
* Edit existing projects
* Delete projects
* View project details
* Search projects by client, project name, or description
* Filter projects by status
* Filter projects by priority
* Sort projects by table columns
* Form validation
* Responsive project table
* Loading, error, and empty states
* RESTful API
* Feature tests for the backend

## Technology Choices

### Backend

* **Laravel** — REST API and application backend
* **PHP** — Backend programming language
* **MySQL** — Database
* **Laravel Eloquent** — Database ORM
* **Laravel API Resources** — Consistent API response structure
* **Laravel Form Requests** — Request validation
* **PHPUnit / Laravel Testing** — Backend feature tests

### Frontend

* **React** — User interface
* **TypeScript** — Type safety
* **Vite** — Frontend development and build tooling
* **Axios** — HTTP requests to the Laravel API
* **CSS** — Custom responsive UI styling

## Project Structure

The project is divided into two main applications: backend and frontend. The backend is a Laravel application containing the API controllers, Form Requests, API Resources, models, database migrations, routes, and feature tests. The backend tests are located in tests/Feature/ProjectControllerTest.php.

The frontend is a React and TypeScript application built with Vite. Its src directory contains the reusable components, including ProjectForm.tsx and ProjectList.tsx, API communication logic in services/projectService.ts, shared TypeScript definitions in types/project.ts, and the main application component in App.tsx. The frontend dependencies and development scripts are defined in package.json.

## Setup Instructions

### Requirements

Make sure the following are installed:

* PHP 8.2+
* Composer
* MySQL
* Node.js 18+
* npm

### 1. Clone the repository

git clone https://github.com/tyronepl/client-project-tracker.git
cd client-project-tracker

### 2. Set up the Laravel backend

Navigate to the backend directory:

cd backend

Install PHP dependencies:

composer install

Create the environment file:

cp .env.example .env

Generate the Laravel application key:

php artisan key:generate

### 3. Configure the database

Update the database settings in the backend `.env` file:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_tracker
DB_USERNAME=root
DB_PASSWORD=

Create the database in MySQL before running the migrations.

### 4. Run migrations and seed data

php artisan migrate

If seed data is available:

php artisan db:seed

Or:

php artisan migrate --seed

### 5. Start the Laravel API

php artisan serve

The API will be available at:

http://127.0.0.1:8000

The API base URL is:

http://127.0.0.1:8000/api

### 6. Set up the React frontend

Open a new terminal and navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173

## How to Run the Application

Two development servers need to be running.

### Terminal 1 — Laravel

cd backend
php artisan serve

### Terminal 2 — React

cd frontend
npm run dev

Then open the Vite URL shown in the terminal, normally:

http://localhost:5173

The React application communicates with the Laravel API through:

http://127.0.0.1:8000/api


## API Endpoints

| Method    | Endpoint             | Description           |
| --------- | -------------------- | --------------------- |
| GET       | `/api/projects`      | Retrieve all projects |
| POST      | `/api/projects`      | Create a project      |
| GET       | `/api/projects/{id}` | Retrieve a project    |
| PUT/PATCH | `/api/projects/{id}` | Update a project      |
| DELETE    | `/api/projects/{id}` | Delete a project      |

## Project Fields

Each project contains:

* Client Name
* Project Name
* Description
* Status
* Priority
* Start Date
* Due Date

### Statuses

* Planning
* In Progress
* On Hold
* Completed

### Priorities

* Low
* Medium
* High

## Searching, Filtering and Sorting

The frontend provides:

* Search by client name
* Search by project name
* Search by description
* Filter by status
* Filter by priority
* Sortable project table columns

Filtering and sorting are handled on the frontend after retrieving the project collection from the API.

## Testing

Backend feature tests can be executed with:

php artisan test

The tests cover the project API functionality, including:

* Retrieving projects
* Creating projects
* Validation
* Updating projects
* Deleting projects
* Database persistence

## Assumptions

* The application is intended for a single-user/internal project tracking workflow.
* Authentication was not implemented because it was listed as an optional requirement.
* Projects are currently accessible through the API without authentication.
* Search, filtering, and sorting are implemented on the frontend.
* The application uses MySQL as the development database.
* The frontend and backend are run separately during local development.
* The Laravel API is expected to run on `127.0.0.1:8000`.
* The React development server is expected to run on Vite's default port, `5173`.
* Project dates are stored and returned using the `YYYY-MM-DD` format.
* Deleting a project permanently removes it from the database.

## Optional Features

The following optional features were implemented:

* Search functionality
* Status filtering
* Priority filtering
* Column sorting
* Backend feature tests

The following optional features were not implemented:

* Authentication
* Docker setup
* Deployment

## Development Notes

The application separates responsibilities between the frontend and backend:

* React handles the user interface and client-side interactions.
* Laravel provides the REST API.
* Eloquent handles database operations.
* Form Requests handle API validation.
* API Resources provide a consistent JSON response format.
* TypeScript provides type safety across the frontend.

## License

This project was created as part of a technical assessment.
