# Headcount Planning Tool

A headcount planning model tool built with Next.js, React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Font**: Inter

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete design system specifications.

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions
└── DESIGN_SYSTEM.md # Design system documentation
```

## Adding shadcn/ui Components

To add shadcn/ui components, use:

```bash
npx shadcn-ui@latest add [component-name]
```

For example:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
```

