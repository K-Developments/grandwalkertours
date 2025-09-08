// src/lib/firebase/firestore.ts
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  orderBy,
  getDocs,
  where,
} from 'firebase/firestore';
import type { HeroSlide, WelcomeSectionContent, Destination, Tour, Service, AboutHeroContent, MissionVisionContent, WhyChooseUsItem, Testimonial, ServicePageHeroContent, ServicePageIntroContent, TourPageHeroContent, TourPageIntroContent, DestinationPageHeroContent, DestinationPageIntroContent, ContactPageHeroContent, ContactPageDetailsContent, CookieConsentLog, FAQItem, FaqPageHeroContent, HomepageSectionTitles, AboutSectionTitles, CookiePolicyContent, PrivacyPolicyContent, GalleryItem, GalleryPageHeroContent, BlogPageHeroContent, BlogPost } from '@/lib/types';
import { cache } from 'react';


// --- REST API Implementation ---

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;


if (!PROJECT_ID || !API_KEY) {
  throw new Error("Firebase Project ID or API Key is not configured in environment variables.");
}

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
                        return v[nestedValueKey];
                    }).filter(v => v !== null);
                    break;
                case 'nullValue':
                    parsed[key] = null;
                    break;
                default:
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
    const url = `${API_BASE_URL}/${path}?key=${API_KEY}`;
    
    const res = await fetch(url, { next: { revalidate: false } }); // No revalidation for static build
    
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

