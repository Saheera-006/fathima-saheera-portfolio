import { useEffect } from 'react';
import { MetaTagsData } from '../data/portfolioData';

/**
 * Dynamically updates document.title, OpenGraph, Twitter, and Schema.org metadata
 * in real-time as changes are synchronized from Firebase Firestore.
 */
export function useDynamicSEO(seo?: MetaTagsData, profileName?: string) {
  useEffect(() => {
    if (!seo) return;

    const title = seo.title || `${profileName || 'Fathima Saheera J'} — Portfolio`;
    const description =
      seo.description ||
      'Interactive cinematic portfolio of Fathima Saheera J, an Aspiring Full-Stack Developer turning ideas into real digital experiences.';
    const keywords =
      seo.keywords || 'Fathima Saheera J, Full-Stack Developer, React, Firebase, Flutter, Portfolio';
    const author = seo.author || profileName || 'Fathima Saheera J';
    const ogImage = seo.ogImage || '/cute_hijabi_headphones_1790087241274.jpg';

    // 1. Update document title
    document.title = title;

    // Helper to create or update meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Search Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', author);

    // 3. OpenGraph Social Cards
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }
    setMetaTag('property', 'og:site_name', author);

    // 4. Twitter / X Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    if (ogImage) {
      setMetaTag('name', 'twitter:image', ogImage);
    }

    // 5. Schema.org JSON-LD Structured Data
    let schemaScript = document.getElementById('seo-structured-data') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-structured-data';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author,
      url: typeof window !== 'undefined' ? window.location.origin : 'https://saheera-portfolio.web.app',
      jobTitle: 'Full-Stack Developer',
      description,
      sameAs: [
        'https://github.com/Saheera-006/',
        'https://www.linkedin.com/in/fathima-saheera',
      ],
    };

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [seo, profileName]);
}
