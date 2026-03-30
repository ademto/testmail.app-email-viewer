# Email Viewer for Testmail.app

A modern Next.js email viewer for testing and viewing emails from Testmail.app during development.

## Features

- 📬 View emails from Testmail.app inbox
- 🏷️ Tag-based filtering with quick-switch buttons
- 🎨 Clean, modern UI with email list and detail view
- 🔄 Real-time refresh
- 📱 Responsive design
- 🖼️ Multiple viewing modes:
  - HTML rendering in iframe
  - Plain text view
  - Raw JSON for debugging
- 📎 Attachment information display
- 📋 Copy email address to clipboard
- ⚡ Built with Next.js 16 and TypeScript

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Testmail.app Configuration
TESTMAIL_API_KEY=your-api-key-here
TESTMAIL_NAMESPACE=your-namespace-here
TESTMAIL_TAG=test

# Public env vars (exposed to browser)
NEXT_PUBLIC_TESTMAIL_NAMESPACE=your-namespace-here
```

### 3. Get Testmail.app Credentials

1. Go to [https://testmail.app/](https://testmail.app/)
2. Sign up or log in
3. Get your API key from the dashboard
4. Your namespace is part of your email address (e.g., `abcde` from `abcde.test@inbox.testmail.app`)

## Usage

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## How It Works

1. The app fetches emails from Testmail.app API using your namespace and tag
2. Emails are displayed in a sidebar list
3. Click any email to view its contents
4. Switch between HTML, Text, and Raw JSON views
5. Use tag selector to switch between different test inboxes

## Tag System

Tags allow you to organize test emails into different inboxes:

- `test` - Default tag
- `account1`, `account2`, `account3` - For testing different accounts
- `person1` - For testing specific user scenarios

Your Testmail.app email format: `{namespace}.{tag}@inbox.testmail.app`

Example: `3cb9j.account1@inbox.testmail.app`

## Project Structure

```
next-email-viewer/
├── app/
│   ├── api/emails/route.ts    # API route for Testmail.app
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main page
│   └── globals.css            # Global styles
├── components/
│   ├── EmailList.tsx          # Email sidebar list
│   ├── EmailDetail.tsx        # Email viewer with tabs
│   └── TagSelector.tsx        # Tag switcher
├── types/
│   └── email.ts               # TypeScript interfaces
└── .env.local                 # Environment variables
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Axios](https://axios-http.com/) - HTTP client
- [Testmail.app](https://testmail.app/) - Email testing service

## Troubleshooting

### "Please configure TESTMAIL_API_KEY..."

Make sure you've created a `.env.local` file with your actual credentials and restart the dev server.

### No emails showing up

- Verify your API key and namespace are correct
- Make sure emails are being sent to the correct Testmail.app address
- Click the "Refresh" button to fetch latest emails

### 401 Unauthorized Error

- Check that your API key is valid
- Ensure the namespace matches your Testmail.app account
- Restart the dev server after changing environment variables

## License

MIT