const fetchFirestoreCollection = cache(async (path: string, options?: { revalidate: number | false | undefined }) => {
    const url = `${API_BASE_URL}/${path}?key=${API_KEY}`;
    
    const res = await fetch(url, { next: { revalidate: options?.revalidate ?? false } });
    
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
const COOKIE_CONSENT_LOGS_COLLECTION = 'cookieConsentLogs';
const FAQ_COLLECTION = 'faq';
const COOKIE_POLICY_DOC = 'cookiePolicy';
const PRIVACY_POLICY_DOC = 'privacyPolicy';

// --- CMS Write Operations (Still use the SDK) ---

export async function addSlide(slide: Omit<HeroSlide, 'id'>) {
  return await addDoc(collection(db, SLIDES_COLLECTION), slide);
}
export async function updateSlide(id: string, slide: Omit<HeroSlide, 'id'>) {
  return await updateDoc(doc(db, SLIDES_COLLECTION, id), slide);
}
export async function deleteSlide(id: string) {
  return await deleteDoc(doc(db, SLIDES_COLLECTION, id));
}
export async function updateWelcomeSectionContent(content: WelcomeSectionContent) {
  return await setDoc(doc(db, HOMEPAGE_COLLECTION, WELCOME_SECTION_DOC), content, { merge: true });
}
export async function updateHomepageSectionTitles(content: HomepageSectionTitles) {
  return await setDoc(doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_SECTION_TITLES_DOC), content, { merge: true });
}
export async function addDestination(destination: Omit<Destination, 'id'>) {
  return await addDoc(collection(db, DESTINATIONS_COLLECTION), destination);
}
export async function updateDestination(id: string, destination: Partial<Destination>) {
  return await updateDoc(doc(db, DESTINATIONS_COLLECTION, id), destination);
}
export async function deleteDestination(id: string) {
  return await deleteDoc(doc(db, DESTINATIONS_COLLECTION, id));
}
export async function addTour(tour: Omit<Tour, 'id'>) {
  return await addDoc(collection(db, TOURS_COLLECTION), tour);
}
export async function updateTour(id: string, tour: Partial<Tour>) {
  return await updateDoc(doc(db, TOURS_COLLECTION, id), tour);
}
export async function deleteTour(id: string) {
  return await deleteDoc(doc(db, TOURS_COLLECTION, id));
}
export async function addService(service: Omit<Service, 'id'>) {
  return await addDoc(collection(db, SERVICES_COLLECTION), service);
}
export async function updateService(id: string, service: Omit<Service, 'id'>) {
  return await updateDoc(doc(db, SERVICES_COLLECTION, id), service);
}
export async function deleteService(id: string) {
  return await deleteDoc(doc(db, SERVICES_COLLECTION, id));
}
export async function updateAboutHeroContent(content: AboutHeroContent) {
    return await setDoc(doc(db, ABOUTPAGE_COLLECTION, ABOUT_HERO_DOC), content, { merge: true });
}
export async function updateAboutSectionTitles(content: AboutSectionTitles) {
    return await setDoc(doc(db, ABOUTPAGE_COLLECTION, ABOUT_SECTION_TITLES_DOC), content, { merge: true });
}
export async function updateMissionVisionContent(content: MissionVisionContent) {
    return await setDoc(doc(db, ABOUTPAGE_COLLECTION, MISSION_VISION_DOC), content, { merge: true });
}
export async function getWhyChooseUsItems(callback: (items: WhyChooseUsItem[]) => void) {
  const q = query(collection(db, WHY_CHOOSE_US_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const items: WhyChooseUsItem[] = [];
    querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as WhyChooseUsItem));
    callback(items);
  });
}
export async function addWhyChooseUsItem(item: Omit<WhyChooseUsItem, 'id'>) {
  return await addDoc(collection(db, WHY_CHOOSE_US_COLLECTION), item);
}
export async function updateWhyChooseUsItem(id: string, item: Partial<WhyChooseUsItem>) {
  return await updateDoc(doc(db, WHY_CHOOSE_US_COLLECTION, id), item);
}
export async function deleteWhyChooseUsItem(id: string) {
  return await deleteDoc(doc(db, WHY_CHOOSE_US_COLLECTION, id));
}
export async function getTestimonials(callback: (testimonials: Testimonial[]) => void) {
  const q = query(collection(db, TESTIMONIALS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const testimonials: Testimonial[] = [];
    querySnapshot.forEach((doc) => testimonials.push({ id: doc.id, ...doc.data() } as Testimonial));
    callback(testimonials);
  });
}
export async function addTestimonial(testimonial: Omit<Testimonial, 'id'>) {
  return await addDoc(collection(db, TESTIMONIALS_COLLECTION), testimonial);
}
export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>) {
  return await updateDoc(doc(db, TESTIMONIALS_COLLECTION, id), testimonial);
}
export async function deleteTestimonial(id: string) {
  return await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
}
export async function getBlogPostsWithUpdates(callback: (posts: BlogPost[]) => void) {
    const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('publishedAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const posts: BlogPost[] = [];
        querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() } as BlogPost));
        callback(posts);
    });
}
export async function getBlogPostById(id: string) {
    const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    }
    return null;
}
export async function addBlogPost(post: Omit<BlogPost, 'id'>) {
    const docRef = await addDoc(collection(db, BLOG_POSTS_COLLECTION), post);
    return docRef.id;
}
export async function updateBlogPost(id: string, post: Partial<Omit<BlogPost, 'id'>>) {
    return await updateDoc(doc(db, BLOG_POSTS_COLLECTION, id), post);
}
export async function deleteBlogPost(id: string) {
    return await deleteDoc(doc(db, BLOG_POSTS_COLLECTION, id));
}
export async function getFaqItems(callback: (items: FAQItem[]) => void) {
    const q = query(collection(db, FAQ_COLLECTION));
    return onSnapshot(q, (querySnapshot) => {
        const items: FAQItem[] = [];
        querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as FAQItem));
        callback(items);
    });
}
export async function addFaqItem(item: Omit<FAQItem, 'id'>) {
  return await addDoc(collection(db, FAQ_COLLECTION), item);
}
export async function updateFaqItem(id: string, item: Partial<FAQItem>) {
  return await updateDoc(doc(db, FAQ_COLLECTION, id), item);
}
export async function deleteFaqItem(id: string) {
  return await deleteDoc(doc(db, FAQ_COLLECTION, id));
}
export async function getGalleryItems(callback: (items: GalleryItem[]) => void) {
    const q = query(collection(db, GALLERY_COLLECTION));
    return onSnapshot(q, (querySnapshot) => {
        const items: GalleryItem[] = [];
        querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as GalleryItem));
        callback(items);
    });
}
export async function addGalleryItem(item: Omit<GalleryItem, 'id'>) {
    return await addDoc(collection(db, GALLERY_COLLECTION), item);
}
export async function updateGalleryItem(id: string, item: Partial<GalleryItem>) {
    return await updateDoc(doc(db, GALLERY_COLLECTION, id), item);
}
export async function deleteGalleryItem(id: string) {
    return await deleteDoc(doc(db, GALLERY_COLLECTION, id));
}
export async function logCookieConsent() {
    return await addDoc(collection(db, COOKIE_CONSENT_LOGS_COLLECTION), { consentedAt: Timestamp.now() });
}
export async function getCookieConsentLogs(callback: (logs: CookieConsentLog[]) => void) {
    const q = query(collection(db, COOKIE_CONSENT_LOGS_COLLECTION), orderBy('consentedAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const logs: CookieConsentLog[] = [];
        querySnapshot.forEach((doc) => logs.push({ id: doc.id, ...doc.data() } as CookieConsentLog));
        callback(logs);
    });
}
export async function getDestinationPageDestinations(callback: (destinations: Destination[]) => void) {
  const q = query(collection(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const destinations: Destination[] = [];
    querySnapshot.forEach((doc) => destinations.push({ id: doc.id, ...doc.data() } as Destination));
    callback(destinations);
  });
}
export async function addDestinationPageDestination(destination: Omit<Destination, 'id'>) {
    const docRef = await addDoc(collection(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION), destination);
    return docRef.id;
}
export async function updateDestinationPageDestination(id: string, destination: Partial<Destination>) {
    return await updateDoc(doc(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION, id), destination);
}
export async function deleteDestinationPageDestination(id: string) {
    return await deleteDoc(doc(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION, id));
}
export async function getTourPageTours(callback: (tours: Tour[]) => void) {
    const q = query(collection(db, TOUR_PAGE_TOURS_COLLECTION));
    return onSnapshot(q, (querySnapshot) => {
        const tours: Tour[] = [];
        querySnapshot.forEach((doc) => tours.push({ id: doc.id, ...doc.data() } as Tour));
        callback(tours);
    });
}
export async function addTourPageTour(tour: Omit<Tour, 'id'>) {
    const docRef = await addDoc(collection(db, TOUR_PAGE_TOURS_COLLECTION), tour);
    return docRef.id;
}
export async function updateTourPageTour(id: string, tour: Partial<Tour>) {
    return await updateDoc(doc(db, TOUR_PAGE_TOURS_COLLECTION, id), tour);
}
export async function deleteTourPageTour(id: string) {
    return await deleteDoc(doc(db, TOUR_PAGE_TOURS_COLLECTION, id));
}

