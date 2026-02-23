// ============================================================================
// BLOG LISTING PAGE
// ============================================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllPosts, urlFor, generateSrcSet } from '../../utils/sanityClient';
import { Calendar, User, ArrowRight, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Scroll to top when component mounts
  useScrollToTop();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
        window.prerenderReady = true;
      }
    };

    fetchPosts();
  }, []);

  // Get unique categories from all posts
  const categories = ['all', ...new Set(posts.flatMap(post => post.categories || []))];

  // Filter posts by selected category
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.categories?.includes(selectedCategory));

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset to page 1 when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Change page and scroll to top of grid
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers with ellipsis for large ranges
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>Legal Blog - CaseValue.law</title>
        <meta name="description" content="Expert insights on personal injury law, medical malpractice, motor vehicle accidents, and more. Learn about your legal rights and case values." />
        <meta name="keywords" content="legal blog, personal injury law, texas law, case value, statute of limitations" />
        <link rel="canonical" href="https://casevalue.law/blog" />
        <meta property="og:url" content="https://casevalue.law/blog" />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-4">
              Legal <span className="text-transparent bg-clip-text bg-gradient-gold">Insights</span>
            </h1>
            <p className="text-xl text-textMuted max-w-3xl mx-auto">
              Expert guidance on personal injury law, case valuations, and your legal rights
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === category
                      ? 'bg-gradient-gold text-textDark shadow-glow-gold-soft'
                      : 'bg-card/50 text-text/70 hover:bg-card border border-cardBorder'
                    }`}
                >
                  {category === 'all' ? 'All Posts' : category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
              <Loader className="w-12 h-12 text-accent animate-spin mb-4" aria-hidden="true" />
              <p className="text-textMuted text-lg">Loading blog posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="bg-red-500/20 border-2 border-red-500/40 rounded-3xl p-8 backdrop-blur-xl">
                <p className="text-red-200 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-semibold"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="bg-card backdrop-blur-xl border-2 border-cardBorder rounded-3xl p-8 shadow-card">
                <p className="text-text text-lg mb-2">No blog posts found</p>
                <p className="text-textMuted">
                  {selectedCategory !== 'all'
                    ? 'Try selecting a different category.'
                    : 'Check back soon for new content!'}
                </p>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && !error && filteredPosts.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
              {paginatedPosts.map((post, index) => (
                <li key={post._id}>
                <Link
                  to={`/blog/${post.slug.current}`}
                  className="group block bg-card rounded-3xl overflow-hidden border-3 border-cardBorder hover:border-accent/50 transition-all duration-300 shadow-card hover:shadow-glow-gold-soft hover:scale-[1.02]"
                >
                  {/* Post Image - first image is LCP, load eagerly with high priority */}
                  {post.mainImage && (
                    <div className="aspect-video overflow-hidden bg-primary">
                      <img
                        srcSet={generateSrcSet(post.mainImage, [400, 600, 800], 9/16)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        src={urlFor(post.mainImage).width(600).height(338).format('webp').url()}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : undefined}
                        width="600"
                        height="338"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map(category => (
                          <span
                            key={category}
                            className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-semibold"
                          >
                            {category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-text mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-textMuted mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-textMuted border-t border-cardBorder pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" aria-hidden="true" />
                          <span className="font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Blog pagination">
              {/* Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-card/50 text-textMuted hover:bg-card border border-cardBorder"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, i) =>
                page === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-textMuted">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-gold text-textDark shadow-glow-gold-soft'
                        : 'bg-card/50 text-textMuted hover:bg-card border border-cardBorder'
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-card/50 text-textMuted hover:bg-card border border-cardBorder"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </BlogLayout>
  );
}
