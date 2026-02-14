# Trusted Trades Network

A directory of vetted tradespeople in the Greater Austin area.

## Tech Stack

- **Eleventy** - Static site generator
- **TailwindCSS** - Utility-first CSS framework
- **Cloudflare Pages** - Hosting & deployment

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── _data/          # Site data (trades, companies)
├── _includes/      # Layout templates
├── assets/         # CSS, images, icons
├── companies/      # Company profile pages
├── trades/         # Trades directory
├── apply.njk       # Application form
├── join.njk        # Join the network page
└── index.njk       # Homepage
```

## Adding a New Company

1. Add company data to `src/_data/companies.json`
2. Create a profile page in `src/companies/[company-slug].njk`

## Deployment

Connected to Cloudflare Pages. Push to `main` to deploy.
