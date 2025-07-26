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
  type DocumentData,
  updateDoc,
  Timestamp,
  orderBy,
  getDocs,
  where,
} from 'firebase/firestore';
import type { HeroSlide, WelcomeSectionContent, Destination, Tour, Service, AboutHeroContent, MissionVisionContent, WhyChooseUsItem, Testimonial, ServicePageHeroContent, ServicePageIntroContent, TourPageHeroContent, TourPageIntroContent, DestinationPageHeroContent, DestinationPageIntroContent, ContactPageHeroContent, ContactPageDetailsContent, CookieConsentLog, FAQItem, FaqPageHeroContent, HomepageSectionTitles, AboutSectionTitles, CookiePolicyContent, PrivacyPolicyContent, GalleryItem, GalleryPageHeroContent, BlogPageHeroContent, BlogPost } from '@/lib/types';

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


// --- Hero Slider ---

// Get all slides with real-time updates (for client components)
export function getSlides(callback: (slides: HeroSlide[]) => void) {
  const q = query(collection(db, SLIDES_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const slides: HeroSlide[] = [];
    querySnapshot.forEach((doc) => {
      slides.push({ id: doc.id, ...doc.data() } as HeroSlide);
    });
    callback(slides);
  });
  return unsubscribe;
}

// Get all slides for server-side rendering/preloading
export async function getSlidesForPreload(): Promise<HeroSlide[]> {
    try {
        const q = query(collection(db, SLIDES_COLLECTION));
        const querySnapshot = await getDocs(q);
        const slides: HeroSlide[] = [];
        querySnapshot.forEach((doc) => {
            slides.push({ id: doc.id, ...doc.data() } as HeroSlide);
        });
        return slides;
    } catch (e) {
        console.error('Error getting documents for preload: ', e);
        return []; // Return empty array on error
    }
}


// Add a new slide
export async function addSlide(slide: Omit<HeroSlide, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, SLIDES_COLLECTION), slide);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add slide');
  }
}

// Update an existing slide
export async function updateSlide(id: string, slide: Omit<HeroSlide, 'id'>) {
  try {
    const docRef = doc(db, SLIDES_COLLECTION, id);
    await updateDoc(docRef, slide);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update slide');
  }
}

