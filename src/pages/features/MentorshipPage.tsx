
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { ArrowLeft, Users, Star, BookOpen, Award } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const MentorshipFeaturePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatedBackground 
      mouseInteraction={true} 
      density={30} 
      speed={10} 
      interactionStrength={100}
      particleSize="mixed"
    >
      <div className="min-h-screen text-white">
        {/* Back button - Added to match LegacyVaultPage */}
        <motion.button
          className="fixed top-6 left-6 z-50 flex items-center space-x-2 text-white/80 hover:text-white"
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>

        {/* Header */}
        <header className="pt-20 pb-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-4">
              <Logo variant="light" className="w-12 h-12 mr-4" interactive={false} />
              <div>
                <h1 className="text-4xl font-bold text-white">Mentorship</h1>
                <p className="text-white/70">Guidance from experience to ignite your growth</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Learn from Experienced Mentors</h2>
                <p className="text-xl text-white/80 mb-8">
                  Connect with mentors who can guide you through your journey, offering valuable insight and support to help bring your ideas to life.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Users className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Find the right mentor</h3>
                      <p className="text-white/70">Connect with experts in your specific field of interest</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Star className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Personalized guidance</h3>
                      <p className="text-white/70">Get tailored advice and feedback on your projects</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <BookOpen className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Access wisdom resources</h3>
                      <p className="text-white/70">Learn from curated content provided by mentors</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Award className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Track your progress</h3>
                      <p className="text-white/70">Celebrate your achievements and growth milestones</p>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full"
                  onClick={() => navigate('/signup')}
                >
                  Find a Mentor
                </Button>
              </motion.div>

              {/* Right Column - Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center mb-6">
                  <Users size={24} className="text-primary mr-2" />
                  <h3 className="text-2xl font-bold">Mentorship Preview</h3>
                </div>

                {/* Mentors preview */}
                <Card className="bg-black/50 border-white/5 text-white mb-6">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-medium mb-2">Dr. Alex Morgan</h4>
                    <p className="text-sm text-white/70 mb-3">
                      20+ years of experience in sustainable innovation and entrepreneurship.
                    </p>
                    <div className="flex space-x-2">
                      <Badge className="bg-white/10 hover:bg-white/20">Sustainability</Badge>
                      <Badge className="bg-white/10 hover:bg-white/20">Business</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-white/5 text-white mb-6">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-medium mb-2">Sarah Chen</h4>
                    <p className="text-sm text-white/70 mb-3">
                      Technology innovator with expertise in AI and machine learning applications.
                    </p>
                    <div className="flex space-x-2">
                      <Badge className="bg-white/10 hover:bg-white/20">Technology</Badge>
                      <Badge className="bg-white/10 hover:bg-white/20">AI</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-white/5 text-white mb-6">
                  <CardContent className="p-4">
                    <h4 className="text-lg font-medium mb-2">James Williams</h4>
                    <p className="text-sm text-white/70 mb-3">
                      Former Fortune 500 executive helping new entrepreneurs navigate business challenges.
                    </p>
                    <div className="flex space-x-2">
                      <Badge className="bg-white/10 hover:bg-white/20">Leadership</Badge>
                      <Badge className="bg-white/10 hover:bg-white/20">Strategy</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center mt-8">
                  <p className="text-white/60 mb-4">Sign in to connect with mentors</p>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10 w-full"
                  >
                    Sign In
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default MentorshipFeaturePage;
