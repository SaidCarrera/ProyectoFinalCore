# Library Management System

A modern web application for managing library operations, built with Angular and Node.js.

## Features

- **User Management**
  - User registration and authentication
  - Role-based access control (Admin/User)
  - User profile management

- **Book Management**
  - Comprehensive book catalog
  - Book availability tracking
  - Category-based organization
  - Stock management
    
- **Reservation System**
  - Book reservation functionality
  - Reservation status tracking
  - Due date management
  - Overdue tracking with d<ynamic fines

- **Purchase System**
  - Book purchase functionality
  - Purchase history tracking
  - Stock updates after purchase
 


- **Admin Dashboard**
  - Real-time statistics
  - User management
  - Book inventory management
  - Reservation oversight
  - Overdue reports with dynamic fines

## Technology Stack

- **Frontend:**
  - Angular 18
  - Angular Material UI
  - RxJS
  - Chart.js for statistics visualization

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB 
  - JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4200`

## Demo Credentials

- **Admin Account:**
  - Email: admin@library.com
  - Password: admin123

- **User Account:**
  - Email: user@library.com
  - Password: user123

## Key Features in Detail

### Book Management
- Add, edit, and remove books
- Track book availability
- Manage book categories
- Monitor stock levels

<img width="747" alt="Captura de pantalla 2024-12-02 a la(s) 9 56 28 a  m" src="https://github.com/user-attachments/assets/d15c4107-cb68-4fb4-8c80-ef7bc9dcf492">


### Reservation System
- Create and manage reservations
- Track reservation status
- Handle reservation returns
- Calculate overdue fines automatically

<img width="748" alt="Captura de pantalla 2024-12-02 a la(s) 9 56 54 a  m" src="https://github.com/user-attachments/assets/7f34d71f-b4aa-452b-86ec-8cf3701d2181">


### Purchase System
- Process book purchases
- Maintain purchase history
- Update inventory automatically

<img width="743" alt="image" src="https://github.com/user-attachments/assets/32d3829a-e126-4e48-a21f-7a2f34ff47ce">

### Overdue Management
- Track overdue books
- Calculate fines based on days overdue
- Higher fines for high-demand books
- Generate detailed overdue reports

<img width="747" alt="Captura de pantalla 2024-12-02 a la(s) 9 57 54 a  m" src="https://github.com/user-attachments/assets/d7932cdc-e8d5-4671-a8e9-2f731f35ed28">
<img width="746" alt="Captura de pantalla 2024-12-02 a la(s) 9 58 19 a  m" src="https://github.com/user-attachments/assets/97c1ecce-4e4c-4509-b60d-b3cfdf43a2f0">

### Admin Dashboard
- View system statistics
- Monitor user activity
- Track book circulation
- Generate various reports
  
<img width="1511" alt="Captura de pantalla 2024-12-02 a la(s) 9 58 46 a  m" src="https://github.com/user-attachments/assets/2697a610-dffc-4fc8-8f8c-87e4e68b6b67">
<img width="1512" alt="Captura de pantalla 2024-12-02 a la(s) 9 59 13 a  m" src="https://github.com/user-attachments/assets/63510872-bfec-46dc-b0fd-55a253f69686">
<img width="1512" alt="Captura de pantalla 2024-12-02 a la(s) 9 59 33 a  m" src="https://github.com/user-attachments/assets/177ae4b8-e339-487b-b951-0b69b5eea1d0">

## Project Structure

```
src/
├── app/
│   ├── components/      # Shared components
│   ├── features/        # Feature modules
│   ├── guards/          # Route guards
│   ├── interceptors/    # HTTP interceptors
│   ├── models/          # Data models
│   ├── services/        # Services
│   └── utils/          # Utility functions
├── assets/             # Static assets
└── environments/       # Environment configurations
```

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write comprehensive documentation

### Testing
- Write unit tests for components
- Test services and utilities
- Implement integration tests
- Ensure proper error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
