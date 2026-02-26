// ============================================================================
// INDIVIDUAL BLOG POST PAGE
// ============================================================================
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PortableText } from '@portabletext/react';
import { getPostBySlug, getRecentPosts, getRelatedPosts, urlFor, generateSrcSet } from '../../utils/sanityClient';
import { Calendar, User, ArrowLeft, ArrowRight, Loader, Tag, DollarSign, CheckCircle, Lock } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';
import Breadcrumbs from '../Breadcrumbs';
import { getQuestionnaireLink, getCaseTypeFromCategory } from '../../utils/categoryToCaseType';
import { caseIdToSlug } from '../../constants/caseTypeSlugs';
import { stateSlugToInfo } from '../../constants/stateSlugMap';

/**
 * Convert heading text to a URL-friendly slug for anchor IDs
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extract plain text from Portable Text block children
 */
function extractText(block) {
  return (block.children || []).map(child => child.text || '').join('');
}

/**
 * Extract all h2/h3 headings from Portable Text body for table of contents
 */
function extractHeadings(body) {
  if (!body) return [];
  return body
    .filter(block => block.style === 'h2' || block.style === 'h3')
    .map(block => {
      const text = extractText(block);
      return {
        text,
        level: block.style,
        id: slugify(text),
      };
    });
}

/**
 * Find the split point for mid-article CTA: the index of the second h2 heading.
 * Falls back to ~40% of blocks if fewer than 2 h2s exist.
 */
function findCtaSplitIndex(body) {
  if (!body) return -1;
  let h2Count = 0;
  for (let i = 0; i < body.length; i++) {
    if (body[i].style === 'h2') {
      h2Count++;
      if (h2Count === 2) return i;
    }
  }
  // Fallback: insert after ~40% of blocks
  return Math.max(1, Math.floor(body.length * 0.4));
}

/**
 * Mid-article CTA — horizontal layout matching the live site design
 */
