import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchNASAImages } from '../services/nasaAPI';
import { NASAImage, SortProperty, SortOrder } from '../types/nasa.types';
import { sortImages, filterImagesByQuery } from '../utils/helpers';
import styles from './ListView.module.css';

const ListView: React.FC = () => {
  const [images, setImages] = useState<NASAImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<NASAImage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortProperty, setSortProperty] = useState<SortProperty>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch galaxy images on component mount (only once)
  useEffect(() => {
    fetchImages();
  }, []);

  // Filter and sort images whenever dependencies change
  useEffect(() => {
    let result = filterImagesByQuery(images, searchQuery);
    result = sortImages(result, sortProperty, sortOrder);
    setFilteredImages(result);
  }, [images, searchQuery, sortProperty, sortOrder]);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch only galaxy images
      const data = await searchNASAImages('galaxy', 1);
      setImages(data);
    } catch (err) {
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (property: SortProperty) => {
    if (sortProperty === property) {
      // Toggle order if same property
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortProperty(property);
      setSortOrder('asc');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NASA Galaxy Image Library</h1>

      {/* Search Bar - Filter galaxies as you type */}
      <div className={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Filter galaxies by name"
          className={styles.searchInput}
        />
      </div>

      {/* Sort Controls */}
      <div className={styles.sortControls}>
        <span className={styles.sortLabel}>Sort by:</span>
        <button
          onClick={() => handleSortChange('title')}
          className={`${styles.sortButton} ${
            sortProperty === 'title' ? styles.active : ''
          }`}
        >
          Title {sortProperty === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSortChange('date')}
          className={`${styles.sortButton} ${
            sortProperty === 'date' ? styles.active : ''
          }`}
        >
          Date {sortProperty === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Loading State */}
      {loading && <div className={styles.loading}>Loading images...</div>}

      {/* Image List */}
      {!loading && (
        <div className={styles.listContainer}>
          {filteredImages.length === 0 ? (
            <p className={styles.noResults}>
              {images.length === 0 
                ? 'Enter a search term above to find NASA images.' 
                : 'No results found. Try a different search term.'}
            </p>
          ) : (
            <ul className={styles.imageList}>
              {filteredImages.map((image) => (
                <li key={image.id} className={styles.listItem}>
                  <Link
                    to={`/detail/${image.id}`}
                    state={{ images: filteredImages, currentIndex: filteredImages.indexOf(image) }}
                    className={styles.listLink}
                  >
                    <div className={styles.listItemContent}>
                      <img
                        src={image.thumbnail_url || image.url}
                        alt={image.title}
                        className={styles.thumbnail}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
                        }}
                      />
                      <div className={styles.listItemInfo}>
                        <h3 className={styles.listItemTitle}>{image.title}</h3>
                        <p className={styles.listItemDate}>
                          {new Date(image.date).toLocaleDateString()}
                        </p>
                        <p className={styles.listItemDescription}>
                          {image.description.substring(0, 150)}
                          {image.description.length > 150 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ListView;
