// src/lib/firebase/admin-firestore.ts
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
} from 'firebase/firestore';
import type { HeroSlide, WelcomeSectionContent, Destination, Tour, Service, AboutHeroContent, MissionVisionContent, WhyChooseUsItem, Testimonial, ServicePageHeroContent, ServicePageIntroContent, TourPageHeroContent, TourPageIntroContent, DestinationPageHeroContent, DestinationPageIntroContent, ContactPageHeroContent, ContactPageDetailsContent, FAQItem, FaqPageHeroContent, HomepageSectionTitles, AboutSectionTitles, CookiePolicyContent, PrivacyPolicyContent, GalleryItem, GalleryPageHeroContent, BlogPageHeroContent, BlogPost } from '@/lib/types';


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

// --- Realtime Listeners for Admin Panel ---

export function getSlides(callback: (slides: HeroSlide[]) => void) {
  const q = query(collection(db, SLIDES_COLLECTION));
  return onSnapshot(q, (snapshot) => {
    const slides: HeroSlide[] = [];
    snapshot.forEach((doc) => {
      slides.push({ id: doc.id, ...doc.data() } as HeroSlide);
    });
    callback(slides);
  });
}

export function getWelcomeSectionContent(callback: (content: WelcomeSectionContent | null) => void) {
    return onSnapshot(doc(db, HOMEPAGE_COLLECTION, WELCOME_SECTION_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as WelcomeSectionContent : null);
    });
}

export function getHomepageSectionTitles(callback: (content: HomepageSectionTitles | null) => void) {
    return onSnapshot(doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_SECTION_TITLES_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as HomepageSectionTitles : null);
    });
}

export function getDestinations(callback: (destinations: Destination[]) => void) {
    const q = query(collection(db, DESTINATIONS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
        const destinations: Destination[] = [];
        snapshot.forEach((doc) => {
            destinations.push({ id: doc.id, ...doc.data() } as Destination);
        });
        callback(destinations);
    });
}

export function getTours(callback: (tours: Tour[]) => void) {
    const q = query(collection(db, TOURS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
        const tours: Tour[] = [];
        snapshot.forEach((doc) => {
            tours.push({ id: doc.id, ...doc.data() } as Tour);
        });
        callback(tours);
    });
}

export function getServices(callback: (services: Service[]) => void) {
    const q = query(collection(db, SERVICES_COLLECTION));
    return onSnapshot(q, (snapshot) => {
        const services: Service[] = [];
        snapshot.forEach((doc) => {
            services.push({ id: doc.id, ...doc.data() } as Service);
        });
        callback(services);
    });
}

export function getAboutHeroContent(callback: (content: AboutHeroContent | null) => void) {
    return onSnapshot(doc(db, ABOUTPAGE_COLLECTION, ABOUT_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as AboutHeroContent : null);
    });
}

export function getAboutSectionTitles(callback: (content: AboutSectionTitles | null) => void) {
    return onSnapshot(doc(db, ABOUTPAGE_COLLECTION, ABOUT_SECTION_TITLES_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as AboutSectionTitles : null);
    });
}

export function getMissionVisionContent(callback: (content: MissionVisionContent | null) => void) {
    return onSnapshot(doc(db, ABOUTPAGE_COLLECTION, MISSION_VISION_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as MissionVisionContent : null);
    });
}

export function getBlogPageHeroContentRealtime(callback: (content: BlogPageHeroContent | null) => void) {
    return onSnapshot(doc(db, BLOGPAGE_COLLECTION, BLOG_PAGE_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as BlogPageHeroContent : null);
    });
}

export function getContactPageHeroContent(callback: (content: ContactPageHeroContent | null) => void) {
    return onSnapshot(doc(db, CONTACTPAGE_COLLECTION, CONTACT_PAGE_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as ContactPageHeroContent : null);
    });
}

