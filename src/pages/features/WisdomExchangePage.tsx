
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { ArrowLeft, Users, MessageCircle, FileText, UsersRound } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const WisdomExchangePage: React.FC = () => {
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
        {/* Back button */}
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
                <h1 className="text-4xl font-bold text-white">Wisdom Exchange</h1>
                <p className="text-white/70">Share knowledge across generations</p>
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
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Connect Across Generations</h2>
                <p className="text-xl text-white/80 mb-8">
                  Wisdom Exchange facilitates mentorship and knowledge sharing between experienced
                  professionals and those seeking guidance.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <UsersRound className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Connect with verified mentors</h3>
                      <p className="text-white/70">Find experienced professionals in your field of interest</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <MessageCircle className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Schedule one-on-one sessions</h3>
                      <p className="text-white/70">Get personalized mentorship through video calls or messaging</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <FileText className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Access curated resources</h3>
                      <p className="text-white/70">Explore a library of guides, tutorials, and knowledge bases</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Users className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Join community discussions</h3>
                      <p className="text-white/70">Participate in forums and Q&A sessions with peers and mentors</p>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full"
                  onClick={() => navigate('/signup')}
                >
                  Join the Exchange
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
                  <MessageCircle size={24} className="text-primary mr-2" />
                  <h3 className="text-2xl font-bold">Wisdom Exchange Preview</h3>
                </div>

                <Card className="bg-black/50 border-white/5 text-white mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-10">
                      <p className="text-center text-white/70 mb-4">
                        Sign in to access the Wisdom Exchange platform
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Sign In
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <h4 className="text-xl font-medium mb-4">Popular Exchange Topics</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-primary/20 text-white hover:bg-primary/30">Career Development</Badge>
                  <Badge className="bg-primary/20 text-white hover:bg-primary/30">Technology</Badge>
                  <Badge className="bg-primary/20 text-white hover:bg-primary/30">Finance</Badge>
                  <Badge className="bg-primary/20 text-white hover:bg-primary/30">Life Skills</Badge>
                  <Badge className="bg-primary/20 text-white hover:bg-primary/30">Craftsmanship</Badge>
                  <Badge className="bg-primary/20 text-white hover:bg-primary/30">Education</Badge>
                  <Badge className="bg-primary/20 text-white hover:bg-primary/30">Health & Wellness</Badge>
                </div>

                <h4 className="text-xl font-medium mb-4">Featured Mentors</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users size={18} className="text-primary" />
                      </div>
                      <div>
                        <h5 className="font-medium">Mentor {i}</h5>
                        <p className="text-xs text-white/60">{i % 2 === 0 ? 'Technology' : 'Finance'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default WisdomExchangePage;
