# Arabam.com Frontend Assignment

**English** | [Türkçe](README.md)

A vehicle listing and detail viewing application built with Vue 3 and TypeScript.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Run tests
npm run test:unit
```

## Tech Stack

| Category      | Technology                 |
| ------------- | -------------------------- |
| Framework     | Vue 3 + TypeScript         |
| State         | Pinia                      |
| Data Fetching | TanStack Query (Vue Query) |
| Styling       | Tailwind CSS v4            |
| Routing       | Vue Router                 |
| i18n          | Vue I18n                   |
| Testing       | Vitest                     |
| Icons         | Lucide Vue                 |

---

## Development Decisions

### 1. UX Decision: Content Discovery via "Similar Adverts"

Since the API doesn't provide a category list endpoint and asking users for category IDs would be poor UX, I didn't implement category-based filtering. Instead, on the detail page, **"Similar Adverts"** are displayed based on the current advert's category, enabling natural content discovery.

### 2. Visual Interaction & Accessibility

A `useParallax` hook was developed for depth perception effects. However, respecting accessibility, parallax and sudden hover effects are **automatically disabled** for users with `prefers-reduced-motion` enabled.

### 3. i18n Infrastructure

For future scalability, **Vue I18n** was integrated even though current data is Turkish-only. The project is ready for global deployment without code structure changes.

### 4. Adaptive UX: Pagination & Infinite Scroll

The application provides an adaptive experience based on platform habits:

| Platform    | Behavior                                    |
| ----------- | ------------------------------------------- |
| **Desktop** | Pagination for quick access and navigation  |
| **Mobile**  | Infinite Scroll for natural scrolling habit |

### 5. Smart Image Management: SmartImage Component

The API serves images in multiple sizes. The `SmartImage` component handles this intelligently:

- **Lazy Loading**: Images load when entering viewport via IntersectionObserver
- **Progressive Fallback**: Automatic fallback to smaller sizes if preferred size fails
- **Skeleton UI**: Shimmer animation during loading
- **Error State**: Graceful error handling when all sizes fail

### 6. URL-Based Filter State (Deep Linking)

Filters are stored in URL query parameters, which enables:

- Shareable links with filtered results
- Browser back/forward navigation preserves filter state
- Filter state persists on page refresh

### 7. Data Management with Vue Query

`@tanstack/vue-query` is used for data fetching:

- **Caching**: `staleTime` prevents unnecessary API calls
- **Optimistic Updates**: `keepPreviousData` prevents data loss during page transitions
- **Infinite Query**: Infinite scroll support for mobile

### 8. Dark Mode Support

A modern, eye-friendly dark theme is integrated using CSS variables and Tailwind dark mode classes for consistent theming.

### 9. Test Infrastructure (Vitest)

Unit tests were written using Vitest for critical composable functions (`useAdvertDisplay`, `useFilterStore`) and UI components (`AdvertControls`, `HomeView`) to ensure code reliability.

### 10. Reusable UI Components

To prevent code duplication, base UI components like `BaseAccordion` (animated panels), `BaseDrawer` (mobile menu), and `BaseSkeleton` were made modular.

### 11. Performance Optimizations

A Lighthouse-compliant architecture was built with image lazy loading, Scroll Position Restore when returning to the list view, and aggressive data caching strategies.

### 12. Global Error Handling

A `useGlobalError` composable and `GlobalError` component were developed for centralized error management. API errors or unexpected situations are caught from a single point, providing users with a consistent error screen.

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── advert/          # Advert-related components
│   ├── common/          # General components (SmartImage, GlobalError)
│   └── ui/              # Base UI components (Accordion, Drawer, Skeleton)
├── composables/         # UI-independent business logic
│   ├── useAdverts.ts    # Advert data management (Vue Query)
│   ├── useParallax.ts   # Parallax effect
│   ├── useGallery.ts    # Gallery navigation
│   └── ...
├── services/            # API requests and data management
├── stores/              # Pinia global state
├── types/               # TypeScript definitions
├── utils/               # Helper functions
├── i18n/                # Language files (tr, en)
├── views/               # Page components
├── router/              # Vue Router configuration
└── __tests__/           # Vitest unit tests
```

---

## License

This project was developed for the Arabam.com Frontend Assessment.
