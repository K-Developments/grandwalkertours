// src/lib/firebase/firestore.ts
import {
  collection,
  query,
  getDoc,
  doc,
  getDocs,
  where,
} from 'firebase/firestore';
import type { HeroSlide, WelcomeSectionContent, Destination, Tour, Service, AboutHeroContent, MissionVisionContent, WhyChooseUsItem, Testimonial, ServicePageHeroContent, ServicePageIntroContent, TourPageHeroContent, TourPageIntroContent, DestinationPageHeroContent, DestinationPageIntroContent, ContactPageHeroContent, ContactPageDetailsContent, FAQItem, FaqPageHeroContent, HomepageSectionTitles, AboutSectionTitles, CookiePolicyContent, PrivacyPolicyContent, GalleryItem, GalleryPageHeroContent, BlogPageHeroContent, BlogPost } from '@/lib/types';
import { cache } from 'react';
import { downloadImage } from '@/lib/download-image';


// --- REST API Implementation ---

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const checkEnvVariables = () => {
  if (typeof window === 'undefined') { // Only run this check on the server
    if (!PROJECT_ID || !API_KEY) {
      throw new Error("Firebase Project ID or API Key is not configured in environment variables.");
    }
  }
};


const API_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const parseFirestoreResponse = (doc: any, isCollection = false) => {
    if (!doc) return null;

    const parseFields = (fields: any) => {
        const parsed: { [key: string]: any } = {};
        if (!fields) return parsed;
        for (const key in fields) {
            const value = fields[key];
            if (!value) continue;
            const valueKey = Object.keys(value)[0];
            switch (valueKey) {
                case 'stringValue':
                case 'integerValue':
                case 'doubleValue':
                case 'booleanValue':
                    parsed[key] = value[valueKey];
                    break;
                case 'timestampValue':
                    // Convert to JS Date object
                    parsed[key] = new Date(value[valueKey]);
                    break;
                case 'mapValue':
                    parsed[key] = parseFields(value.mapValue.fields || {});
                    break;
                case 'arrayValue':
                     parsed[key] = (value.arrayValue.values || []).map((v: any) => {
                        const nestedValueKey = Object.keys(v)[0];
                        if (!nestedValueKey) return null;
                        if (nestedValueKey === 'mapValue') {
                            return parseFields(v.mapValue.fields || {});
                        }
                        // Handle potential undefined value for nestedValueKey
                        const nestedValue = v[nestedValueKey];
                        return nestedValue !== undefined ? nestedValue : null;
                    }).filter(v => v !== null);
                    break;
                case 'nullValue':
                    parsed[key] = null;
                    break;
                default:
                    // Fallback for other types
                    parsed[key] = value[valueKey];
                    break;
            }
        }
        return parsed;
    };
    
    if (isCollection) {
        return doc.documents?.map((d: any) => ({
            id: d.name.split('/').pop(),
            ...parseFields(d.fields)
        })) || [];
    }

    return { id: doc.name.split('/').pop(), ...parseFields(doc.fields) };
};


const fetchFirestoreDoc = cache(async (path: string) => {
    checkEnvVariables();
    const url = `${API_BASE_URL}/${path}?key=${API_KEY}`;
    
    // Explicitly set revalidate to false for pure SSG
    const res = await fetch(url, { next: { revalidate: false } });
    
    if (!res.ok) {
        if (res.status === 404) {
            return null; // Return null for optional documents
        }
        // For other errors, throw to fail the build
        const errorText = await res.text();
        throw new Error(`Failed to fetch doc '${path}': ${res.status} ${res.statusText}. Response: ${errorText}`);
    }
    
    const json = await res.json();
    return parseFirestoreResponse(json);
});

