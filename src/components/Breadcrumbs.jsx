// ============================================================================
// BREADCRUMBS COMPONENT
// ============================================================================
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

/**
 * Breadcrumbs navigation component
 * @param {Array} items - Array of breadcrumb items with { label, href }
 *                        Last item (current page) should have href: null
 *
 * Example:
 * <Breadcrumbs items={[
 *   { label: 'Home', href: '/' },
 *   { label: 'Blog', href: '/blog' },
 *   { label: 'Post Title', href: null }
 * ]} />
 */
export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      className="hidden sm:flex items-center text-sm text-textMuted mb-6"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-accent mx-2" aria-hidden="true" />
              )}

              {isLast ? (
                // Current page - not a link
                <span
                  className="text-text font-medium"
                  aria-current="page"
                >
                  {isFirst && <Home className="w-4 h-4 inline mr-1" aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                // Link to previous pages
                <Link
                  to={item.href}
                  className="hover:text-text transition-colors flex items-center"
                >
                  {isFirst && <Home className="w-4 h-4 inline mr-1" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
