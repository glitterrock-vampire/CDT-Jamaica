# CDT Jamaica - Sanity Studio

This is the Sanity Studio for the CDT Jamaica website, serving as the content management system for the dance company's repertoire, performances, and other content.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```
   SANITY_STUDIO_YOUTUBE_API_KEY=your_youtube_api_key
   SANITY_STUDIO_API_PROJECT_ID=your_project_id
   SANITY_STUDIO_API_DATASET=production
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The studio will be available at [http://localhost:3333](http://localhost:3333)

## 🔧 Features

- **Content Management**: Manage all website content including repertoire, performances, and media
- **YouTube Integration**: Automatically fetch video durations using the YouTube API
- **Custom Schema**: Custom content types tailored for the dance company's needs

## 🛠 Built With

- [Sanity.io](https://www.sanity.io/) - Headless CMS
- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Type checking

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
