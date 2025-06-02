
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface CaseStudy {
  title: string;
  description: string;
}

interface CaseStudiesSectionProps {
  data: {
    title: string;
    studies: CaseStudy[];
  };
}

const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-16 md:py-20 px-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-6 md:mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">{data.title}</h2>
        <div className="h-1 w-20 bg-primary mx-auto"></div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto w-full"
      >
        {data.studies.map((study, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="mb-3 md:mb-6 max-w-[85vw] mx-auto md:max-w-none"
          >
            <Card className="backdrop-blur-sm bg-background/80 shadow-lg">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-primary">{study.title}</h3>
                  <p className="text-xs md:text-base mb-1 md:mb-3">{study.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CaseStudiesSection;
