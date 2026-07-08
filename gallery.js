/* Gallery Interactive Logic: Filtering & Lightbox */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Gallery Filtering Logic
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active class for buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter gallery cards
      galleryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Show card with smooth transitions
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Hide card smoothly
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // =========================================================================
  // 2. Lightbox Modal Logic with Next/Prev
  // =========================================================================
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCat = document.getElementById('lightbox-cat-text');
  const lightboxTitle = document.getElementById('lightbox-title-text');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');
  
  let currentVisibleCards = [];
  let currentIndex = 0;

  if (lightbox && lightboxImg) {
    
    const updateLightboxContent = () => {
      if (currentVisibleCards.length === 0) return;
      const card = currentVisibleCards[currentIndex];
      const img = card.querySelector('.gallery-img');
      const cat = card.querySelector('.gallery-card-category');
      const title = card.querySelector('.gallery-card-title');
      
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCat.textContent = cat ? cat.textContent : '';
        lightboxTitle.textContent = title ? title.textContent : '';
      }
    };

    galleryCards.forEach((card) => {
      card.addEventListener('click', () => {
        // Find currently visible cards (filtered)
        currentVisibleCards = Array.from(galleryCards).filter(c => c.style.display !== 'none');
        currentIndex = currentVisibleCards.indexOf(card);
        
        updateLightboxContent();

        // Open lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock body scroll
      });
    });

    const nextImage = () => {
      if (currentVisibleCards.length > 0) {
        currentIndex = (currentIndex + 1) % currentVisibleCards.length;
        updateLightboxContent();
      }
    };

    const prevImage = () => {
      if (currentVisibleCards.length > 0) {
        currentIndex = (currentIndex - 1 + currentVisibleCards.length) % currentVisibleCards.length;
        updateLightboxContent();
      }
    };

    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

    // Close lightbox via button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        closeLightbox();
      });
    }

    // Close lightbox via background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
      setTimeout(() => {
        lightboxImg.src = '';
        lightboxImg.alt = '';
      }, 400); // Clear source after close transition
    };
  }
});
