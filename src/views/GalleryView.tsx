import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchNASAImages } from '../services/nasaAPI';
import { NASAImage } from '../types/nasa.types';
import styles from './GalleryView.module.css';

const GalleryView: React.FC = () => {
  const [images, setImages] = useState<NASAImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<NASAImage[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Define meaningful galaxy categories
  const galaxyCategories = [
    'Spiral',
    'Elliptical',
    'Irregular',
    'Hubble',
    'NGC',
    'Andromeda',
    'Cluster',
    'Dwarf',
    'Barred'
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((image) => {
        const titleLower = image.title.toLowerCase();
        const descLower = image.description.toLowerCase();
        const allKeywords = image.keywords?.map(k => k.toLowerCase()).join(' ') || '';
        
        return selectedCategories.some((category) => {
          const catLower = category.toLowerCase();
          return titleLower.includes(catLower) || 
                 descLower.includes(catLower) || 
                 allKeywords.includes(catLower);
        });
      });
      setFilteredImages(filtered);
    }
  }, [images, selectedCategories]);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch galaxy images
      const data = await searchNASAImages('galaxy', 1);
      setImages(data);
    } catch (err) {
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NASA Galaxy Gallery</h1>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <h3 className={styles.filterTitle}>Filter by Galaxy Type</h3>
          {selectedCategories.length > 0 && (
            <button onClick={clearFilters} className={styles.clearButton}>
              Clear Filters ({selectedCategories.length})
            </button>
          )}
        </div>
        <div className={styles.keywordList}>
          {galaxyCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`${styles.keywordButton} ${
                selectedCategories.includes(category) ? styles.selected : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Loading State */}
      {loading && <div className={styles.loading}>Loading gallery...</div>}

      {/* Gallery Grid */}
      {!loading && (
        <div className={styles.galleryContainer}>
          {filteredImages.length === 0 ? (
            <p className={styles.noResults}>
              No images match the selected filters. Try different keywords.
            </p>
          ) : (
            <div className={styles.gallery}>
              {filteredImages.map((image, index) => (
                <Link
                  key={image.id}
                  to={`/detail/${image.id}`}
                  state={{ images: filteredImages, currentIndex: index }}
                  className={styles.galleryItem}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={image.url}
                      alt={image.title}
                      className={styles.galleryImage}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className={styles.imageOverlay}>
                      <h3 className={styles.imageTitle}>{image.title}</h3>
                      <p className={styles.imageDate}>
                        {new Date(image.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.resultCount}>
        Showing {filteredImages.length} of {images.length} images
      </div>
    </div>
  );
};

export default GalleryView;
