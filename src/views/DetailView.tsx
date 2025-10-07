import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { NASAImage } from '../types/nasa.types';
import { formatDate } from '../utils/helpers';
import styles from './DetailView.module.css';

interface LocationState {
  images?: NASAImage[];
  currentIndex?: number;
}

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [currentImage, setCurrentImage] = useState<NASAImage | null>(null);
  const [images, setImages] = useState<NASAImage[]>(state?.images || []);
  const [currentIndex, setCurrentIndex] = useState<number>(state?.currentIndex ?? 0);

  useEffect(() => {
    if (state?.images && state?.currentIndex !== undefined) {
      setImages(state.images);
      setCurrentIndex(state.currentIndex);
      setCurrentImage(state.images[state.currentIndex]);
    } else if (id) {
      // If no state provided, try to find image by ID
      // In a real app, you would fetch from API
      const found = images.find((img) => img.id === id);
      if (found) {
        setCurrentImage(found);
      }
    }
  }, [id, state, images]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentImage(images[newIndex]);
      navigate(`/detail/${images[newIndex].id}`, {
        state: { images, currentIndex: newIndex },
        replace: true,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentImage(images[newIndex]);
      navigate(`/detail/${images[newIndex].id}`, {
        state: { images, currentIndex: newIndex },
        replace: true,
      });
    }
  };

  if (!currentImage) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Image not found</h2>
          <p>The requested image could not be found.</p>
          <Link to="/" className={styles.backLink}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          ← Back to List
        </Link>
        <div className={styles.navInfo}>
          {images.length > 0 && (
            <span>
              Image {currentIndex + 1} of {images.length}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className={styles.mainImage}
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/800x600?text=Image+Not+Available';
            }}
          />

          {/* Previous/Next Navigation */}
          {images.length > 1 && (
            <div className={styles.imageNav}>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={styles.navButton}
                aria-label="Previous image"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === images.length - 1}
                className={styles.navButton}
                aria-label="Next image"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className={styles.detailsSection}>
          <h1 className={styles.title}>{currentImage.title}</h1>

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Date:</span>
              <span className={styles.metaValue}>
                {formatDate(currentImage.date)}
              </span>
            </div>

            {currentImage.nasa_id && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>NASA ID:</span>
                <span className={styles.metaValue}>{currentImage.nasa_id}</span>
              </div>
            )}

            {currentImage.center && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Center:</span>
                <span className={styles.metaValue}>{currentImage.center}</span>
              </div>
            )}

            {currentImage.photographer && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Photographer:</span>
                <span className={styles.metaValue}>
                  {currentImage.photographer}
                </span>
              </div>
            )}

            {currentImage.location && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Location:</span>
                <span className={styles.metaValue}>{currentImage.location}</span>
              </div>
            )}
          </div>

          <div className={styles.description}>
            <h3 className={styles.descriptionTitle}>Description</h3>
            <p className={styles.descriptionText}>{currentImage.description}</p>
          </div>

          {currentImage.keywords && currentImage.keywords.length > 0 && (
            <div className={styles.keywords}>
              <h3 className={styles.keywordsTitle}>Keywords</h3>
              <div className={styles.keywordList}>
                {currentImage.keywords.map((keyword, index) => (
                  <span key={index} className={styles.keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