const fetchFirestoreCollection = cache(async (path: string) => {
    checkEnvVariables();
    const url = `${API_BASE_URL}/${path}?key=${API_KEY}`;
    
    // Explicitly set revalidate to false for pure SSG
    const res = await fetch(url, { next: { revalidate: false } }); 
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch collection '${path}': ${res.status} ${res.statusText}. Response: ${errorText}`);
    }
    
    const json = await res.json();
    return parseFirestoreResponse(json, true);
});


const SLIDES_COLLECTION = 'heroSlides';
const HOMEPAGE_COLLECTION = 'homepageContent';
const ABOUTPAGE_COLLECTION = 'aboutpageContent';
const SERVICEPAGE_COLLECTION = 'servicepageContent';
const TOURPAGE_COLLECTION = 'tourpageContent';
const DESTINATIONPAGE_COLLECTION = 'destinationpageContent';
const CONTACTPAGE_COLLECTION = 'contactpageContent';
const FAQPAGE_COLLECTION = 'faqpageContent';
const LEGALPAGE_COLLECTION = 'legalpageContent';
const GALLERYPAGE_COLLECTION = 'gallerypageContent';
const BLOGPAGE_COLLECTION = 'blogpageContent';
const GALLERY_COLLECTION = 'gallery';
const WELCOME_SECTION_DOC = 'welcomeSection';
const HOMEPAGE_SECTION_TITLES_DOC = 'sectionTitles';
const ABOUT_SECTION_TITLES_DOC = 'sectionTitles';
const ABOUT_HERO_DOC = 'hero';
const SERVICE_PAGE_HERO_DOC = 'hero';
const TOUR_PAGE_HERO_DOC = 'hero';
const DESTINATION_PAGE_HERO_DOC = 'hero';
const CONTACT_PAGE_HERO_DOC = 'hero';
const FAQ_PAGE_HERO_DOC = 'hero';
const GALLERY_PAGE_HERO_DOC = 'hero';
const BLOG_PAGE_HERO_DOC = 'hero';
const CONTACT_DETAILS_DOC = 'details';
const SERVICE_PAGE_INTRO_DOC = 'intro';
const TOUR_PAGE_INTRO_DOC = 'intro';
const DESTINATION_PAGE_INTRO_DOC = 'intro';
const MISSION_VISION_DOC = 'missionVision';
const WHY_CHOOSE_US_COLLECTION = 'whyChooseUs';
const TESTIMONIALS_COLLECTION = 'testimonials';
const DESTINATIONS_COLLECTION = 'destinations';
const DESTINATION_PAGE_DESTINATIONS_COLLECTION = 'destinationPageDestinations';
const TOURS_COLLECTION = 'tours';
const TOUR_PAGE_TOURS_COLLECTION = 'tourPageTours';
const SERVICES_COLLECTION = 'services';
const SERVICE_PAGE_SERVICES_COLLECTION = 'servicePageServices';
const BLOG_POSTS_COLLECTION = 'blogPosts';
const FAQ_COLLECTION = 'faq';
const COOKIE_POLICY_DOC = 'cookiePolicy';
const PRIVACY_POLICY_DOC = 'privacyPolicy';

// --- SSG Read Functions with Image Download ---
export const getSlidesForPreload = async (): Promise<HeroSlide[]> => {
    const slides = await fetchFirestoreCollection(SLIDES_COLLECTION) as HeroSlide[];
    return Promise.all(slides.map(async (slide) => ({
        ...slide,
        image: await downloadImage(slide.image, slide.headline),
    })));
};

export const getWelcomeSectionContentSSG = async (): Promise<WelcomeSectionContent | null> => {
    const content = await fetchFirestoreDoc(`${HOMEPAGE_COLLECTION}/${WELCOME_SECTION_DOC}`) as WelcomeSectionContent | null;
    if (content) {
        if (content.image) {
            content.image = await downloadImage(content.image, content.headline);
        }
        if (content.image2) {
            content.image2 = await downloadImage(content.image2, content.headline2 || 'welcome-2');
        }
    }
    return content;
};

export const getSsgDestinations = async (): Promise<Destination[]> => {
    const destinations = await fetchFirestoreCollection(DESTINATIONS_COLLECTION) as Destination[];
    return Promise.all(destinations.map(async (destination) => ({
        ...destination,
        image: await downloadImage(destination.image, destination.name),
    })));
};

export const getSsgTours = async (): Promise<Tour[]> => {
    const tours = await fetchFirestoreCollection(TOURS_COLLECTION) as Tour[];
    return Promise.all(tours.map(async (tour) => ({
        ...tour,
        image: await downloadImage(tour.image, tour.name),
    })));
};

export const getSsgServices = async (): Promise<Service[]> => {
    const services = await fetchFirestoreCollection(SERVICES_COLLECTION) as Service[];
    return Promise.all(services.map(async (service) => ({
        ...service,
        image: await downloadImage(service.image, service.title),
    })));
};

export const getAboutHeroContentSSG = async (): Promise<AboutHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${ABOUTPAGE_COLLECTION}/${ABOUT_HERO_DOC}`) as AboutHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'about-hero');
    }
    return content;
};

export const getMissionVisionContentSSG = async (): Promise<MissionVisionContent | null> => {
    const content = await fetchFirestoreDoc(`${ABOUTPAGE_COLLECTION}/${MISSION_VISION_DOC}`) as MissionVisionContent | null;
    if (content) {
        if (content.missionImage) {
            content.missionImage = await downloadImage(content.missionImage, 'mission');
        }
        if (content.visionImage) {
            content.visionImage = await downloadImage(content.visionImage, 'vision');
        }
    }
    return content;
};

