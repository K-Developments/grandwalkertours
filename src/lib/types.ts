import type { Timestamp } from 'firebase/firestore';

export type Destination = {
  id?: string;
  name: string;
  description: string;
  image: string;
  imageHint?: string;
  link?: string;
  detailedDescription?: string;
  gallery?: GalleryImage[];
  additionalSections?: AdditionalSection[];
};

export type HeroSlide = {
  id?: string;
  image: string;
  headline: string;
  imageHint?: string;
  videoUrl?: string;
};

export type WelcomeSectionContent = {
  headline: string;
  description: string;
  image?: string;
  imageHint?: string;
  buttonText?: string;
  buttonLink?: string;
  headline2?: string;
  description2?: string;
  image2?: string;
  imageHint2?: string;
  buttonText2?: string;
  buttonLink2?: string;
};

export type HomepageSectionTitles = {
  destinationsTitle: string;
  toursTitle: string;
  servicesTitle: string;
};

export type AboutSectionTitles = {
  missionVisionTitle: string;
  whyChooseUsTitle: string;
  testimonialsTitle: string;
};

export type AboutHeroContent = {
  image?: string;
  imageHint?: string;
};

export type ServicePageHeroContent = {
  image?: string;
  imageHint?: string;
};

export type TourPageHeroContent = {
  image?: string;
  imageHint?: string;
};

export type DestinationPageHeroContent = {
  image?: string;
  imageHint?: string;
};

export type ContactPageHeroContent = {
  image?: string;
  imageHint?: string;
};

export type FaqPageHeroContent = {
  image?: string;
  imageHint?: string;
};

export type GalleryPageHeroContent = {
    image?: string;
    imageHint?: string;
};

export type ContactPageDetailsContent = {
  addressLine1: string;
  addressLine2: string;
  email: string;
  phone: string;
  image?: string;
  imageHint?: string;
};

export type ServicePageIntroContent = {
  title: string;
  description: string;
};

export type TourPageIntroContent = {
  title: string;
};

export type DestinationPageIntroContent = {
    title: string;
};


export type MissionVisionContent = {
  missionText: string;
  missionImage?: string;
  missionImageHint?: string;
  visionText: string;
  visionImage?: string;
  visionImageHint?: string;
};

export type WhyChooseUsItem = {
    id?: string;
    title: string;
    description: string;
    image: string;
    imageHint?: string;
    link?: string;
}

export type Testimonial = {
  id?: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  avatarHint?: string;
};

export type GalleryImage = {
  id: string; // Use a unique ID for array keys, e.g., from nanoid
  url: string;
  hint?: string;
};

export type AdditionalSection = {
  id: string; // Use a unique ID for array keys
  title: string;
  description: string;
  image: string;
  imageHint?: string;
};

export type Activity = {
  id: string;
  name: string;
  icon: string;
};

export type Tour = {
  id?: string;
  name: string;
  description: string;
  image: string;
  imageHint?: string;
  link?: string;
  detailedDescription?: string;
  gallery?: GalleryImage[];
  additionalSections?: AdditionalSection[];
  activities?: Activity[];
};

export type Service = {
  id?: string;
  title: string;
  description: string;
  image: string;
  imageHint?: string;
  link?: string;
};

export type ContactFormSubmission = {
    id?: string;
    name: string;
    email: string;
    country?: string;
    phone?: string;
    subject: string;
    message: string;
    submittedAt: Date;
};

export type CookieConsentLog = {
  id?: string;
  consentedAt: Timestamp;
};

export type FAQItem = {
  id?: string;
  question: string;
  answer: string;
};

export type CookiePolicyContent = {
    heroImage?: string;
    heroImageHint?: string;
    content: string;
};

export type PrivacyPolicyContent = {
    heroImage?: string;
    heroImageHint?: string;
    content: string;
};

export type GalleryItem = {
  id?: string;
  image: string;
  imageHint?: string;
  category?: string;
};

// Add a new type for the Rent a Car page if you plan to make it dynamic
export type RentACarContent = {
    heroImage?: string;
    heroImageHint?: string;
    // ... other fields for this page
}
