
import React from 'react';
import { motion } from 'framer-motion';
import { Archive, Users, Clock, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Feature } from '@/types';

interface FeaturesSectionProps {
  data: {
    title: string;
    items: Feature[];
  };
}

const FeatureIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'archive':
      return <Archive className="h-8 w-8 md:h-10 md:w-10 text-primary" />;
    case 'users':
      return <Users className="h-8 w-8 md:h-10 md:w-10 text-primary" />;
    case 'clock':
      return <Clock className="h-8 w-8 md:h-10 md:w-10 text-primary" />;
    case 'lightbulb':
      return <Lightbulb className="h-8 w-8 md:h-10 md:w-10 text-primary" />;
    default:
      return <Archive className="h-8 w-8 md:h-10 md:w-10 text-primary" />;
  }
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ data }) => {
  const navigate = useNavigate();
  
  // Map new title and links for features
  const updatedFeatures = data.items.map(feature => {
    let updatedFeature = { ...feature };
    
    // Update "Knowledge Exchange" to "Mentorship"
    if (feature.title === 'Knowledge Exchange') {
      updatedFeature.title = 'Mentorship';
      updatedFeature.description = 'Guidance from experience to ignite your growth.';
      updatedFeature.link = '/features/mentorship';
      updatedFeature.cta = 'Find a Mentor';
    } else if (feature.title === 'Legacy') {
      updatedFeature.description = 'Preserve your legacy for future generations.';
      updatedFeature.link = '/features/legacy-vault';
      updatedFeature.cta = 'Create Your Legacy';
    } else if (feature.title === 'Timeless Messages') {
      updatedFeature.description = 'Leave a message that lasts forever.';
      updatedFeature.link = '/features/timeless-messages';
      updatedFeature.cta = 'Create a Timeless Message';
    } else if (feature.title === 'Idea') {
      updatedFeature.description = 'Refine, share, and fund your ideas.';
      updatedFeature.link = '/features/idea-vault';
      updatedFeature.cta = 'Start Your Idea';
    }
    
    return updatedFeature;
  });

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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 md:py-20 px-4" id="features-section">
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto w-full"
      >
        {updatedFeatures.map((feature, index) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card 
              className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden max-w-[90vw] md:max-w-none mx-auto"
              onClick={() => feature.link && navigate(feature.link)}
            >
              <CardHeader className="pb-1 md:pb-2 text-center px-3 pt-3 md:px-6 md:pt-6">
                <div className="flex justify-center mb-2 md:mb-4">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <CardTitle className="text-base md:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
                <p className="text-center text-xs md:text-base text-muted-foreground">
                  {feature.description}
                </p>
                <motion.div 
                  className="mt-2 md:mt-4 text-primary text-center text-xs md:text-base font-medium"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                >
                  {feature.cta || "Learn More"} →
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturesSection;