export function getContactPageDetailsContent(callback: (content: ContactPageDetailsContent | null) => void) {
    return onSnapshot(doc(db, CONTACTPAGE_COLLECTION, CONTACT_DETAILS_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as ContactPageDetailsContent : null);
    });
}

export function getDestinationPageHeroContent(callback: (content: DestinationPageHeroContent | null) => void) {
    return onSnapshot(doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as DestinationPageHeroContent : null);
    });
}

export function getDestinationPageIntroContent(callback: (content: DestinationPageIntroContent | null) => void) {
    return onSnapshot(doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_INTRO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as DestinationPageIntroContent : null);
    });
}

export function getFaqPageHeroContent(callback: (content: FaqPageHeroContent | null) => void) {
    return onSnapshot(doc(db, FAQPAGE_COLLECTION, FAQ_PAGE_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as FaqPageHeroContent : null);
    });
}

export function getGalleryPageHeroContent(callback: (content: GalleryPageHeroContent | null) => void) {
    return onSnapshot(doc(db, GALLERYPAGE_COLLECTION, GALLERY_PAGE_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as GalleryPageHeroContent : null);
    });
}

export function getCookiePolicyContent(callback: (content: CookiePolicyContent | null) => void) {
    return onSnapshot(doc(db, LEGALPAGE_COLLECTION, COOKIE_POLICY_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as CookiePolicyContent : null);
    });
}

export function getPrivacyPolicyContent(callback: (content: PrivacyPolicyContent | null) => void) {
    return onSnapshot(doc(db, LEGALPAGE_COLLECTION, PRIVACY_POLICY_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as PrivacyPolicyContent : null);
    });
}

export function getServicePageHeroContent(callback: (content: ServicePageHeroContent | null) => void) {
    return onSnapshot(doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as ServicePageHeroContent : null);
    });
}

export function getServicePageIntroContent(callback: (content: ServicePageIntroContent | null) => void) {
    return onSnapshot(doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_INTRO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as ServicePageIntroContent : null);
    });
}

export function getTourPageHeroContent(callback: (content: TourPageHeroContent | null) => void) {
    return onSnapshot(doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_HERO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as TourPageHeroContent : null);
    });
}

export function getTourPageIntroContent(callback: (content: TourPageIntroContent | null) => void) {
    return onSnapshot(doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_INTRO_DOC), (doc) => {
        callback(doc.exists() ? doc.data() as TourPageIntroContent : null);
    });
}


