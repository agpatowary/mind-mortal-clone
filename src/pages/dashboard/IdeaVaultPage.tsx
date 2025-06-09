import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, TrendingUp, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PostInteractions from "@/components/social/PostInteractions";
import PostDetailsModal from "@/components/modals/PostDetailsModal";
import { Badge } from "@/components/ui/badge";
import DashboardAnimatedBackground from "@/components/dashboard/DashboardAnimatedBackground";

const IdeaVaultPage: React.FC = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchIdeas();
    }
  }, [user]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("idea_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching ideas:", error);
      } else {
        setIdeas(data || []);
      }
    } catch (err) {
      console.error("Error in fetch operation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = () => {
    navigate("/dashboard/idea-vault/create");
  };

  const handleViewDetails = (idea: any) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <DashboardAnimatedBackground objectCount={7}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center xs:flex-col xs:items-start xs:gap-2">
            <div>
              <h1 className="text-3xl font-bold">Idea</h1>
              <p className="text-muted-foreground mt-2">
                Refine, share, and fund your ideas. Turn your dreams into
                reality.
              </p>
            </div>
            <Button
              className="flex items-center gap-2 xs:p-2"
              onClick={handleCreateIdea}
            >
              <Plus className="h-4 w-4" />
              Create Idea
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {ideas.map((idea) => (
              <motion.div
                key={idea.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      {idea.title}
                      {idea.is_featured && (
                        <Badge variant="secondary" className="ml-2">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>
                        Created on{" "}
                        {new Date(idea.created_at).toLocaleDateString()}
                      </span>
                      {idea.boost_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {idea.boost_count} boosts
                        </span>
                      )}
                      {idea.boost_until && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Boosted until{" "}
                          {new Date(idea.boost_until).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {idea.description && (
                      <p className="text-muted-foreground mb-3">
                        {idea.description}
                      </p>
                    )}
                    <p className="line-clamp-3">{idea.content}</p>
                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {idea.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch">
                    <PostInteractions
                      postId={idea.id}
                      postType="idea_post"
                      onUpdate={fetchIdeas}
                    />
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(idea)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}

            {ideas.length === 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Lightbulb className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-medium mb-2">No ideas yet</h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">
                      Start documenting your ideas and turn them into reality
                    </p>
                    <Button onClick={handleCreateIdea}>
                      <Plus className="h-4 w-4 mr-2" /> Create Your First Idea
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        <PostDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={selectedIdea}
          postType="idea_post"
          onUpdate={fetchIdeas}
        />
      </div>
    </DashboardAnimatedBackground>
  );
};

export default IdeaVaultPage;
