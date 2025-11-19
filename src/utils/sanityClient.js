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
  apiVersion: '2024-01-01', // Use current date in YYYY-MM-DD format
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
  return builder.image(source);
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
