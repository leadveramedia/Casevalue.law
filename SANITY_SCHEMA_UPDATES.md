# Sanity Schema Updates Required

This document outlines the Sanity CMS schema updates needed to support the new SEO features implemented in the frontend.

## Overview

The frontend code already supports these features, but the Sanity Studio schema needs to be updated to enable content editors to add this data.

---

## 1. Blog Post Keywords Field

**Location:** Sanity Studio repository → `schemas/blogPost.js` → `seo` object

**Purpose:** Allow content editors to add SEO keywords to blog posts

**Current Status:** ✅ Frontend already implemented (BlogPostPage.jsx lines 175-176)

### Schema Addition Required:

```javascript
// In blogPost schema > seo object
{
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: Rule => Rule.max(60),
      description: 'SEO title (60 characters max)'
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      validation: Rule => Rule.max(160),
      description: 'SEO description (160 characters max)'
    },
    {
      name: 'keywords',  // ← ADD THIS FIELD
      title: 'Meta Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'SEO keywords for this post (5-10 keywords recommended)',
      validation: Rule => Rule.max(10),
      options: {
        layout: 'tags'  // Shows as tag input for better UX
      }
    }
  ]
}
```

### Implementation Notes:

- The `layout: 'tags'` option provides a better UX where editors can type keywords and press Enter/comma to add them
- Validation limits to 10 keywords maximum to prevent keyword stuffing
- Frontend code already handles rendering: `<meta name="keywords" content={post.seo.keywords.join(', ')} />`

---

## 2. Blog Post Categories Field

**Location:** Sanity Studio repository → `schemas/blogPost.js`

**Purpose:** Enable related posts functionality based on shared categories

**Current Status:** ✅ Frontend already implemented (getRelatedPosts function in sanityClient.js)

### Verify This Field Exists:

```javascript
// In blogPost schema (root level)
{
  name: 'categories',
  title: 'Categories',
  type: 'array',
  of: [{ type: 'string' }],
  description: 'Categories for grouping related posts',
  options: {
    layout: 'tags'
  }
}
```

### If Categories Don't Exist, Add This Field:

**Simple Option (Recommended):**
```javascript
{
  name: 'categories',
  title: 'Categories',
  type: 'array',
  of: [{ type: 'string' }],
  description: 'Post categories (e.g., personal-injury, employment-law)',
  options: {
    layout: 'tags'
  }
}
```

**Advanced Option (Better for filtering):**
```javascript
// Create a separate category document type first
{
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
}

// Then reference in blogPost schema
{
  name: 'categories',
  title: 'Categories',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'category' }] }]
}
```

### Implementation Notes:

- Categories are used by `getRelatedPosts()` to find posts with matching categories
- Current frontend code expects array of strings (simple option)
- If using advanced option, update the Sanity query in `getRelatedPosts()` to reference category slugs

---

## 3. Testing After Schema Updates

### Steps to Verify:

1. **Deploy Sanity Studio Changes:**
   ```bash
   cd sanity-studio
   npm run deploy
   # or
   sanity deploy
   ```

2. **Add Keywords to a Blog Post:**
   - Open Sanity Studio
   - Edit any blog post
   - Scroll to SEO section
   - Add 5-10 keywords (e.g., "personal injury", "car accident", "settlement value")
   - Publish

3. **Add Categories to Blog Posts:**
   - Edit blog posts
   - Add categories (e.g., "personal-injury", "employment-law", "case-valuation")
   - Publish

4. **Verify Frontend:**
   - View blog post on website
   - Right-click → View Page Source
   - Search for `<meta name="keywords"` - should see keywords
   - Check Related Posts section appears
   - Related posts should share categories with current post

---

## 4. Recommended Category Values

For consistency, use these category slugs (kebab-case):

### Personal Injury Categories:
- `personal-injury`
- `car-accident`
- `medical-malpractice`
- `slip-and-fall`
- `wrongful-death`
- `product-liability`
- `workplace-injury`

### Employment Law Categories:
- `employment-law`
- `wrongful-termination`
- `employment-discrimination`
- `wage-dispute`
- `sexual-harassment`
- `workplace-retaliation`
- `hostile-work-environment`

### Intellectual Property Categories:
- `intellectual-property`
- `patent-infringement`
- `copyright-infringement`
- `trademark-infringement`

### General Categories:
- `case-valuation`
- `legal-advice`
- `settlement-tips`
- `statute-of-limitations`
- `legal-process`

---

## 5. Migration Plan

If you have existing blog posts without keywords or categories:

1. **Bulk Update Strategy:**
   - Create a script to add default categories based on post content
   - Or manually add categories to top 10-20 most popular posts first

2. **Fallback Behavior:**
   - ✅ Already handled: `getRelatedPosts()` falls back to recent posts if no categories
   - ✅ Already handled: Keywords meta tag only renders if `post.seo?.keywords` exists

3. **No Breaking Changes:**
   - All changes are backward compatible
   - Existing posts without keywords/categories will continue to work

---

## Summary

### Required Actions:

1. ✅ **Add `keywords` field to blogPost > seo object**
2. ✅ **Verify/add `categories` field to blogPost**
3. ✅ **Add keywords to existing posts** (optional but recommended)
4. ✅ **Add categories to existing posts** (for related posts feature)
5. ✅ **Test on a sample post** to verify everything works

### Frontend Status:

- ✅ All frontend code is complete and ready
- ✅ No frontend changes needed after Sanity update
- ✅ Features will work immediately after Sanity schema is updated

### Contact:

If you need help updating the Sanity schema, please provide access to the Sanity Studio repository.
