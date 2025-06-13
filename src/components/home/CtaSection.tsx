import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";

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

  // Legal page links
  const legalLinks = [
    { title: "Terms of Use", path: "/legal/terms-of-use" },
    { title: "Privacy Policy", path: "/legal/privacy-policy" },
    { title: "Community Guidelines", path: "/legal/community-guidelines" },
    { title: "Copyright Policy", path: "/legal/copyright-policy" },
  ];

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-20 xs:py-12 px-4">
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

          <div className="mb-16 xs:mb-4">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-[#F97316] hover:bg-[#F97316]/90"
              onClick={() => navigate("/signup")}
            >
              {data.buttonText}
            </Button>
          </div>

          {data.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 xs:mt-8">
              {data.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="font-bold text-4xl text-primary mb-2">
                    {metric.value}
                  </div>
                  <div className="text-muted-foreground">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Legal Links Section */}
          <div className="mt-16 xs:mt-4">
            <Separator className="mb-8 xs:mb-2" />
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {legalLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => navigate(link.path)}
                  >
                    {link.title}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CtaSection;
