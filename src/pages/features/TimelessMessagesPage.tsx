
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { ArrowLeft, Clock, FileText, Calendar, Bell, Heart } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const TimelessMessagesFeaturePage: React.FC = () => {
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
                <h1 className="text-4xl font-bold text-white">Timeless Messages</h1>
                <p className="text-white/70">Send messages to the future</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Right Column - Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="order-2 lg:order-1 bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center mb-6">
                  <Clock size={24} className="text-primary mr-2" />
                  <h3 className="text-2xl font-bold">Timeless Messages Preview</h3>
                </div>

                <Card className="bg-black/50 border-white/5 text-white mb-8">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-10">
                      <p className="text-center text-white/70 mb-4">
                        Sign in to access Timeless Messages
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

                <h4 className="text-xl font-medium mb-4">Message Examples</h4>
                
                <div className="space-y-4">
                  <Card className="bg-black/40 border-white/5 hover:bg-black/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Birthday Wishes</h5>
                        <Calendar size={16} className="text-primary/80" />
                      </div>
                      <p className="text-sm text-white/70">
                        A series of birthday messages for your child's milestone birthdays.
                      </p>
                      <div className="mt-2 text-xs text-white/50">Delivery: Multiple dates</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/40 border-white/5 hover:bg-black/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Graduation Advice</h5>
                        <Bell size={16} className="text-primary/80" />
                      </div>
                      <p className="text-sm text-white/70">
                        Wisdom and congratulations to be delivered upon graduation.
                      </p>
                      <div className="mt-2 text-xs text-white/50">Delivery: Event triggered</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/40 border-white/5 hover:bg-black/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Family History</h5>
                        <FileText size={16} className="text-primary/80" />
                      </div>
                      <p className="text-sm text-white/70">
                        Stories about family ancestry to be shared on a future date.
                      </p>
                      <div className="mt-2 text-xs text-white/50">Delivery: June 12, 2026</div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Left Column - Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Send Messages to the Future</h2>
                <p className="text-xl text-white/80 mb-8">
                  Timeless Messages enables you to schedule personal communications to be delivered at
                  specific future dates or triggered by events.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <FileText className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Create multimedia messages</h3>
                      <p className="text-white/70">Combine text, audio, and video in your messages</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Calendar className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Schedule specific delivery dates</h3>
                      <p className="text-white/70">Set exact dates or milestones for message delivery</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Bell className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Conditional delivery options</h3>
                      <p className="text-white/70">Trigger messages based on specific life events</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Heart className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">Reach loved ones when needed</h3>
                      <p className="text-white/70">Ensure your words are there during important moments</p>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full"
                  onClick={() => navigate('/signup')}
                >
                  Start Creating
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default TimelessMessagesPage;
