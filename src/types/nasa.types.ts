// NASA API Response Types

export interface NASAImage {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
  media_type: string;
  thumbnail_url?: string;
  photographer?: string;
  location?: string;
  keywords?: string[];
  nasa_id?: string;
  center?: string;
  date_created?: string;
}

export interface NASASearchResponse {
  collection: {
    version: string;
    href: string;
    items: NASASearchItem[];
    metadata: {
      total_hits: number;
    };
  };
}

export interface NASASearchItem {
  href: string;
  data: Array<{
    title: string;
    nasa_id: string;
    description: string;
    date_created: string;
    media_type: string;
    keywords?: string[];
    center?: string;
    photographer?: string;
    location?: string;
  }>;
  links?: Array<{
    href: string;
    rel: string;
    render?: string;
  }>;
}

export interface APODResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

export type SortProperty = 'title' | 'date';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  keywords?: string[];
  mediaType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
