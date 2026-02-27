// ============================================================================
// SANITY CLIENT CONFIGURATION
// ============================================================================
// This file configures the Sanity client for fetching blog content
// Documentation: https://www.sanity.io/docs/js-client

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Create and configure the Sanity client
export const client = createClient({
  projectId: 's8mux3ix',
  dataset: 'production',
  apiVersion: '2026-02-01', // Use current date in YYYY-MM-DD format
  useCdn: true, // Enable CDN for faster, cached responses (set to false for fresh data)
});

// Helper function to generate optimized image URLs
const builder = imageUrlBuilder(client);

/**
 * Generate an optimized image URL from a Sanity image asset
 * @param {Object} source - Sanity image asset object
 * @returns {Object} Image URL builder with methods like .width(), .height(), .format()
 *
 * Example usage:
 *   urlFor(post.mainImage).width(800).format('webp').url()
 */
export const urlFor = (source) => {
  // Wrap the builder to handle Unsplash images with WebP optimization
  const imageBuilder = builder.image(source);

  // Override the url() method to add Unsplash WebP format if needed
  const originalUrl = imageBuilder.url.bind(imageBuilder);
  imageBuilder.url = function() {
    let url = originalUrl();

    // If it's an Unsplash image, add WebP format and quality parameters
    if (url.includes('images.unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      // Add WebP format and auto compression for Unsplash images
      url = `${url}${separator}fm=webp&q=80`;
    }

    return url;
  };

  return imageBuilder;
};

/**
 * Generate responsive image srcset for different viewport sizes
 * @param {Object} source - Sanity image asset object
 * @param {Array} widths - Array of widths to generate (e.g., [400, 600, 800, 1200])
 * @param {number} aspectRatio - Optional aspect ratio (height/width)
 * @returns {string} srcset string for responsive images
 */
export const generateSrcSet = (source, widths = [400, 600, 800, 1200], aspectRatio = null) => {
  return widths
    .map((width) => {
      const builder = urlFor(source).width(width).format('webp');
      if (aspectRatio) {
        const height = Math.round(width * aspectRatio);
        builder.height(height);
      }
      return `${builder.url()} ${width}w`;
    })
    .join(', ');
};

// ============================================================================
// COMMON QUERIES
// ============================================================================

/**
 * Fetch all published blog posts, ordered by publish date (newest first)
 */
export const getAllPosts = async () => {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    categories,
    featured,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query);
};

/**
 * Fetch a single blog post by slug
 * @param {string} slug - The post's slug (URL-friendly identifier)
 */
export const getPostBySlug = async (slug) => {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    mainImage,
    publishedAt,
    author,
    categories,
    excerpt,
    seo,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query, { slug });
};

/**
 * Fetch featured blog posts
 */
export const getFeaturedPosts = async () => {
  const query = `*[_type == "blogPost" && featured == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query);
};

/**
 * Fetch posts by category
 * @param {string} category - Category to filter by
 */
export const getPostsByCategory = async (category) => {
  const query = `*[_type == "blogPost" && $category in categories] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    categories,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query, { category });
};

/**
 * Fetch recent posts (limit to specified number)
 * @param {number} limit - Number of posts to return
 */
export const getRecentPosts = async (limit = 5) => {
  const query = `*[_type == "blogPost"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    "imageAlt": mainImage.alt
  }`;

  return await client.fetch(query);
};

/**
 * Fetch related posts by category
 * @param {string} currentSlug - Current post slug to exclude
 * @param {Array} categories - Array of category strings
 * @param {number} limit - Number of posts to return
 */
export const getRelatedPosts = async (currentSlug, categories = [], limit = 4) => {
  // If no categories, fallback to recent posts
  if (!categories || categories.length === 0) {
    const posts = await getRecentPosts(limit + 1);
    return posts.filter(p => p.slug.current !== currentSlug).slice(0, limit);
  }

  // Find posts with matching categories, ordered by match score
  const query = `*[_type == "blogPost" && count((categories)[@ in $categories]) > 0 && slug.current != $currentSlug] | order(publishedAt desc)[0...${limit * 2}] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author,
    categories,
    "imageAlt": mainImage.alt,
    "matchScore": count((categories)[@ in $categories])
  } | order(matchScore desc, publishedAt desc)[0...${limit}]`;

  const posts = await client.fetch(query, { categories, currentSlug });

  // If no matches found, fallback to recent posts
  if (!posts || posts.length === 0) {
    const recentPosts = await getRecentPosts(limit + 1);
    return recentPosts.filter(p => p.slug.current !== currentSlug).slice(0, limit);
  }

  return posts;
};