// Delete a slide
export async function deleteSlide(id: string) {
  try {
    await deleteDoc(doc(db, SLIDES_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete slide');
  }
}


// --- Welcome Section ---

// Get the welcome section content with real-time updates
export function getWelcomeSectionContent(callback: (content: WelcomeSectionContent | null) => void) {
  const docRef = doc(db, HOMEPAGE_COLLECTION, WELCOME_SECTION_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as WelcomeSectionContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the welcome section content
export async function updateWelcomeSectionContent(content: WelcomeSectionContent) {
  try {
    const docRef = doc(db, HOMEPAGE_COLLECTION, WELCOME_SECTION_DOC);
    // Ensure optional fields are not undefined
    const dataToSave = {
      ...content,
      buttonText: content.buttonText || '',
      buttonLink: content.buttonLink || '',
      image: content.image || '',
      imageHint: content.imageHint || '',
      headline2: content.headline2 || '',
      description2: content.description2 || '',
      image2: content.image2 || '',
      imageHint2: content.imageHint2 || '',
      buttonText2: content.buttonText2 || '',
      buttonLink2: content.buttonLink2 || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update welcome section content');
  }
}

// --- Homepage Section Titles ---
export function getHomepageSectionTitles(callback: (content: HomepageSectionTitles | null) => void) {
  const docRef = doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_SECTION_TITLES_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as HomepageSectionTitles);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

export async function updateHomepageSectionTitles(content: HomepageSectionTitles) {
  try {
    const docRef = doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_SECTION_TITLES_DOC);
    await setDoc(docRef, content, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update homepage section titles');
  }
}

// --- About Page Section Titles ---
export function getAboutSectionTitles(callback: (content: AboutSectionTitles | null) => void) {
  const docRef = doc(db, ABOUTPAGE_COLLECTION, ABOUT_SECTION_TITLES_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AboutSectionTitles);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

export async function updateAboutSectionTitles(content: AboutSectionTitles) {
  try {
    const docRef = doc(db, ABOUTPAGE_COLLECTION, ABOUT_SECTION_TITLES_DOC);
    await setDoc(docRef, content, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update about page section titles');
  }
}


// --- About Page Hero Section ---

// Get the about page hero content with real-time updates
export function getAboutHeroContent(callback: (content: AboutHeroContent | null) => void) {
  const docRef = doc(db, ABOUTPAGE_COLLECTION, ABOUT_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AboutHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the about page hero content
export async function updateAboutHeroContent(content: AboutHeroContent) {
  try {
    const docRef = doc(db, ABOUTPAGE_COLLECTION, ABOUT_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update about page hero content');
  }
}

// --- Service Page Hero Section ---

// Get the service page hero content with real-time updates
export function getServicePageHeroContent(callback: (content: ServicePageHeroContent | null) => void) {
  const docRef = doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as ServicePageHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the service page hero content
export async function updateServicePageHeroContent(content: ServicePageHeroContent) {
  try {
    const docRef = doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update service page hero content');
  }
}

// --- Tour Page Hero Section ---

// Get the tour page hero content with real-time updates
export function getTourPageHeroContent(callback: (content: TourPageHeroContent | null) => void) {
  const docRef = doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as TourPageHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the tour page hero content
export async function updateTourPageHeroContent(content: TourPageHeroContent) {
  try {
    const docRef = doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update tour page hero content');
  }
}

// --- Destination Page Hero Section ---

// Get the destination page hero content with real-time updates
export function getDestinationPageHeroContent(callback: (content: DestinationPageHeroContent | null) => void) {
  const docRef = doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as DestinationPageHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the destination page hero content
export async function updateDestinationPageHeroContent(content: DestinationPageHeroContent) {
  try {
    const docRef = doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update destination page hero content');
  }
}

// --- Contact Page Hero Section ---

// Get the contact page hero content with real-time updates
export function getContactPageHeroContent(callback: (content: ContactPageHeroContent | null) => void) {
  const docRef = doc(db, CONTACTPAGE_COLLECTION, CONTACT_PAGE_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as ContactPageHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the contact page hero content
export async function updateContactPageHeroContent(content: ContactPageHeroContent) {
  try {
    const docRef = doc(db, CONTACTPAGE_COLLECTION, CONTACT_PAGE_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update contact page hero content');
  }
}

// --- FAQ Page Hero Section ---

export function getFaqPageHeroContent(callback: (content: FaqPageHeroContent | null) => void) {
  const docRef = doc(db, FAQPAGE_COLLECTION, FAQ_PAGE_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as FaqPageHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

export async function updateFaqPageHeroContent(content: FaqPageHeroContent) {
  try {
    const docRef = doc(db, FAQPAGE_COLLECTION, FAQ_PAGE_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update FAQ page hero content');
  }
}

// --- Gallery Page Hero Section ---
export function getGalleryPageHeroContent(callback: (content: GalleryPageHeroContent | null) => void) {
  const docRef = doc(db, GALLERYPAGE_COLLECTION, GALLERY_PAGE_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as GalleryPageHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

export async function updateGalleryPageHeroContent(content: GalleryPageHeroContent) {
  try {
    const docRef = doc(db, GALLERYPAGE_COLLECTION, GALLERY_PAGE_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update Gallery page hero content');
  }
}

// --- Blog Page Hero Section ---
export function getBlogPageHeroContent(callback: (content: BlogPageHeroContent | null) => void) {
  const docRef = doc(db, BLOGPAGE_COLLECTION, BLOG_PAGE_HERO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as BlogPageHeroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

export async function updateBlogPageHeroContent(content: BlogPageHeroContent) {
  try {
    const docRef = doc(db, BLOGPAGE_COLLECTION, BLOG_PAGE_HERO_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update Blog page hero content');
  }
}



// --- Contact Page Details Section ---

export function getContactPageDetailsContent(callback: (content: ContactPageDetailsContent | null) => void) {
  const docRef = doc(db, CONTACTPAGE_COLLECTION, CONTACT_DETAILS_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as ContactPageDetailsContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

export async function updateContactPageDetailsContent(content: ContactPageDetailsContent) {
  try {
    const docRef = doc(db, CONTACTPAGE_COLLECTION, CONTACT_DETAILS_DOC);
    const dataToSave = {
      ...content,
      image: content.image || '',
      imageHint: content.imageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update contact page details content');
  }
}


// --- Service Page Intro Section ---

// Get the service page intro content with real-time updates
export function getServicePageIntroContent(callback: (content: ServicePageIntroContent | null) => void) {
  const docRef = doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_INTRO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as ServicePageIntroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the service page intro content
export async function updateServicePageIntroContent(content: ServicePageIntroContent) {
  try {
    const docRef = doc(db, SERVICEPAGE_COLLECTION, SERVICE_PAGE_INTRO_DOC);
    const dataToSave = { ...content };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update service page intro content');
  }
}

// --- Tour Page Intro Section ---

// Get the tour page intro content with real-time updates
export function getTourPageIntroContent(callback: (content: TourPageIntroContent | null) => void) {
  const docRef = doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_INTRO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as TourPageIntroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the tour page intro content
export async function updateTourPageIntroContent(content: TourPageIntroContent) {
  try {
    const docRef = doc(db, TOURPAGE_COLLECTION, TOUR_PAGE_INTRO_DOC);
    const dataToSave = { ...content };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update tour page intro content');
  }
}

// --- Destination Page Intro Section ---

export function getDestinationPageIntroContent(callback: (content: DestinationPageIntroContent | null) => void) {
  const docRef = doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_INTRO_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as DestinationPageIntroContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

export async function updateDestinationPageIntroContent(content: DestinationPageIntroContent) {
  try {
    const docRef = doc(db, DESTINATIONPAGE_COLLECTION, DESTINATION_PAGE_INTRO_DOC);
    await setDoc(docRef, content, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update destination page intro content');
  }
}


// --- About Page Mission/Vision Section ---

// Get the mission/vision content with real-time updates
export function getMissionVisionContent(callback: (content: MissionVisionContent | null) => void) {
  const docRef = doc(db, ABOUTPAGE_COLLECTION, MISSION_VISION_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as MissionVisionContent);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
}

// Update the mission/vision content
export async function updateMissionVisionContent(content: MissionVisionContent) {
  try {
    const docRef = doc(db, ABOUTPAGE_COLLECTION, MISSION_VISION_DOC);
    const dataToSave = {
      ...content,
      missionImage: content.missionImage || '',
      missionImageHint: content.missionImageHint || '',
      visionImage: content.visionImage || '',
      visionImageHint: content.visionImageHint || '',
    };
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update mission/vision content');
  }
}

// --- Why Choose Us Section ---

// Get all "Why Choose Us" items with real-time updates
export function getWhyChooseUsItems(callback: (items: WhyChooseUsItem[]) => void) {
  const q = query(collection(db, WHY_CHOOSE_US_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: WhyChooseUsItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as WhyChooseUsItem);
    });
    callback(items);
  });
  return unsubscribe;
}

// Add a new "Why Choose Us" item
export async function addWhyChooseUsItem(item: Omit<WhyChooseUsItem, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, WHY_CHOOSE_US_COLLECTION), item);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add Why Choose Us item');
  }
}

// Update an existing "Why Choose Us" item
export async function updateWhyChooseUsItem(id: string, item: Partial<WhyChooseUsItem>) {
  try {
    const docRef = doc(db, WHY_CHOOSE_US_COLLECTION, id);
    await updateDoc(docRef, item);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update Why Choose Us item');
  }
}

// Delete a "Why Choose Us" item
export async function deleteWhyChooseUsItem(id: string) {
  try {
    await deleteDoc(doc(db, WHY_CHOOSE_US_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete Why Choose Us item');
  }
}

// --- Testimonials Section ---

// Get all testimonials with real-time updates
export function getTestimonials(callback: (testimonials: Testimonial[]) => void) {
  const q = query(collection(db, TESTIMONIALS_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const testimonials: Testimonial[] = [];
    querySnapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
    });
    callback(testimonials);
  });
  return unsubscribe;
}

// Add a new testimonial
export async function addTestimonial(testimonial: Omit<Testimonial, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), testimonial);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add testimonial');
  }
}

// Update an existing testimonial
export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>) {
  try {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await updateDoc(docRef, testimonial);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update testimonial');
  }
}

// Delete a testimonial
export async function deleteTestimonial(id: string) {
  try {
    await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete testimonial');
  }
}


// --- Destinations Section (Homepage) ---

// Get all destinations with real-time updates
export function getDestinations(callback: (destinations: Destination[]) => void) {
  const q = query(collection(db, DESTINATIONS_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const destinations: Destination[] = [];
    querySnapshot.forEach((doc) => {
      destinations.push({ id: doc.id, ...doc.data() } as Destination);
    });
    callback(destinations);
  });
  return unsubscribe;
}

// Add a new destination
export async function addDestination(destination: Omit<Destination, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, DESTINATIONS_COLLECTION), destination);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add destination');
  }
}

// Update an existing destination
export async function updateDestination(id: string, destination: Partial<Destination>) {
  try {
    const docRef = doc(db, DESTINATIONS_COLLECTION, id);
    await updateDoc(docRef, destination);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update destination');
  }
}

// Delete a destination
export async function deleteDestination(id: string) {
  try {
    await deleteDoc(doc(db, DESTINATIONS_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete destination');
  }
}

// --- Destinations Section (Destinations Page) ---

// Get a single destination from the destinations page collection
export async function getDestinationPageDestinationById(id: string): Promise<Destination | null> {
  const docRef = doc(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Destination;
  }
  return null;
}

export function getDestinationPageDestinations(callback: (destinations: Destination[]) => void) {
  const q = query(collection(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const destinations: Destination[] = [];
    querySnapshot.forEach((doc) => {
      destinations.push({ id: doc.id, ...doc.data() } as Destination);
    });
    callback(destinations);
  });
  return unsubscribe;
}

export async function addDestinationPageDestination(destination: Omit<Destination, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION), destination);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add destination');
  }
}

export async function updateDestinationPageDestination(id: string, destination: Partial<Destination>) {
  try {
    const docRef = doc(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION, id);
    await updateDoc(docRef, destination);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update destination');
  }
}

export async function deleteDestinationPageDestination(id: string) {
  try {
    await deleteDoc(doc(db, DESTINATION_PAGE_DESTINATIONS_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete destination');
  }
}

// --- Homepage Tours Section ---

// Get all tours with real-time updates
export function getTours(callback: (tours: Tour[]) => void) {
  const q = query(collection(db, TOURS_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tours: Tour[] = [];
    querySnapshot.forEach((doc) => {
      tours.push({ id: doc.id, ...doc.data() } as Tour);
    });
    callback(tours);
  });
  return unsubscribe;
}

// Add a new tour
export async function addTour(tour: Omit<Tour, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, TOURS_COLLECTION), tour);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add tour');
  }
}

// Update an existing tour
export async function updateTour(id: string, tour: Partial<Tour>) {
  try {
    const docRef = doc(db, TOURS_COLLECTION, id);
    await updateDoc(docRef, tour);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update tour');
  }
}


// Delete a tour
export async function deleteTour(id: string) {
  try {
    await deleteDoc(doc(db, TOURS_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete tour');
  }
}

// --- Tour Page Tours Section ---

// Get a single tour from the tours page collection
export async function getTourPageTourById(id: string): Promise<Tour | null> {
  const docRef = doc(db, TOUR_PAGE_TOURS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Tour;
  }
  return null;
}

// Get all tours for the tours page with real-time updates
export function getTourPageTours(callback: (tours: Tour[]) => void) {
  const q = query(collection(db, TOUR_PAGE_TOURS_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tours: Tour[] = [];
    querySnapshot.forEach((doc) => {
      tours.push({ id: doc.id, ...doc.data() } as Tour);
    });
    callback(tours);
  });
  return unsubscribe;
}

// Add a new tour for the tours page
export async function addTourPageTour(tour: Omit<Tour, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, TOUR_PAGE_TOURS_COLLECTION), tour);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add tour page tour');
  }
}

// Update an existing tour on the tours page
export async function updateTourPageTour(id: string, tour: Partial<Tour>) {
  try {
    const docRef = doc(db, TOUR_PAGE_TOURS_COLLECTION, id);
    await updateDoc(docRef, tour);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update tour page tour');
  }
}

// Delete a tour from the tours page
export async function deleteTourPageTour(id: string) {
  try {
    await deleteDoc(doc(db, TOUR_PAGE_TOURS_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete tour page tour');
  }
}


// --- Homepage Services Section ---

// Get all services with real-time updates
export function getServices(callback: (services: Service[]) => void) {
  const q = query(collection(db, SERVICES_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const services: Service[] = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() } as Service);
    });
    callback(services);
  });
  return unsubscribe;
}

// Add a new service
export async function addService(service: Omit<Service, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, SERVICES_COLLECTION), service);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add service');
  }
}

// Update an existing service
export async function updateService(id: string, service: Omit<Service, 'id'>) {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    await updateDoc(docRef, service);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update service');
  }
}

// Delete a service
export async function deleteService(id: string) {
  try {
    await deleteDoc(doc(db, SERVICES_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete service');
  }
}

// --- Service Page Services Section ---

// Get all services for the service page with real-time updates
export function getServicePageServices(callback: (services: Service[]) => void) {
  const q = query(collection(db, SERVICE_PAGE_SERVICES_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const services: Service[] = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() } as Service);
    });
    callback(services);
  });
  return unsubscribe;
}

// Add a new service for the service page
export async function addServicePageService(service: Omit<Service, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, SERVICE_PAGE_SERVICES_COLLECTION), service);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add service page service');
  }
}

// Update an existing service on the service page
export async function updateServicePageService(id: string, service: Partial<Service>) {
  try {
    const docRef = doc(db, SERVICE_PAGE_SERVICES_COLLECTION, id);
    await updateDoc(docRef, service);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update service page service');
  }
}

// Delete a service from the service page
export async function deleteServicePageService(id: string) {
  try {
    await deleteDoc(doc(db, SERVICE_PAGE_SERVICES_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete service page service');
  }
}

// --- Blog Posts ---

// Get all blog posts once for server-side rendering
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('publishedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as BlogPost);
    });
    return posts;
  } catch (e) {
    console.error('Error getting blog posts: ', e);
    return [];
  }
}

// Get all blog posts with real-time updates for client-side
export function getBlogPostsWithUpdates(callback: (posts: BlogPost[]) => void) {
  const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('publishedAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as BlogPost);
    });
    callback(posts);
  });
  return unsubscribe;
}

// Get a single blog post by its slug for static generation
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, BLOG_POSTS_COLLECTION), where("slug", "==", slug));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as BlogPost;
}

