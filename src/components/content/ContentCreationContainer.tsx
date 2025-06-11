import { RouteInfo } from "@/types";
import React, { ReactNode } from "react";
import LegacyVaultForm from "./LegacyVaultForm";

interface ContentCreationContainerProps {
  initialTab?: string;
  routeInfo?: RouteInfo;
  children?: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
}

const ContentCreationContainer: React.FC<ContentCreationContainerProps> = ({
  initialTab,
  routeInfo,
  children,
  title,
  description,
  icon,
}) => {
  // If children is provided, render it directly
  if (children) {
    return (
      <div className="container mx-auto py-6">
        {title && description && (
          <div className="mb-6">
            {icon && <div className="mb-2">{icon}</div>}
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Otherwise, render the LegacyVaultForm
  return (  
    <div className="container mx-auto py-6">
      <LegacyVaultForm />
    </div>
  );
};

export default ContentCreationContainer;
