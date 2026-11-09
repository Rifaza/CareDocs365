# CareDocs365 – Healthcare Document Management System

CareDocs365 is a full-stack healthcare document management demonstration application designed to organize, manage, and track documents through a centralized document library and approval workflow.

The project demonstrates full-stack development using **ASP.NET Core Web API, React, TypeScript, Entity Framework Core, and Microsoft SQL Server**.

## Project Overview

Healthcare organizations work with different types of documents, including medical reports, patient records, departmental documents, and administrative policies.

CareDocs365 provides a centralized application for managing document information, uploading files, tracking document status, and demonstrating an approval process.

## Technology Stack

### Backend
- C#
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- Microsoft SQL Server
- RESTful API development
- Swagger / OpenAPI

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

## Architecture

The application follows a frontend-backend architecture.

```text
CareDocs365
?
??? frontend
?   ??? caredocs-ui
?       ??? src
?       ??? public
?       ??? package.json
?
??? backend
?   ??? CareDocs.Api
?       ??? Controllers
?       ??? Data
?       ??? Models
?       ??? DTOs
?       ??? Services
?       ??? Migrations
?
??? .gitignore
??? README.md
```

### Application Flow

1. React frontend sends HTTP requests to the backend.
2. ASP.NET Core Web API processes application requests.
3. Entity Framework Core handles database operations.
4. Microsoft SQL Server stores document and workflow information.
5. The API returns data to the frontend for presentation.

## Features

### Document Management
- Centralized document library.
- Document listing and metadata management.
- Search by document title and category.
- Filter by department and document status.
- Document categorization.
- File upload and download API support.

### Approval Workflow
- Document submission for approval.
- Approval and rejection actions.
- Approval status tracking.
- Approval history.

### Dashboard and Monitoring
- Document statistics.
- Approval status overview.
- Audit log support.

*Feature availability depends on the current implementation stage. Some frontend integrations are still under development.*

## Database

The application uses Microsoft SQL Server with Entity Framework Core.

Main entities include:

- Department
- Employee
- Document
- Approval
- ApprovalHistory
- AuditLog

## Getting Started

### Prerequisites

Install the following:

- .NET 8 SDK
- Node.js and npm
- Microsoft SQL Server Express
- SQL Server Management Studio (optional)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CareDocs365.git
cd CareDocs365
```

### 2. Configure the backend

Navigate to the backend project:

```bash
cd backend/CareDocs.Api
```

Configure the database connection string using your local development configuration.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=CareDocs365DB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Do not commit passwords or other sensitive configuration values.

Restore dependencies:

```bash
dotnet restore
```

Apply database migrations:

```bash
dotnet ef database update
```

If Entity Framework tools are not installed:

```bash
dotnet tool install --global dotnet-ef --version 8.0.0
```

Run the backend:

```bash
dotnet run
```

Open the Swagger URL printed in the terminal to explore the API.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend/caredocs-ui
```

Create a local `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5140/api
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local Vite URL displayed in the terminal.

## API Overview

Example backend endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/Documents` | Retrieve documents |
| GET | `/api/Departments` | Retrieve departments |
| POST | `/api/Documents` | Create document metadata |
| POST | `/api/Documents/{id}/upload` | Upload a document file |
| GET | `/api/Documents/{id}/file` | Download a document file |
| POST | `/api/Approvals/submit/{id}` | Submit a document for approval |

Refer to Swagger for the available endpoints and request models.

## Security and Production Considerations

This project is a demonstration application and is not intended for real patient data or production healthcare deployment.

Before production use, additional controls would be required, including:

- Authentication and role-based authorization.
- Secure document access and permissions.
- Encryption and secure secret management.
- File content validation and malware scanning.
- Audit logging and monitoring.
- Secure storage and backup procedures.
- Appropriate healthcare privacy and regulatory compliance.

## Project Status

**Status:** Under active development.

The current implementation includes the backend API, SQL Server integration, document library interface, document search and filters, and initial approval and file-management capabilities.

## Author

Developed as a personal full-stack software engineering demonstration project.