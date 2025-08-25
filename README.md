# Currency Exchange Website

A comprehensive currency exchange and forex trading information website built with React, TypeScript, and Vite.

## Project Overview

This website provides:
- Real-time currency exchange rates
- Forex trading guides and educational content
- AI forex trading tutorials
- Currency conversion tools
- Market analysis and insights

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Database**: Supabase
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gnosis118/currency.git
cd currency
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run cms` - Start Decap CMS local backend for the visual editor

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── data/          # Static data and blog posts
├── assets/        # Images and static assets
├── lib/           # Utility functions
└── hooks/         # Custom React hooks
```

## Deployment

This project can be deployed to any static hosting service:

- **Netlify**: Connect your GitHub repository
- **Vercel**: Import project from GitHub
- **GitHub Pages**: Use GitHub Actions for deployment
- **AWS S3**: Upload build files to S3 bucket

To build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## CMS (Decap) Visual Editor

### Local editing
- Run the site: `npm run dev`
- In another terminal: `npm run cms`
- Open: `http://localhost:5173/admin/`

Notes:
- `public/admin/config.yml` has `local_backend: true`, so no login needed locally
- Posts are saved to `src/content/blog`
- Uploads go to `public/images/uploads`

### Netlify production setup
1. Enable Identity: Site settings → Identity → Enable Identity
2. Enable Git Gateway: Site settings → Identity → Services → Enable Git Gateway
3. Invite yourself as a user in Identity, accept via email
4. Visit your live site `/admin/`, log in with Netlify Identity, create/edit posts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push to your fork
5. Create a pull request

## License

This project is licensed under the MIT License.

