import axios from 'axios';
import { NASASearchResponse, NASAImage } from '../types/nasa.types';

// NASA API Configuration - Galaxy-focused app
const NASA_IMAGES_BASE_URL = 'https://images-api.nasa.gov';
const DEFAULT_QUERY = 'galaxy';

// Create axios instance for NASA Images API
const nasaImagesAPI = axios.create({
  baseURL: NASA_IMAGES_BASE_URL,
  timeout: 10000,
});

/**
 * Search NASA image library for galaxies
 * @param query - Search query string (defaults to 'galaxy')
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with search results
 */
export const searchNASAImages = async (
  query: string = DEFAULT_QUERY,
  page: number = 1
): Promise<NASAImage[]> => {
  try {
    const response = await nasaImagesAPI.get<NASASearchResponse>('/search', {
      params: {
        q: query || DEFAULT_QUERY,
        media_type: 'image',
        page: page,
      },
    });

    // Transform API response to our NASAImage type
    const items = response.data.collection.items || [];
    return items.map((item, index) => ({
      id: item.data[0]?.nasa_id || `item-${index}`,
      title: item.data[0]?.title || 'Untitled',
      description: item.data[0]?.description || 'No description available',
      date: item.data[0]?.date_created || '',
      url: item.links?.[0]?.href || '',
      media_type: item.data[0]?.media_type || 'image',
      thumbnail_url: item.links?.[0]?.href || '',
      photographer: item.data[0]?.photographer,
      location: item.data[0]?.location,
      keywords: item.data[0]?.keywords || [],
      nasa_id: item.data[0]?.nasa_id,
      center: item.data[0]?.center,
      date_created: item.data[0]?.date_created,
    }));
  } catch (error) {
    console.error('Error fetching NASA images:', error);
    throw new Error('Failed to fetch NASA images. Please try again.');
  }
};



/**
 * Get asset details for a specific NASA ID
 * @param nasaId - NASA asset ID
 * @returns Promise with asset details
 */
export const getNASAAssetById = async (nasaId: string): Promise<any> => {
  try {
    const response = await nasaImagesAPI.get(`/asset/${nasaId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching NASA asset:', error);
    throw new Error('Failed to fetch asset details.');
  }
};


