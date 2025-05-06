
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CtaSectionProps {
  data: {
    title: string;
    description: string;
    buttonText: string;
  };
}

const CtaSection: React.FC<CtaSectionProps> = ({ data }) => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-20 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{data.title}</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {data.description}
          </p>
          
          <div className="mb-16">
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                {data.buttonText}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-bold text-4xl text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Active Users</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-bold text-4xl text-primary mb-2">50k+</div>
              <div className="text-muted-foreground">Legacies Preserved</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-bold text-4xl text-primary mb-2">5k+</div>
              <div className="text-muted-foreground">Mentorships Created</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CtaSection;