function MidArticleCTA({ categories }) {
  const ctaLink = getQuestionnaireLink(categories);
  const primaryCategory = categories?.find(c => c !== 'personal-injury') || categories?.[0];
  const topicLabel = primaryCategory
    ? primaryCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Personal Injury';

  return (
    <div className="my-10 p-6 bg-accent/10 border-2 border-accent/30 rounded-2xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="text-xl font-bold text-text mb-1">
          Affected by a {topicLabel} Issue?
        </h3>
        <p className="text-textMuted text-sm">
          Our specialized tool can help you estimate the potential worth of your case based on current laws and precedents.
        </p>
      </div>
      <Link
        to={ctaLink}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-textDark rounded-xl font-bold hover:opacity-90 transition-all whitespace-nowrap shrink-0"
      >
        Check Case Worth
        <ArrowRight className="w-4 h-4" />
      </Link>
      {(() => {
        const caseTypeId = getCaseTypeFromCategory(primaryCategory);
        const caseSlug = (caseTypeId && caseIdToSlug[caseTypeId]) || 'motor-vehicle-accident';
        const topStates = ['california', 'texas', 'new-york', 'florida', 'illinois', 'pennsylvania'];
        return (
          <div className="flex flex-wrap gap-2 items-center w-full border-t border-accent/20 mt-3 pt-3">
            <span className="text-xs text-textMuted shrink-0">Calculate by state:</span>
            {topStates.map(slug => (
              <Link
                key={slug}
                to={`/${slug}/${caseSlug}-calculator`}
                className="text-xs text-accent hover:underline whitespace-nowrap"
              >
                {stateSlugToInfo[slug].name}
              </Link>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

/**
 * Sidebar CTA card — "What's My Case Worth?"
 */
function SidebarCTA({ categories }) {
  const ctaLink = getQuestionnaireLink(categories);

  return (
    <div className="bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-2 border-accent/40 rounded-2xl p-6 text-center mb-6">
      <DollarSign className="w-10 h-10 text-accent mx-auto mb-3" aria-hidden="true" />
      <h3 className="text-xl font-bold text-text mb-2">What's My Case Worth?</h3>
      <p className="text-sm text-textMuted mb-4">
        Answer a few simple questions to get an instant estimate of your potential settlement value.
      </p>
      <Link
        to={ctaLink}
        className="block w-full px-6 py-3 bg-gradient-gold text-textDark rounded-xl font-bold hover:opacity-90 transition-all mb-4"
      >
        Start Free Calculator
      </Link>
      <div className="space-y-1.5 text-xs text-textMuted">
        <div className="flex items-center justify-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
          No contact info required
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
          Free & confidential
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
          256-bit encryption
        </div>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = await getPostBySlug(slug);

        if (!postData) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }

        // Fetch related and recent posts in parallel
        const [relatedData, recentData] = await Promise.all([
          getRelatedPosts(slug, postData.categories || [], 4),
          getRecentPosts(6) // Fetch 6 to have 5 after filtering out current post
        ]);

        setPost(postData);
        setRelatedPosts(relatedData);
        // Filter out current post from recent posts, limit to 5
        setRecentPosts(recentData.filter(p => p.slug.current !== slug).slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
        window.prerenderReady = true;
      }
    };

    fetchData();
  }, [slug]);

  // Extract table of contents headings from post body
  const headings = useMemo(() => post?.body ? extractHeadings(post.body) : [], [post?.body]);

  // Split body at the second h2 to insert mid-article CTA between sections
  const { firstPart, secondPart } = useMemo(() => {
    if (!post?.body) return { firstPart: [], secondPart: [] };
    const splitIndex = findCtaSplitIndex(post.body);
    if (splitIndex <= 0) return { firstPart: post.body, secondPart: [] };
    return {
      firstPart: post.body.slice(0, splitIndex),
      secondPart: post.body.slice(splitIndex),
    };
  }, [post?.body]);

  // Custom components for rendering Portable Text
  // Headings get id attributes for anchor links + scroll-margin for sticky nav offset
  const portableTextComponents = {
    types: {
      image: ({ value }) => (
        <figure className="my-8">
          <img
            srcSet={generateSrcSet(value, [600, 800, 1000, 1200])}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 800px, 1000px"
            src={urlFor(value).width(1000).format('webp').url()}
            alt={value.alt || ''}
            className="w-full rounded-xl"
            loading="lazy"
            width="1000"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-400 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
    },
    block: {
      h2: ({ children, value }) => {
        const text = extractText(value);
        const id = slugify(text);
        return (
          <h2 id={id} className="text-3xl font-bold text-text mt-12 mb-4 scroll-mt-24">
            {children}
          </h2>
        );
      },
      h3: ({ children, value }) => {
        const text = extractText(value);
        const id = slugify(text);
        return (
          <h3 id={id} className="text-2xl font-bold text-text mt-10 mb-3 scroll-mt-24">
            {children}
          </h3>
        );
      },
      h4: ({ children }) => (
        <h4 className="text-xl font-bold text-text mt-8 mb-3">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-6 my-6 italic text-textMuted bg-card/50 py-4 rounded-r-xl backdrop-blur-xl">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="text-textMuted leading-relaxed mb-6">{children}</p>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accentHover underline font-semibold"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => (
        <strong className="font-bold text-text">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="italic">{children}</em>
      ),
      code: ({ children }) => (
        <code className="bg-card text-accent px-2 py-1 rounded text-sm font-mono border border-cardBorder">
          {children}
        </code>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside space-y-2 mb-6 text-textMuted ml-4">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside space-y-2 mb-6 text-textMuted ml-4">
          {children}
        </ol>
      ),
    },
  };

  if (loading) {
    return (
      <BlogLayout>
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
          <div className="flex flex-col items-center" role="status" aria-live="polite">
            <Loader className="w-12 h-12 text-accent animate-spin mb-4" aria-hidden="true" />
            <p className="text-textMuted text-lg">Loading post...</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (error || !post) {
    return (
      <BlogLayout>
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="bg-red-500/20 border-2 border-red-500/40 rounded-3xl p-8 backdrop-blur-xl">
              <p className="text-red-200 text-lg mb-4">{error || 'Post not found'}</p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-textDark rounded-xl transition-all font-bold hover:opacity-90"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout categories={post.categories}>
      <Helmet>
        <title>{post.seo?.metaTitle || post.title} - CaseValue.law</title>
        <meta name="description" content={post.seo?.metaDescription || post.excerpt} />
        {post.seo?.keywords && (
          <meta name="keywords" content={post.seo.keywords.join(', ')} />
        )}

        {/* Canonical URL - point to the specific blog post */}
        <link rel="canonical" href={`https://casevalue.law/blog/${slug}`} />

        {/* Article-specific OG (SocialMeta handles the rest) */}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedAt} />

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://casevalue.law"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://casevalue.law/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://casevalue.law/blog/${slug}`
              }
            ]
          })}
        </script>

        {/* BlogPosting Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `https://casevalue.law/blog/${slug}#article`,
            "headline": post.title,
            "description": post.seo?.metaDescription || post.excerpt,
            "image": post.mainImage ? urlFor(post.mainImage).width(1200).url() : undefined,
            "datePublished": post.publishedAt,
            "dateModified": post._updatedAt || post.publishedAt,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@id": "https://casevalue.law/#organization"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://casevalue.law/blog/${slug}`
            }
          })}
        </script>

        {/* Preload LCP image for faster loading */}
        {post.mainImage && (
          <link
            rel="preload"
            as="image"
            href={urlFor(post.mainImage).width(1000).height(563).format('webp').url()}
            imageSrcSet={generateSrcSet(post.mainImage, [600, 800, 1000, 1200], 9/16)}
            imageSizes="(max-width: 640px) 600px, (max-width: 1024px) 800px, 1000px"
            fetchpriority="high"
          />
        )}
      </Helmet>
      <SocialMeta
        title={post.title}
        description={post.excerpt}
        url={`https://casevalue.law/blog/${slug}`}
        image={post.mainImage ? urlFor(post.mainImage).width(1200).url() : undefined}
        type="article"
      />

      <div className="min-h-screen bg-gradient-hero">
        {/* Back to Blog Link */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accentHover transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header (full width) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-0">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: null }
            ]}
          />
          {/* Hero Image */}
          {post.mainImage && (
            <div className="aspect-video overflow-hidden rounded-3xl mb-8 shadow-card border-2 border-cardBorder">
              <img
                srcSet={generateSrcSet(post.mainImage, [600, 800, 1000, 1200], 9/16)}
                sizes="(max-width: 640px) 600px, (max-width: 1024px) 800px, 1000px"
                src={urlFor(post.mainImage).width(1000).height(563).format('webp').url()}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover"
                fetchpriority="high"
                width="1000"
                height="563"
              />
            </div>
          )}

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-accent/20 text-accent rounded-full border border-accent/30 font-semibold"
                >
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  {category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-textMuted mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-textMuted pb-8 mb-8 border-b border-cardBorder">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>
        </div>

        {/* Two-column layout: Article Body + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Article Body */}
            <article className="lg:col-span-8 prose prose-invert prose-lg max-w-none pb-12">
              {/* First section (up to second h2) */}
              {firstPart.length > 0 && (
                <PortableText
                  value={firstPart}
                  components={portableTextComponents}
                />
              )}

              {/* Mid-article CTA — after first section */}
              <MidArticleCTA categories={post.categories} />

              {/* Remaining content (from second h2 onward) */}
              {secondPart.length > 0 && (
                <PortableText
                  value={secondPart}
                  components={portableTextComponents}
                />
              )}

              {/* Disclaimer */}
              <div className="mt-12 p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
                <p className="text-sm text-yellow-200/90">
                  <strong>Disclaimer:</strong> This blog post is for informational purposes only and does not constitute legal advice.
                  For specific legal guidance regarding your situation, please consult with a qualified attorney.
                </p>
              </div>
            </article>

            {/* Sidebar (desktop only) */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24">
                {/* CTA Card */}
                <SidebarCTA categories={post.categories} />

                {/* Table of Contents */}
                {headings.length > 0 && (
                  <nav className="bg-card/50 backdrop-blur-xl border-2 border-cardBorder rounded-2xl p-6" aria-label="Table of contents">
                    <h2 className="text-sm font-bold text-text mb-4 uppercase tracking-wide">
                      On This Page
                    </h2>
                    <ul className="space-y-2">
                      {headings.map(heading => (
                        <li
                          key={heading.id}
                          className={heading.level === 'h3' ? 'ml-4' : ''}
                        >
                          <a
                            href={`#${heading.id}`}
                            className="text-sm text-textMuted hover:text-accent transition-colors leading-snug block py-0.5"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-cardBorder">
            <h2 className="text-3xl font-bold text-text mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link
                  key={relatedPost._id}
                  to={`/blog/${relatedPost.slug.current}`}
                  className="group bg-card backdrop-blur-3xl rounded-xl overflow-hidden border-2 border-cardBorder hover:border-accent/50 transition-all duration-300 shadow-card hover:shadow-glow-gold-soft"
                >
                  {relatedPost.mainImage && (
                    <div className="aspect-video overflow-hidden bg-primary">
                      <img
                        srcSet={generateSrcSet(relatedPost.mainImage, [400, 600, 800], 9/16)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        src={urlFor(relatedPost.mainImage).width(600).height(338).format('webp').url()}
                        alt={relatedPost.imageAlt || relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width="600"
                        height="338"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-text mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-textMuted line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-textMuted">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Previous Posts */}
        {recentPosts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-cardBorder">
            <h2 className="text-3xl font-bold text-text mb-8">Previous Posts</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recentPosts.map(relatedPost => (
                <Link
                  key={relatedPost._id}
                  to={`/blog/${relatedPost.slug.current}`}
                  className="group bg-card backdrop-blur-3xl rounded-xl overflow-hidden border-2 border-cardBorder hover:border-accent/50 transition-all duration-300 shadow-card hover:shadow-glow-gold-soft"
                >
                  {relatedPost.mainImage && (
                    <div className="aspect-video overflow-hidden bg-primary">
                      <img
                        srcSet={generateSrcSet(relatedPost.mainImage, [200, 300, 400], 9/16)}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        src={urlFor(relatedPost.mainImage).width(300).height(169).format('webp').url()}
                        alt={relatedPost.imageAlt || relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width="300"
                        height="169"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-text mb-1 group-hover:text-accent transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs text-textMuted line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </BlogLayout>
  );
}
