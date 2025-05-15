
export interface Feature {
  title: string;
  description: string;
  icon: string;
  link: string;
  cta?: string;
}

export interface MediaConfig {
  hero: {
    backgroundVideo: string;
    fallbackImage: string;
  };
  features: {
    backgroundAnimation: string;
    fallbackImage: string;
  };
  loading: {
    animation: string;
  };
  timelessMessages: {
    submissionAnimation: string;
  };
}
