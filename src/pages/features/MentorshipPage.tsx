
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Award, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MentorshipPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground objectCount={7}>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Mentorship
            </motion.h1>
            
            <motion.p 
              className="text-xl max-w-3xl mx-auto text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Guidance from experience to ignite your growth. Connect with mentors who can guide you through your journey, offering valuable insight and support to help bring your ideas to life.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mb-2">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Matched Expertise</CardTitle>
                <CardDescription>
                  Connect with mentors who have expertise in your specific area of interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our intelligent matching algorithm pairs you with mentors who have the exact skills and experience you need, ensuring relevant guidance.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mb-2">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Knowledge Transfer</CardTitle>
                <CardDescription>
                  Learn from decades of experience in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Gain insights that would take years to develop on your own, accelerating your growth and avoiding common pitfalls.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Flexible Schedule</CardTitle>
                <CardDescription>
                  Book sessions that fit into your life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our mentors offer flexible scheduling options, making it easy to find time for guidance no matter your timezone or schedule.</p>
              </CardContent>
            </Card>
          </div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/signup")}
            >
              Find Your Mentor <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="mt-4 text-muted-foreground">
              Already have an account? <a href="/signin" className="text-primary hover:underline">Sign in</a> to connect with mentors.
            </p>
          </motion.div>
        </div>
      </AnimatedBackground>
    </div>
  );
};

export default MentorshipPage;
