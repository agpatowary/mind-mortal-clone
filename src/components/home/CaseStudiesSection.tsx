import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface CaseStudy {
  title: string;
  description: string;
}

interface CaseStudiesSectionProps {
  data: {
    title: string;
    studies: CaseStudy[];
  };
}

const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ data }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-16 md:py-20 px-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-3 md:mb-6"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
          {data.title}
        </h2>
        <div className="h-1 w-20 bg-primary mx-auto"></div>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Civilizations used monuments. We use memory. From pyramids in Egypt to
          cave drawings in France, humans have always tried to etch memory into
          permanence.
        </p>
      </motion.div>
      {/* <p className="text-xs md:text-base mb-1 md:mb-3">{study.description}</p> */}
      <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
        {data.studies.map((study, index) => (
          <AccordionItem value={"item-" + index} key={index}>
            <AccordionTrigger className="text-lg md:text-xl font-bold mb-2 text-primary hover:no-underline">
              {study.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm md:text-base text-muted-foreground">
                {study.description}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CaseStudiesSection;
