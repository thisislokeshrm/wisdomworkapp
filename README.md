This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## Project Structure
/lms-nextjs
├── /public                   # Static assets (images, fonts, etc.)
│   ├── /images               # Images for the project
│   └── favicon.ico           # Favicon
├── /src                      # Main source folder
│   ├── /app                  # App directory for pages and components
│   │   ├── /api              # API routes (serverless functions)
│   │   ├── /components       # Reusable components
│   │   │   ├── /common       # Common UI components (buttons, inputs, etc.)
│   │   │   ├── /layouts      # Layout components (header, footer, etc.)
│   │   │   └── /modals       # Modal components
│   │   ├── /context          # Context providers for state management
│   │   │   ├── AuthContext.tsx # Authentication context
│   │   │   └── CourseContext.tsx # Course context
│   │   ├── /hooks            # Custom hooks
│   │   │   └── useAuth.ts    # Hook for authentication
│   │   ├── /interfaces        # TypeScript interfaces
│   │   │   ├── Course.ts      # Course interface
│   │   │   ├── User.ts        # User interface
│   │   │   └── ...            # Other interfaces
│   │   ├── /middleware        # Middleware functions
│   │   ├── /styles           # Global styles (Tailwind CSS)
│   │   │   ├── globals.css     # Global CSS file
│   │   │   └── tailwind.css    # Tailwind CSS setup
│   │   ├── /layout.tsx       # Main layout for the app
│   │   ├── /page.tsx         # Default landing page (index)
│   │   ├── /login             # Login page
│   │   ├── /dashboard         # Dashboard for students/teachers
│   │   └── /[courseId]       # Dynamic course page
│   ├── /utils                # Utility functions and helpers
│   │   └── firebase.ts        # Firebase configuration and functions
├── .env                      # Environment variables
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore file
├── package.json              # Project dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