// --- SSG Read Functions ---
export const getSlidesForPreload = () => fetchFirestoreCollection(SLIDES_COLLECTION) as Promise<HeroSlide[]>;
export const getWelcomeSectionContent = () => fetchFirestoreDoc(`${HOMEPAGE_COLLECTION}/${WELCOME_SECTION_DOC}`) as Promise<WelcomeSectionContent | null>;
export const getHomepageSectionTitles = () => fetchFirestoreDoc(`${HOMEPAGE_COLLECTION}/${HOMEPAGE_SECTION_TITLES_DOC}`) as Promise<HomepageSectionTitles | null>;
export const getSsgDestinations = () => fetchFirestoreCollection(DESTINATIONS_COLLECTION) as Promise<Destination[]>;
export const getSsgTours = () => fetchFirestoreCollection(TOURS_COLLECTION) as Promise<Tour[]>;
export const getSsgServices = () => fetchFirestoreCollection(SERVICES_COLLECTION) as Promise<Service[]>;
export const getAboutHeroContent = () => fetchFirestoreDoc(`${ABOUTPAGE_COLLECTION}/${ABOUT_HERO_DOC}`) as Promise<AboutHeroContent | null>;
export const getAboutSectionTitles = () => fetchFirestoreDoc(`${ABOUTPAGE_COLLECTION}/${ABOUT_SECTION_TITLES_DOC}`) as Promise<AboutSectionTitles | null>;
export const getMissionVisionContent = () => fetchFirestoreDoc(`${ABOUTPAGE_COLLECTION}/${MISSION_VISION_DOC}`) as Promise<MissionVisionContent | null>;
export const getSsgWhyChooseUsItems = () => fetchFirestoreCollection(WHY_CHOOSE_US_COLLECTION) as Promise<WhyChooseUsItem[]>;
export const getSsgTestimonials = () => fetchFirestoreCollection(TESTIMONIALS_COLLECTION) as Promise<Testimonial[]>;
export const getBlogPosts = () => fetchFirestoreCollection(BLOG_POSTS_COLLECTION) as Promise<BlogPost[]>;
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const posts = await getBlogPosts();
    const post = posts.find(p => p.slug === slug);
    return post ? { ...post, publishedAt: new Date(post.publishedAt) } : null;
};
export const getFaqPageHeroContent = () => fetchFirestoreDoc(`${FAQPAGE_COLLECTION}/${FAQ_PAGE_HERO_DOC}`) as Promise<FaqPageHeroContent | null>;
export const getSsgFaqItems = () => fetchFirestoreCollection(FAQ_COLLECTION) as Promise<FAQItem[]>;
export const getGalleryPageHeroContent = () => fetchFirestoreDoc(`${GALLERYPAGE_COLLECTION}/${GALLERY_PAGE_HERO_DOC}`) as Promise<GalleryPageHeroContent | null>;
export const getSsgGalleryItems = () => fetchFirestoreCollection(GALLERY_COLLECTION) as Promise<GalleryItem[]>;
export const getContactPageHeroContent = () => fetchFirestoreDoc(`${CONTACTPAGE_COLLECTION}/${CONTACT_PAGE_HERO_DOC}`) as Promise<ContactPageHeroContent | null>;
export const getContactPageDetailsContent = () => fetchFirestoreDoc(`${CONTACTPAGE_COLLECTION}/${CONTACT_DETAILS_DOC}`) as Promise<ContactPageDetailsContent | null>;
export const getServicePageHeroContent = () => fetchFirestoreDoc(`${SERVICEPAGE_COLLECTION}/${SERVICE_PAGE_HERO_DOC}`) as Promise<ServicePageHeroContent | null>;
export const getServicePageIntroContent = () => fetchFirestoreDoc(`${SERVICEPAGE_COLLECTION}/${SERVICE_PAGE_INTRO_DOC}`) as Promise<ServicePageIntroContent | null>;
export const getSsgServicePageServices = () => fetchFirestoreCollection(SERVICE_PAGE_SERVICES_COLLECTION) as Promise<Service[]>;
export const getDestinationPageHeroContent = () => fetchFirestoreDoc(`${DESTINATIONPAGE_COLLECTION}/${DESTINATION_PAGE_HERO_DOC}`) as Promise<DestinationPageHeroContent | null>;
export const getDestinationPageIntroContent = () => fetchFirestoreDoc(`${DESTINATIONPAGE_COLLECTION}/${DESTINATION_PAGE_INTRO_DOC}`) as Promise<DestinationPageIntroContent | null>;
export const getSsgDestinationPageDestinations = () => fetchFirestoreCollection(DESTINATION_PAGE_DESTINATIONS_COLLECTION) as Promise<Destination[]>;
export const getDestinationPageDestinationById = (id: string) => fetchFirestoreDoc(`${DESTINATION_PAGE_DESTINATIONS_COLLECTION}/${id}`) as Promise<Destination | null>;
export const getTourPageHeroContent = () => fetchFirestoreDoc(`${TOURPAGE_COLLECTION}/${TOUR_PAGE_HERO_DOC}`) as Promise<TourPageHeroContent | null>;
export const getTourPageIntroContent = () => fetchFirestoreDoc(`${TOURPAGE_COLLECTION}/${TOUR_PAGE_INTRO_DOC}`) as Promise<TourPageIntroContent | null>;
export const getSsgTourPageTours = () => fetchFirestoreCollection(TOUR_PAGE_TOURS_COLLECTION) as Promise<Tour[]>;
export const getTourPageTourById = (id: string) => fetchFirestoreDoc(`${TOUR_PAGE_TOURS_COLLECTION}/${id}`) as Promise<Tour | null>;
export const getPrivacyPolicyContent = () => fetchFirestoreDoc(`${LEGALPAGE_COLLECTION}/${PRIVACY_POLICY_DOC}`) as Promise<PrivacyPolicyContent | null>;
export const getCookiePolicyContent = () => fetchFirestoreDoc(`${LEGALPAGE_COLLECTION}/${COOKIE_POLICY_DOC}`) as Promise<CookiePolicyContent | null>;