export const getSsgWhyChooseUsItems = async (): Promise<WhyChooseUsItem[]> => {
    const items = await fetchFirestoreCollection(WHY_CHOOSE_US_COLLECTION) as WhyChooseUsItem[];
    return Promise.all(items.map(async (item) => ({
        ...item,
        image: await downloadImage(item.image, item.title),
    })));
};

export const getSsgTestimonials = async (): Promise<Testimonial[]> => {
    const testimonials = await fetchFirestoreCollection(TESTIMONIALS_COLLECTION) as Testimonial[];
    return Promise.all(testimonials.map(async (testimonial) => ({
        ...testimonial,
        avatar: await downloadImage(testimonial.avatar, testimonial.name),
    })));
};

export const getSsgBlogPosts = async (): Promise<BlogPost[]> => {
    const posts = await fetchFirestoreCollection(BLOG_POSTS_COLLECTION) as BlogPost[];
    return Promise.all(posts.map(async (post) => ({
        ...post,
        featuredImage: await downloadImage(post.featuredImage, post.title),
        authorAvatar: await downloadImage(post.authorAvatar, post.authorName),
    })));
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const posts = await getSsgBlogPosts();
    return posts.find(p => p.slug === slug) || null;
};

export const getBlogPageHeroContentSSG = async (): Promise<BlogPageHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${BLOGPAGE_COLLECTION}/${BLOG_PAGE_HERO_DOC}`) as BlogPageHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'blog-hero');
    }
    return content;
};

export const getFaqPageHeroContentSSG = async (): Promise<FaqPageHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${FAQPAGE_COLLECTION}/${FAQ_PAGE_HERO_DOC}`) as FaqPageHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'faq-hero');
    }
    return content;
};

export const getSsgGalleryItems = async (): Promise<GalleryItem[]> => {
    const items = await fetchFirestoreCollection(GALLERY_COLLECTION) as GalleryItem[];
    return Promise.all(items.map(async (item) => ({
        ...item,
        image: await downloadImage(item.image, item.category || 'gallery-item'),
    })));
};

export const getGalleryPageHeroContentSSG = async (): Promise<GalleryPageHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${GALLERYPAGE_COLLECTION}/${GALLERY_PAGE_HERO_DOC}`) as GalleryPageHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'gallery-hero');
    }
    return content;
};

export const getContactPageHeroContentSSG = async (): Promise<ContactPageHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${CONTACTPAGE_COLLECTION}/${CONTACT_PAGE_HERO_DOC}`) as ContactPageHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'contact-hero');
    }
    return content;
};

export const getContactPageDetailsContentSSG = async (): Promise<ContactPageDetailsContent | null> => {
    const content = await fetchFirestoreDoc(`${CONTACTPAGE_COLLECTION}/${CONTACT_DETAILS_DOC}`) as ContactPageDetailsContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'contact-details');
    }
    return content;
};

export const getServicePageHeroContentSSG = async (): Promise<ServicePageHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${SERVICEPAGE_COLLECTION}/${SERVICE_PAGE_HERO_DOC}`) as ServicePageHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'services-hero');
    }
    return content;
};

export const getSsgServicePageServices = async (): Promise<Service[]> => {
    const services = await fetchFirestoreCollection(SERVICE_PAGE_SERVICES_COLLECTION) as Service[];
    return Promise.all(services.map(async (service) => ({
        ...service,
        image: await downloadImage(service.image, service.title),
    })));
};

export const getDestinationPageHeroContentSSG = async (): Promise<DestinationPageHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${DESTINATIONPAGE_COLLECTION}/${DESTINATION_PAGE_HERO_DOC}`) as DestinationPageHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'destinations-hero');
    }
    return content;
};

export const getSsgDestinationPageDestinations = async (): Promise<Destination[]> => {
    const destinations = await fetchFirestoreCollection(DESTINATION_PAGE_DESTINATIONS_COLLECTION) as Destination[];
    return Promise.all(destinations.map(async (destination) => ({
        ...destination,
        image: await downloadImage(destination.image, destination.name),
        gallery: destination.gallery ? await Promise.all(destination.gallery.map(async (img, i) => ({ ...img, url: await downloadImage(img.url, `${destination.name}-gallery-${i}`) }))) : [],
        additionalSections: destination.additionalSections ? await Promise.all(destination.additionalSections.map(async (sec) => ({ ...sec, image: await downloadImage(sec.image, sec.title) }))) : [],
    })));
};

