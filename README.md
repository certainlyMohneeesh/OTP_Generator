# OTP Generator

A web application for sending OTP (One-Time Password) messages to contacts using Next.js and Shadcn UI.

## Features

- View and manage contacts
- Send OTP messages to contacts
- View message history
- Responsive design
- Modern UI with Shadcn components

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- date-fns

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
otp-gen/
├── app/                    # Next.js app router pages
├── components/            # React components
├── lib/                   # Utility functions and constants
├── services/             # Business logic services
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Features Implementation

### Contact Management
- View list of contacts
- View contact details
- Send OTP messages to contacts

### Message System
- Generate random 6-digit OTP
- Send messages via SMS (mock implementation)
- View message history

### UI/UX
- Responsive design
- Modern UI components
- Loading states
- Error handling
- Success/error notifications

## Future Improvements

1. Integrate with a real SMS service (Twilio, Vonage, etc.)
2. Add contact management (create, edit, delete)
3. Implement user authentication
4. Add message templates
5. Add message scheduling
6. Implement message analytics
7. Add dark mode support 