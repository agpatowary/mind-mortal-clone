
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MetricItem {
  label: string;
  value: string;
}

interface CtaSectionProps {
  data: {
    title: string;
    description: string;
    buttonText: string;
    metrics?: MetricItem[];
  };
}

const CtaSection: React.FC<CtaSectionProps> = ({ data }) => {
  const navigate = useNavigate();
  
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
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg bg-[#F97316] hover:bg-[#F97316]/90"
              onClick={() => navigate("/signup")}
            >
              {data.buttonText}
            </Button>
          </div>

          {data.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {data.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="font-bold text-4xl text-primary mb-2">{metric.value}</div>
                  <div className="text-muted-foreground">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CtaSection;