// Get a single blog post by its ID for editing
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  }
  return null;
}

// Add a new blog post
export async function addBlogPost(post: Omit<BlogPost, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, BLOG_POSTS_COLLECTION), post);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add blog post');
  }
}

// Update an existing blog post
export async function updateBlogPost(id: string, post: Partial<Omit<BlogPost, 'id'>>) {
  try {
    const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
    await updateDoc(docRef, post);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update blog post');
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string) {
  try {
    await deleteDoc(doc(db, BLOG_POSTS_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete blog post');
  }
}


// --- Cookie Consent Logging ---
export async function logCookieConsent() {
  try {
    await addDoc(collection(db, COOKIE_CONSENT_LOGS_COLLECTION), {
      consentedAt: Timestamp.now(),
    });
  } catch (e) {
    console.error('Error logging cookie consent: ', e);
    throw new Error('Could not log cookie consent');
  }
}

export function getCookieConsentLogs(callback: (logs: CookieConsentLog[]) => void) {
  const q = query(collection(db, COOKIE_CONSENT_LOGS_COLLECTION), orderBy('consentedAt', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const logs: CookieConsentLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as CookieConsentLog);
    });
    callback(logs);
  });
  return unsubscribe;
}

// --- FAQ Section ---
export function getFaqItems(callback: (items: FAQItem[]) => void) {
  const q = query(collection(db, FAQ_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: FAQItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as FAQItem);
    });
    callback(items);
  });
  return unsubscribe;
}

