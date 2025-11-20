// ============================================================================
// INDIVIDUAL BLOG POST PAGE
// ============================================================================
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PortableText } from '@portabletext/react';
import { getPostBySlug, getRecentPosts, urlFor, generateSrcSet } from '../../utils/sanityClient';
import { Calendar, User, ArrowLeft, Loader, Tag } from 'lucide-react';
import BlogLayout from '../BlogLayout';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postData, recentData] = await Promise.all([
          getPostBySlug(slug),
          getRecentPosts(3)
        ]);

        if (!postData) {
          setError('Blog post not found');
        } else {
          setPost(postData);
          // Filter out current post from recent posts
          setRecentPosts(recentData.filter(p => p.slug.current !== slug));
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Custom components for rendering Portable Text
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
      h2: ({ children }) => (
        <h2 className="text-3xl font-bold text-text mt-12 mb-4">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl font-bold text-text mt-10 mb-3">{children}</h3>
      ),
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
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
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
    <BlogLayout>
      <Helmet>
        <title>{post.seo?.metaTitle || post.title} - CaseValue.law</title>
        <meta name="description" content={post.seo?.metaDescription || post.excerpt} />
        {post.seo?.keywords && (
          <meta name="keywords" content={post.seo.keywords.join(', ')} />
        )}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.mainImage && (
          <meta property="og:image" content={urlFor(post.mainImage).width(1200).url()} />
        )}
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero">
        {/* Back to Blog Link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accentHover transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Container */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                  <Tag className="w-3 h-3" />
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
              <User className="w-5 h-5" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-invert prose-lg max-w-none">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl">
            <p className="text-sm text-yellow-200/90">
              <strong>Disclaimer:</strong> This blog post is for informational purposes only and does not constitute legal advice.
              For specific legal guidance regarding your situation, please consult with a qualified attorney.
            </p>
          </div>
        </article>

        {/* Related Posts */}
        {recentPosts.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-cardBorder">
            <h2 className="text-3xl font-bold text-text mb-8">More Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.map(relatedPost => (
                <Link
                  key={relatedPost._id}
                  to={`/blog/${relatedPost.slug.current}`}
                  className="group bg-card backdrop-blur-3xl rounded-3xl overflow-hidden border-2 border-cardBorder hover:border-accent/50 transition-all duration-300 shadow-card hover:shadow-glow-gold-soft"
                >
                  {relatedPost.mainImage && (
                    <div className="aspect-video overflow-hidden bg-primary">
                      <img
                        srcSet={generateSrcSet(relatedPost.mainImage, [300, 400, 500], 9/16)}
                        sizes="(max-width: 768px) 100vw, 400px"
                        src={urlFor(relatedPost.mainImage).width(400).height(225).format('webp').url()}
                        alt={relatedPost.imageAlt || relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width="400"
                        height="225"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-text mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-textMuted line-clamp-2">
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