// --- CMS Write Operations ---

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
export function getWhyChooseUsItems(callback: (items: WhyChooseUsItem[]) => void) {
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
export function getTestimonials(callback: (testimonials: Testimonial[]) => void) {
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
export function getBlogPosts(callback: (posts: BlogPost[]) => void) {
    const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('publishedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const posts: BlogPost[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({ 
                id: doc.id, 
                ...data,
                publishedAt: (data.publishedAt as Timestamp)
            } as BlogPost);
        });
        callback(posts);
    });
}
export async function getBlogPostById(id: string) {
    const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
            id: docSnap.id, 
            ...data,
            publishedAt: (data.publishedAt as Timestamp) // Keep as Timestamp for server-side
        } as BlogPost;
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
export function getFaqItems(callback: (items: FAQItem[]) => void) {
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
export function getGalleryItems(callback: (items: GalleryItem[]) => void) {
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
export function getDestinationPageDestinations(callback: (destinations: Destination[]) => void) {
  const q = query(collection(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const destinations: Destination[] = [];
    querySnapshot.forEach((doc) => destinations.push({ id: doc.id, ...doc.data() } as Destination));
    callback(destinations);
  });
}
export async function getDestinationPageDestinationById(id: string): Promise<Destination | null> {
    const docRef = doc(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
            id: docSnap.id, 
            ...data,
        } as Destination;
    }
    return null;
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
export function getTourPageTours(callback: (tours: Tour[]) => void) {
    const q = query(collection(db, TOUR_PAGE_TOURS_COLLECTION));
    return onSnapshot(q, (querySnapshot) => {
        const tours: Tour[] = [];
        querySnapshot.forEach((doc) => tours.push({ id: doc.id, ...doc.data() } as Tour));
        callback(tours);
    });
}
export async function getTourPageTourById(id: string): Promise<Tour | null> {
    const docRef = doc(db, TOUR_PAGE_TOURS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
            id: docSnap.id, 
            ...data,
        } as Tour;
    }
    return null;
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
export async function updateContactPageDetailsContent(content: ContactPageDetailsContent) {
    return await setDoc(doc(db, CONTACTPAGE_COLLECTION, CONTACT_DETAILS_DOC), content, { merge: true });
}
export async function updateContactPageHeroContent(content: ContactPageHeroContent) {
    return await setDoc(doc(db, CONTACTPAGE_COLLECTION, CONTACT_PAGE_HERO_DOC), content, { merge: true });
}
export async function updateDestinationPageHeroContent(content: DestinationPageHeroContent) {
    return await setDoc(doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_HERO_DOC), content, { merge: true });
}
export async function updateDestinationPageIntroContent(content: DestinationPageIntroContent) {
    return await setDoc(doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_INTRO_DOC), content, { merge: true });
}
export async function updateFaqPageHeroContent(content: FaqPageHeroContent) {
    return await setDoc(doc(db, FAQPAGE_COLLECTION, FAQ_PAGE_HERO_DOC), content, { merge: true });
}
export async function updateGalleryPageHeroContent(content: GalleryPageHeroContent) {
    return await setDoc(doc(db, GALLERYPAGE_COLLECTION, GALLERY_PAGE_HERO_DOC), content, { merge: true });
}
export async function updateCookiePolicyContent(content: CookiePolicyContent) {
    return await setDoc(doc(db, LEGALPAGE_COLLECTION, COOKIE_POLICY_DOC), content, { merge: true });
}
export async function updatePrivacyPolicyContent(content: PrivacyPolicyContent) {
    return await setDoc(doc(db, LEGALPAGE_COLLECTION, PRIVACY_POLICY_DOC), content, { merge: true });
}
export async function updateServicePageHeroContent(content: ServicePageHeroContent) {
    return await setDoc(doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_HERO_DOC), content, { merge: true });
}
export async function updateServicePageIntroContent(content: ServicePageIntroContent) {
    return await setDoc(doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_INTRO_DOC), content, { merge: true });
}
export async function updateTourPageHeroContent(content: TourPageHeroContent) {
    return await setDoc(doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_HERO_DOC), content, { merge: true });
}
export async function updateTourPageIntroContent(content: TourPageIntroContent) {
    return await setDoc(doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_INTRO_DOC), content, { merge: true });
}
export async function updateBlogPageHeroContent(content: BlogPageHeroContent) {
    return await setDoc(doc(db, BLOGPAGE_COLLECTION, BLOG_PAGE_HERO_DOC), content, { merge: true });
}
export function getServicePageServices(callback: (services: Service[]) => void) {
    const q = query(collection(db, SERVICE_PAGE_SERVICES_COLLECTION));
    return onSnapshot(q, (snapshot) => {
        const services: Service[] = [];
        snapshot.forEach((doc) => {
            services.push({ id: doc.id, ...doc.data() } as Service);
        });
        callback(services);
    });
}
export async function addServicePageService(service: Omit<Service, 'id'>) {
    return await addDoc(collection(db, SERVICE_PAGE_SERVICES_COLLECTION), service);
}
export async function updateServicePageService(id: string, service: Partial<Service>) {
  return await updateDoc(doc(db, SERVICE_PAGE_SERVICES_COLLECTION, id), service);
}
export async function deleteServicePageService(id: string) {
  return await deleteDoc(doc(db, SERVICE_PAGE_SERVICES_COLLECTION, id));
}