export async function addFaqItem(item: Omit<FAQItem, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, FAQ_COLLECTION), item);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add FAQ item');
  }
}

export async function updateFaqItem(id: string, item: Partial<FAQItem>) {
  try {
    const docRef = doc(db, FAQ_COLLECTION, id);
    await updateDoc(docRef, item);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update FAQ item');
  }
}

export async function deleteFaqItem(id: string) {
  try {
    await deleteDoc(doc(db, FAQ_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete FAQ item');
  }
}

// --- Gallery Section ---
export function getGalleryItems(callback: (items: GalleryItem[]) => void) {
  const q = query(collection(db, GALLERY_COLLECTION));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as GalleryItem);
    });
    callback(items);
  });
  return unsubscribe;
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), item);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add gallery item');
  }
}

export async function updateGalleryItem(id: string, item: Partial<GalleryItem>) {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, id);
    await updateDoc(docRef, item);
  } catch (e) {
    console.error('Error updating document: ', e);
    throw new Error('Could not update gallery item');
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, id));
  } catch (e) {
    console.error('Error deleting document: ', e);
    throw new Error('Could not delete gallery item');
  }
}


// --- Legal Pages (Cookie & Privacy Policy) ---

export function getCookiePolicyContent(callback: (content: CookiePolicyContent | null) => void) {
  const docRef = doc(db, LEGALPAGE_COLLECTION, COOKIE_POLICY_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    callback(docSnap.exists() ? (docSnap.data() as CookiePolicyContent) : null);
  });
  return unsubscribe;
}

export async function updateCookiePolicyContent(content: CookiePolicyContent) {
  try {
    const docRef = doc(db, LEGALPAGE_COLLECTION, COOKIE_POLICY_DOC);
    await setDoc(docRef, content, { merge: true });
  } catch (e) {
    console.error('Error updating cookie policy: ', e);
    throw new Error('Could not update cookie policy');
  }
}

export function getPrivacyPolicyContent(callback: (content: PrivacyPolicyContent | null) => void) {
  const docRef = doc(db, LEGALPAGE_COLLECTION, PRIVACY_POLICY_DOC);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    callback(docSnap.exists() ? (docSnap.data() as PrivacyPolicyContent) : null);
  });
  return unsubscribe;
}

export async function updatePrivacyPolicyContent(content: PrivacyPolicyContent) {
  try {
    const docRef = doc(db, LEGALPAGE_COLLECTION, PRIVACY_POLICY_DOC);
    await setDoc(docRef, content, { merge: true });
  } catch (e) {
    console.error('Error updating privacy policy: ', e);
    throw new Error('Could not update privacy policy');
  }
}
