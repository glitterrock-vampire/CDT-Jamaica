# CDT Jamaica - Frontend

This is the frontend application for CDT Jamaica, built with React and integrated with Sanity.io as the headless CMS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Sanity Studio project (see [cdt-sanity/README.md](../cdt-sanity/README.md))

### Installation

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

2. **Environment Setup**
   Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_SANITY_PROJECT_ID=your_project_id
   REACT_APP_SANITY_DATASET=production
   REACT_APP_SANITY_API_VERSION=2023-05-03
   ```

3. **Start Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## 🛠 Features

- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Performance Optimized**: Code splitting and lazy loading
- **Modern UI**: Built with Tailwind CSS and Framer Motion

## 📂 Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable UI components
│   ├── context/      # React context providers
│   ├── pages/        # Page components
│   ├── styles/       # Global styles
│   ├── App.js        # Main App component
│   └── index.js      # Entry point
```

## 🚀 Deployment

This project is configured for deployment on Vercel. The production build can be created with:

```bash
npm run build
# or
yarn build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