export const getDestinationPageDestinationById = async (id: string): Promise<Destination | null> => {
    const destination = await fetchFirestoreDoc(`${DESTINATION_PAGE_DESTINATIONS_COLLECTION}/${id}`) as Destination | null;
    if (!destination) return null;

    destination.image = await downloadImage(destination.image, destination.name);
    if (destination.gallery) {
        destination.gallery = await Promise.all(destination.gallery.map(async (img, i) => ({ ...img, url: await downloadImage(img.url, `${destination.name}-gallery-${i}`) })));
    }
    if (destination.additionalSections) {
        destination.additionalSections = await Promise.all(destination.additionalSections.map(async (sec) => ({ ...sec, image: await downloadImage(sec.image, sec.title) })));
    }
    return destination;
};

export const getTourPageHeroContentSSG = async (): Promise<TourPageHeroContent | null> => {
    const content = await fetchFirestoreDoc(`${TOURPAGE_COLLECTION}/${TOUR_PAGE_HERO_DOC}`) as TourPageHeroContent | null;
    if (content && content.image) {
        content.image = await downloadImage(content.image, 'tours-hero');
    }
    return content;
};

export const getSsgTourPageTours = async (): Promise<Tour[]> => {
    const tours = await fetchFirestoreCollection(TOUR_PAGE_TOURS_COLLECTION) as Tour[];
    return Promise.all(tours.map(async (tour) => ({
        ...tour,
        image: await downloadImage(tour.image, tour.name),
        gallery: tour.gallery ? await Promise.all(tour.gallery.map(async (img, i) => ({ ...img, url: await downloadImage(img.url, `${tour.name}-gallery-${i}`) }))) : [],
        additionalSections: tour.additionalSections ? await Promise.all(tour.additionalSections.map(async (sec) => ({ ...sec, image: await downloadImage(sec.image, sec.title) }))) : [],
    })));
};

export const getTourPageTourById = async (id: string): Promise<Tour | null> => {
    const tour = await fetchFirestoreDoc(`${TOUR_PAGE_TOURS_COLLECTION}/${id}`) as Tour | null;
    if (!tour) return null;

    tour.image = await downloadImage(tour.image, tour.name);
    if (tour.gallery) {
        tour.gallery = await Promise.all(tour.gallery.map(async (img, i) => ({ ...img, url: await downloadImage(img.url, `${tour.name}-gallery-${i}`) })));
    }
    if (tour.additionalSections) {
        tour.additionalSections = await Promise.all(tour.additionalSections.map(async (sec) => ({ ...sec, image: await downloadImage(sec.image, sec.title) })));
    }
    return tour;
};

export const getPrivacyPolicyContentSSG = async (): Promise<PrivacyPolicyContent | null> => {
    const content = await fetchFirestoreDoc(`${LEGALPAGE_COLLECTION}/${PRIVACY_POLICY_DOC}`) as PrivacyPolicyContent | null;
    if (content && content.heroImage) {
        content.heroImage = await downloadImage(content.heroImage, 'privacy-policy-hero');
    }
    return content;
};

export const getCookiePolicyContentSSG = async (): Promise<CookiePolicyContent | null> => {
    const content = await fetchFirestoreDoc(`${LEGALPAGE_COLLECTION}/${COOKIE_POLICY_DOC}`) as CookiePolicyContent | null;
    if (content && content.heroImage) {
        content.heroImage = await downloadImage(content.heroImage, 'cookie-policy-hero');
    }
    return content;
};


// --- SSG Read Functions (Originals, no download) ---
export const getHomepageSectionTitlesSSG = () => fetchFirestoreDoc(`${HOMEPAGE_COLLECTION}/${HOMEPAGE_SECTION_TITLES_DOC}`) as Promise<HomepageSectionTitles | null>;
export const getAboutSectionTitlesSSG = () => fetchFirestoreDoc(`${ABOUTPAGE_COLLECTION}/${ABOUT_SECTION_TITLES_DOC}`) as Promise<AboutSectionTitles | null>;
export const getSsgFaqItems = () => fetchFirestoreCollection(FAQ_COLLECTION) as Promise<FAQItem[]>;
export const getServicePageIntroContentSSG = () => fetchFirestoreDoc(`${SERVICEPAGE_COLLECTION}/${SERVICE_PAGE_INTRO_DOC}`) as Promise<ServicePageIntroContent | null>;
export const getDestinationPageIntroContentSSG = () => fetchFirestoreDoc(`${DESTINATIONPAGE_COLLECTION}/${DESTINATION_PAGE_INTRO_DOC}`) as Promise<DestinationPageIntroContent | null>;
export const getTourPageIntroContentSSG = () => fetchFirestoreDoc(`${TOURPAGE_COLLECTION}/${TOUR_PAGE_INTRO_DOC}`) as Promise<TourPageIntroContent | null>;
