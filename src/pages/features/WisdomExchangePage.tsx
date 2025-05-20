import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WisdomExchangePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground objectCount={7}>
        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-8 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

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
              Connect with mentors, share knowledge, and grow together. Our mentorship platform helps you find guidance or offer your expertise to those who need it.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Find a Mentor</CardTitle>
                <CardDescription>
                  Connect with experienced guides in your field
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Discover mentors with expertise in your areas of interest who can provide personalized guidance to help you achieve your goals.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Knowledge Resources</CardTitle>
                <CardDescription>
                  Access curated learning materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Browse our collection of articles, guides, and resources created by mentors to help you develop new skills and deepen your understanding.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mb-2">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Become a Mentor</CardTitle>
                <CardDescription>
                  Share your wisdom with others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Give back to the community by becoming a mentor. Share your knowledge, experience, and insights to help others on their journey.</p>
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
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
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

export default WisdomExchangePage;
