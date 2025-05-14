
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface CaseStudy {
  title: string;
  description: string;
}

interface StoriesSectionProps {
  data: CaseStudy[];
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ data }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-16 md:py-20 px-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-6 md:mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Case Studies</h2>
        <div className="h-1 w-20 bg-primary mx-auto"></div>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Civilizations used monuments. We use memory. From pyramids in Egypt to cave drawings in France, 
          humans have always tried to etch memory into permanence.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto w-full">
        {data.map((caseStudy, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-3 md:mb-6 max-w-[85vw] mx-auto md:max-w-none"
          >
            <Card className="backdrop-blur-sm bg-background/80 shadow-lg">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-primary">{caseStudy.title}</h3>
                  <p className="text-xs md:text-base mb-1 md:mb-3">{caseStudy.description}</p>
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
