
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface CaseStudy {
  title: string;
  content?: string;
  description?: string;
}

interface CaseStudiesProps {
  data: {
    items: CaseStudy[];
  } | CaseStudy[];
}

const CaseStudiesSection: React.FC<CaseStudiesProps> = ({ data }) => {
  // Handle both array of case studies and object with items array
  const caseStudies = Array.isArray(data) ? data : data.items || [];

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
    <div className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Case Studies</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Civilizations used monuments. We use memory. From pyramids in Egypt to cave drawings in France, 
            humans have always tried to etch memory into permanence.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {caseStudies.map((study, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-primary/10 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-primary">{study.title}</h3>
                  <p className="text-muted-foreground">{study.content || study.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CaseStudiesSection;
