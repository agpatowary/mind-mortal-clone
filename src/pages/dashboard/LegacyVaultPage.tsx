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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PostInteractions from "@/components/social/PostInteractions";
import PostDetailsModal from "@/components/modals/PostDetailsModal";
import DashboardAnimatedBackground from "@/components/dashboard/DashboardAnimatedBackground";

const LegacyVaultPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("legacy_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error("Error in fetch operation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLegacy = () => {
    navigate("/dashboard/legacy-vault/create");
  };

  const handleViewDetails = (post: any) => {
    setSelectedPost(post);
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

  // Helper function to safely render content
  const renderContent = (content: string) => {
    return content ? (
      <p
        className="line-clamp-3"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    ) : (
      <p className="line-clamp-3 text-muted-foreground">No content available</p>
    );
  };

  return (
    <DashboardAnimatedBackground objectCount={6}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center xs:flex-col xs:items-start xs:gap-2">
            <div>
              <h1 className="text-3xl font-bold">Legacy</h1>
              <p className="text-muted-foreground mt-2">
                Browse and interact with legacy posts
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={handleCreateLegacy}
            >
              <Plus className="h-4 w-4" />
              Create Legacy
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="public" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="public">Public Gallery</TabsTrigger>
            <TabsTrigger value="timeCapsule">Time Capsule</TabsTrigger>
          </TabsList>

          <TabsContent value="public">
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
                {posts
                  .filter((post) => post.subcategory === "public-gallery")
                  .map((post) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle>{post.title}</CardTitle>
                          <CardDescription>
                            {new Date(post.created_at).toLocaleDateString()}
                            {post.categories && post.categories.length > 0 && (
                              <span> • Tags: {post.categories.join(", ")}</span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>{renderContent(post.content)}</CardContent>
                        <CardFooter className="flex flex-col items-stretch">
                          <PostInteractions
                            postId={post.id}
                            postType="legacy_post"
                            onUpdate={fetchPosts}
                          />
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(post)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}

                {posts.filter((post) => post.subcategory === "public-gallery")
                  .length === 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-medium mb-2">
                          No public legacy posts yet
                        </h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                          Create your first legacy post to share your wisdom and
                          memories
                        </p>
                        <Button onClick={handleCreateLegacy}>
                          <Plus className="h-4 w-4 mr-2" /> Create Your First
                          Legacy
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="timeCapsule">
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
                {posts
                  .filter((post) => post.subcategory === "time-capsule")
                  .map((post) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            {post.title}
                          </CardTitle>
                          <CardDescription>
                            Created on{" "}
                            {new Date(post.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-secondary/50 p-4 rounded-md mb-4">
                            <p className="font-medium">
                              Will be revealed on:{" "}
                              {post.release_date
                                ? new Date(
                                    post.release_date
                                  ).toLocaleDateString()
                                : "Date not specified"}
                            </p>
                          </div>
                          {renderContent(post.content)}
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch">
                          <PostInteractions
                            postId={post.id}
                            postType="legacy_post"
                            onUpdate={fetchPosts}
                          />
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(post)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}

                {posts.filter((post) => post.subcategory === "time-capsule")
                  .length === 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Clock className="h-12 w-12 mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-medium mb-2">
                          No time capsules yet
                        </h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                          Create your first time capsule to preserve memories
                          for the future
                        </p>
                        <Button onClick={handleCreateLegacy}>
                          <Plus className="h-4 w-4 mr-2" /> Create Time Capsule
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        <PostDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={selectedPost}
          postType="legacy_post"
          onUpdate={fetchPosts}
        />
      </div>
    </DashboardAnimatedBackground>
  );
};

export default LegacyVaultPage;
