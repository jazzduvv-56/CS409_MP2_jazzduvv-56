import { NASAImage, SortProperty, SortOrder } from '../types/nasa.types';

/**
 * Sort NASA images by a given property
 * @param images - Array of NASA images
 * @param property - Property to sort by
 * @param order - Sort order (asc or desc)
 * @returns Sorted array of images
 */
export const sortImages = (
  images: NASAImage[],
  property: SortProperty,
  order: SortOrder
): NASAImage[] => {
  const sortedImages = [...images].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;

    if (property === 'date') {
      valueA = new Date(a.date || '').getTime();
      valueB = new Date(b.date || '').getTime();
    } else {
      valueA = a[property]?.toLowerCase() || '';
      valueB = b[property]?.toLowerCase() || '';
    }

    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedImages;
};

/**
 * Filter images by search query (client-side filtering)
 * Filters ONLY by title for precise results
 * @param images - Array of NASA images
 * @param query - Search query string
 * @returns Filtered array of images
 */
export const filterImagesByQuery = (
  images: NASAImage[],
  query: string
): NASAImage[] => {
  if (!query.trim()) return images;

  const lowerQuery = query.toLowerCase();
  
  // Filter ONLY by title
  return images.filter((image) => {
    return image.title.toLowerCase().includes(lowerQuery);
  });
};

/**
 * Filter images by keywords
 * @param images - Array of NASA images
 * @param keywords - Array of keyword filters
 * @returns Filtered array of images
 */
export const filterImagesByKeywords = (
  images: NASAImage[],
  keywords: string[]
): NASAImage[] => {
  if (!keywords.length) return images;

  return images.filter((image) =>
    keywords.some((keyword) =>
      image.keywords?.some((imgKeyword) =>
        imgKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  );
};

/**
 * Get unique keywords from images
 * @param images - Array of NASA images
 * @returns Array of unique keywords
 */
export const getUniqueKeywords = (images: NASAImage[]): string[] => {
  const keywordSet = new Set<string>();
  images.forEach((image) => {
    image.keywords?.forEach((keyword) => {
      if (keyword) keywordSet.add(keyword);
    });
  });
  return Array.from(keywordSet).sort();
};

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
