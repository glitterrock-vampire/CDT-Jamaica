import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Simulate loading delay for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-4xl w-full">
        <div className="bg-black overflow-hidden">
          {/* Image */}
          <div className={`transition-all duration-1000 ease-in-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src="/images/CDT Streams 2025- Main Flyer copy.jpg"
              alt="CDT Jamaica 2025 Main Flyer"
              className="w-full h-auto"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
              onLoad={handleImageLoad}
            />
          </div>
          
          {/* Buy Tickets Button */}
          <div className="p-4 text-center">
            <a
              href="https://www.linktr.ee/cdtjamaica"
              target="_blank"
              rel="noopener noreferrer"
              className={`button-85 w-full text-center block py-4 px-8 ${isDarkMode ? 'dark' : 'light'}`}
              style={{
                fontSize: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Buy Tickets
            </a>
          </div>
          <style jsx global>{`
            .button-85 {
              padding: 0.8em 2em;
              border: none;
              outline: none;
              color: rgb(255, 255, 255);
              background: #111;
              cursor: pointer;
              position: relative;
              z-index: 0;
              border-radius: 10px;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
              font-weight: bold;
              text-decoration: none;
              display: block;
              transition: all 0.3s ease;
            }
            
            .button-85.light {
              color: #000;
            }

            .button-85:before {
              content: "";
              background: linear-gradient(
                45deg,
                #ff0000,
                #ff7300,
                #fffb00,
                #48ff00,
                #00ffd5,
                #002bff,
                #7a00ff,
                #ff00c8,
                #ff0000
              );
              position: absolute;
              top: -2px;
              left: -2px;
              background-size: 400%;
              z-index: -1;
              filter: blur(5px);
              -webkit-filter: blur(5px);
              width: calc(100% + 4px);
              height: calc(100% + 4px);
              animation: glowing-button-85 20s linear infinite;
              transition: opacity 0.3s ease-in-out;
              border-radius: 10px;
            }

            @keyframes glowing-button-85 {
              0% { background-position: 0 0; }
              50% { background-position: 400% 0; }
              100% { background-position: 0 0; }
            }

            .button-85:after {
              z-index: -1;
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              background: #111;
              left: 0;
              top: 0;
              border-radius: 10px;
              transition: background-color 0.3s ease;
            }
            
            .light:after {
              background: #f3f4f6;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default Home;
