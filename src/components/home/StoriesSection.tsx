
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface Story {
  quote: string;
  author: string;
}

interface StoriesSectionProps {
  data: {
    title: string;
    items: Story[];
  };
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ data }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-16 md:py-20 px-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-8 md:mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">{data.title}</h2>
        <div className="h-1 w-20 bg-primary mx-auto"></div>
      </motion.div>

      <div className="max-w-5xl mx-auto w-full">
        {data.items.map((story, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-4 md:mb-8 max-w-[90vw] mx-auto md:max-w-none"
          >
            <Card className="backdrop-blur-sm bg-background/80 shadow-lg">
              <CardContent className="pt-3 pb-3 md:pt-6 md:pb-5 px-3 md:px-6">
                <div className="flex flex-col items-center text-center">
                  <svg 
                    className="w-6 h-6 md:w-12 md:h-12 text-primary/20 mb-2 md:mb-4" 
                    fill="currentColor" 
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-xs md:text-lg lg:text-xl mb-2 md:mb-4 italic">{story.quote}</p>
                  <p className="text-xs md:text-sm text-muted-foreground font-semibold">— {story.author}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoriesSection;
