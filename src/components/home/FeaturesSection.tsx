
import React from 'react';
import { motion } from 'framer-motion';
import { Archive, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  data: {
    title: string;
    items: Feature[];
  };
}

const FeatureIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'archive':
      return <Archive className="h-10 w-10 text-primary" />;
    case 'users':
      return <Users className="h-10 w-10 text-primary" />;
    case 'clock':
      return <Clock className="h-10 w-10 text-primary" />;
    default:
      return <Archive className="h-10 w-10 text-primary" />;
  }
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ data }) => {
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
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">{data.title}</h2>
        <div className="h-1 w-20 bg-primary mx-auto"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {data.items.map((feature, index) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 text-center">
                <div className="flex justify-center mb-4">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturesSection;
