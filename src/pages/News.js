import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Hero from '../components/Hero';
import { getSiteSettings } from '../lib/siteSettings';

const News = () => {
  const { isDarkMode } = useTheme();
  const [siteSettings, setSiteSettings] = useState(null);

  const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-black' : 'bg-white';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const archiveData = [
    {
      season: "SIR 2024",
      items: [
        // {
        //   publication: "Jamaica Gleaner",
        //   date: "November 10, 2024",
        //   type: "article",
        //   url: "https://jamaica-gleaner.com/article/entertainment/20241110/dance-companies-pay-joyful-tribute-tony-wilson#slideshow-2",
        //   headline: "Dance companies pay joyful tribute to Tony Wilson"
        // },
        // {
        //   publication: "CVM @ Sunrise",
        //   date: "November 6, 2024",
        //   type: "video",
        //   url: "https://www.youtube.com/watch?v=Z_3oLcaza2A",
        //   headline: "CVM Sunrise Interview"
        // },
        // {
        //   publication: "CVM @ Sunrise",
        //   date: "November 6, 2024",
        //   type: "video",
        //   url: "https://www.youtube.com/watch?v=Z_3oLcaza2A",
        //   headline: "CVM Sunrise Performance"
        // },
        // {
        //   publication: "CVM @ Sunrise",
        //   date: "November 6, 2024",
        //   type: "video",
        //   url: "https://www.youtube.com/watch?v=Z_3oLcaza2A",
        //   headline: "Abigail Berry and Andrew Bailey Blueprint"
        // }
      ]
    },
    {
      season: "JUNE GALA 2024",
      items: [
        {
          publication: "Jamaica Observer",
          date: "June 20, 2024",
          type: "article",
          url: "https://www.jamaicaobserver.com/2024/06/16/cdt-gala-bravo/",
          headline: "CDT Gala Bravo"
        },
        // {
        //   publication: "Jamaica Gleaner",
        //   date: "June 13, 2024",
        //   type: "article",
        //   url: "https://jamaica-gleaner.com/article/lifestyle/20240613/something-extra-thursday#google_vignette",
        //   headline: "Something Extra Thursday"
        // },
        {
          publication: "Google Drive",
          date: "June 13, 2024",
          type: "file",
          url: "https://drive.google.com/file/d/16gKyVzm_MUgxVo4pGMf2_Lh4v2xDabH4/view?usp=drive_link",
          headline: "June Gala 2024 Coverage"
        },
        {
          publication: "Jamaica Gleaner",
          date: "June 12, 2024",
          type: "article",
          url: "https://jamaica-gleaner.com/article/entertainment/20240612/cdt-gala-enjoyed-enthusiastic-audience",
          headline: "CDT Gala enjoyed by enthusiastic audience"
        }
      ]
    },
    {
      season: "IGNITE 2023",
      items: [
        // {
        //   publication: "CVM @ Sunrise",
        //   date: "November 9, 2023",
        //   type: "video",
        //   url: "https://www.youtube.com/watch?v=Z_3oLcaza2A",
        //   headline: "Interview"
        // },
        {
          publication: "TVJ Smile Jamaica",
          date: "October 26, 2023",
          type: "file",
          url: "https://drive.google.com/file/d/1eRexUGOp2uA1WAm63p4J_fmNaswNAovm/view?usp=drive_link",
          headline: "Morning Show Performance"
        },
        {
          publication: "Our Today",
          date: "October 26, 2023",
          type: "article",
          url: "https://our.today/cdt-excites-with-ignite-season-of-dance-2023-complete/",
          headline: "CDT excites with Ignite Season of Dance 2023"
        }
      ]
    },
    {
      season: "CODA 2023",
      items: [
        {
          publication: "Jamaica Observer",
          date: "July 9, 2023",
          type: "article",
          url: "https://www.jamaicaobserver.com/entertainment/the-cdt-school-mounts-summer-intensive/",
          headline: "The CDT School mounts summer intensive"
        }
      ]
    },
    {
      season: "JUNE GALA 2023",
      items: [
        {
          publication: "Jamaica Observer",
          date: "June 18, 2023",
          type: "article",
          url: "https://www.jamaicaobserver.com/entertainment/cdt-june-gala/",
          headline: "CDT June Gala"
        }
      ]
    },
    {
      season: "LEGACY 2022",
      items: [
        // {
        //   publication: "Loop News",
        //   date: "November 28, 2022",
        //   type: "article",
        //   url: "http://jamaica.loopnews.com/content/sunday-well-spent-company-dance-theatre-635376",
        //   headline: "Sunday well spent at Company Dance Theatre"
        // },
        // {
        //   publication: "Jamaica Observer",
        //   date: "November 27, 2022",
        //   type: "article",
        //   url: "https://www.jamaicaobserver.com/entertainment/a-true-legacy-of-dance/amp/",
        //   headline: "A true legacy of dance"
        // },
        // {
        //   publication: "Jamaica Gleaner",
        //   date: "November 24, 2022",
        //   type: "article",
        //   url: "https://jamaica-gleaner.com/article/entertainment/20221124/legacy-provided-two-hours-joyful-dance",
        //   headline: "Legacy provided two hours of joyful dance"
        // },
        {
          publication: "Jamaica Observer",
          date: "November 20, 2022",
          type: "article",
          url: "https://www.jamaicaobserver.com/entertainment/cdt-cements-its-legacy/",
          headline: "CDT cements its legacy"
        },
        {
          publication: "Google Drive",
          date: "November 20, 2022",
          type: "file",
          url: "https://drive.google.com/file/d/1dyb-ruJLv9SzGcTQVwiu2-gAo_5uB_Ca/view?usp=share_link",
          headline: "Legacy Coverage File 1"
        },
        {
          publication: "Google Drive",
          date: "November 20, 2022",
          type: "file",
          url: "https://drive.google.com/file/d/1e0M3HR5-FPhGQPK8jXGf-h_iRqyJ_irO/view?usp=sharing",
          headline: "Legacy Coverage File 2"
        },
        // {
        //   publication: "Jamaica Gleaner",
        //   date: "November 16, 2022",
        //   type: "article",
        //   url: "https://jamaica-gleaner.com/article/entertainment/20221116/legacy-season-debut-dance-company",
        //   headline: "Legacy season debut for dance company"
        // },
        {
          publication: "TVJ Smile Jamaica",
          date: "November 15, 2022",
          type: "file",
          url: "https://drive.google.com/file/d/1lNjeiDy71t7oLXfRU_XM7PFHW3fFHLHV/view?usp=sharing",
          headline: "Morning Show Performance"
        },
        {
          publication: "Our Today",
          date: "November 14, 2022",
          type: "article",
          url: "https://our.today/cdt-kicks-off-its-inaugural-season-of-dance-legacy-with-local-and-international-choreographers/",
          headline: "CDT kicks off its inaugural Season of Dance Legacy"
        }
      ]
    },
    {
      season: "CODA 2021",
      items: [
        {
          publication: "Jamaica Observer",
          date: "August 8, 2021",
          type: "article",
          url: "https://www.jamaicaobserver.com/art-culture/cdt-arts-new-kid-on-the-dance-block/",
          headline: "CDT Arts – New kid on the dance block"
        },
        {
          publication: "Google Drive",
          date: "August 8, 2021",
          type: "file",
          url: "https://drive.google.com/file/d/1e1CfH3VbE7J_Jy3oubC1nvwx8AolhkDD/view?usp=sharing",
          headline: "CODA 2021 Coverage"
        }
      ]
    }
  ];

  const getActionText = (type) => {
    switch (type) {
      case 'video': return 'Watch Video';
      case 'file': return 'SEE MORE';
      default: return 'Read Article';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Hero Section */}
      {siteSettings?.heroImage && (
        <Hero
          image={siteSettings.heroImage}
          title="News + Press"
          subtitle="Press coverage and media appearances"
        />
      )}

      {/* Archive Content */}
      <section className={`py-16 md:py-24 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Newspaper-style header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={`inline-block px-6 py-3 border-t-2 border-b-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-900'} mb-6`}>
                <span className="text-lg font-bold tracking-widest uppercase text-orange-600 dark:text-orange-400">Press Archive</span>
              </div>
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                CDT Jamaica in the News
              </h1>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${mutedText} leading-relaxed`}>
                A comprehensive collection of media coverage, interviews, and features documenting our journey through contemporary Caribbean dance
              </p>
            </motion.div>

            {/* Archive Sections */}
            <motion.div
              className="space-y-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {archiveData.map((season, seasonIndex) => (
                <motion.div
                  key={season.season}
                  className="border-t-2 pt-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: seasonIndex * 0.1 }}
                >
                  {/* Season Header */}
                  <div className="mb-10">
                    <h2 className={`text-3xl md:text-4xl font-normal tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {season.season}
                    </h2>
                    <div className={`w-24 h-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-900'}`}></div>
                  </div>
                  
                  {/* Articles Grid */}
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {season.items.map((item, itemIndex) => (
                      <motion.article
                        key={`${season.season}-${itemIndex}`}
                        className={`group border-l-4 pl-6 ${isDarkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-600'} transition-all duration-300`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: seasonIndex * 0.1 + itemIndex * 0.1 }}
                      >
                        {/* Publication and Date */}
                        <div className="mb-3">
                          <div className={`text-xs font-bold tracking-widest uppercase ${mutedText} mb-1`}>
                            {item.publication}
                          </div>
                          <div className={`text-sm ${mutedText} font-light`}>
                            {item.date}
                          </div>
                        </div>
                        
                        {/* Headline */}
                        <h3 className={`text-lg md:text-xl font-normal mb-4 leading-tight ${isDarkMode ? 'text-white' : 'text-black'} group-hover:opacity-90 transition-opacity`}>
                          {item.headline}
                        </h3>
                        
                        {/* Read More Link */}
                        <div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center text-sm font-medium tracking-wide uppercase ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors group-hover:translate-x-1 transform duration-300`}
                          >
                            {getActionText(item.type)}
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer Note */}
            <motion.div
              className="mt-24 pt-12 border-t-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className={`text-sm ${mutedText} italic`}>
                "Through movement, we tell stories that transcend borders and celebrate the rich tapestry of Caribbean culture."
              </p>
              <p className={`text-xs ${mutedText} mt-2`}>
                Archive last updated: November 2024
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
