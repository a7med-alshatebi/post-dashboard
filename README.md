# Post Dashboard

A modern, responsive post management dashboard built with Next.js 15, featuring dark mode, email sharing, and a beautiful UI.

## Features

- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- 📧 **Email Sharing** - Share posts via email using Resend API
- 🔍 **Search & Filter** - Search posts by title and filter by author
- 🗑️ **Post Management** - Delete posts with confirmation
- ⚡ **Fast Performance** - Built with Next.js 15 and optimized components
- 🎨 **Beautiful UI** - Modern design with smooth animations and gradients

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd post-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Resend API key in `.env.local`:
```bash
RESEND_API_KEY=your_resend_api_key_here
```

### Getting a Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to [API Keys](https://resend.com/api-keys)
4. Create a new API key
5. Copy the key to your `.env.local` file

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience  
- **Tailwind CSS** - Utility-first CSS framework
- **next-themes** - Dark mode implementation
- **Resend** - Email delivery service
- **JSONPlaceholder API** - Mock data for posts and users

## Project Structure

```
post-dashboard/
├── app/
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts        # Email API endpoint
│   ├── post/
│   │   └── [id]/
│   │       └── page.tsx        # Individual post page
│   ├── settings/
│   │   └── page.tsx           # Settings page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx              # Main dashboard
├── components/
│   ├── back-to-top.tsx        # Back to top button
│   ├── header.tsx             # Page header component
│   └── share-email-modal.tsx  # Email sharing modal
└── public/                    # Static assets
```

## API Endpoints

### POST /api/send-email
Send a post via email using the Resend API.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "post": {
    "id": 1,
    "title": "Post Title",
    "body": "Post content..."
  },
  "author": "Author Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Features Overview

### Dashboard
- View all posts in a responsive table/card layout
- Search posts by title with highlighted results
- Filter posts by author
- Real-time filtering with active filter indicators
- Post statistics in the header

### Email Sharing
- Click the "Share" button on any post
- Enter recipient email address
- Sends beautifully formatted HTML email with post content
- Success/error feedback with loading states

### Dark Mode
- System preference detection
- Manual toggle in settings
- Persistent theme selection
- Smooth transitions between themes

### Post Management
- View individual posts on dedicated pages
- Delete posts with loading feedback
- Responsive design for all screen sizes

## Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Connect your GitHub repository
2. Add your `RESEND_API_KEY` environment variable
3. Deploy with one click

### Other Platforms
You can deploy to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

Make sure to set the `RESEND_API_KEY` environment variable on your chosen platform.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
