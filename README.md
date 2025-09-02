# CDT Jamaica - Dance Company Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive website for CDT Jamaica, featuring a headless CMS for easy content management and a performant React frontend.

## 📋 Project Structure

```
.
├── cdt-sanity/     # Sanity Studio (Headless CMS)
└── frontend/       # React frontend application
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Sanity CLI (for CMS development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/glitterrock-vampire/CDT-Jamaica.git
   cd CDT-Jamaica
   ```

2. **Set up the Sanity Studio (Backend)**
   ```bash
   cd cdt-sanity
   npm install
   cp .env.example .env.local
   # Update environment variables in .env.local
   npm run dev
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Update environment variables in .env.local
   npm start
   ```

## 🛠 Built With

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Sanity.io
- **Deployment**: Vercel

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Animations with [Framer Motion](https://www.framer.com/motion/)
