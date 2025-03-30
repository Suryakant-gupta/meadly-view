document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize slider
    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Event listeners for slider controls
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlider();
        startSlider();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlider();
        startSlider();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-index'));
            showSlide(slideIndex);
            stopSlider();
            startSlider();
        });
    });

    // Start the slider
    startSlider();

    // Gallery and Layout Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item, .layout-item');
    const zoomableImages = document.querySelectorAll('.zoomable-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevImgBtn = document.querySelector('.prev-img');
    const nextImgBtn = document.querySelector('.next-img');
    let currentImageIndex = 0;
    let galleryImages = [];

    // Collect all gallery images for lightbox navigation
    function collectGalleryImages() {
        galleryImages = [];
        document.querySelectorAll('.gallery-item:not(.mobile-hidden), .layout-item:not(.mobile-hidden), .zoomable-img').forEach(item => {
            let src;
            let alt;
            
            if (item.classList.contains('zoomable-img')) {
                src = item.getAttribute('src');
                alt = item.getAttribute('alt');
            } else {
                src = item.getAttribute('data-src');
                alt = item.querySelector('img').getAttribute('alt');
            }
            
            galleryImages.push({ src, alt });
        });
    }

    // Open lightbox with specific image
    function openLightbox(index) {
        collectGalleryImages();
        currentImageIndex = index;
        
        lightboxImg.src = galleryImages[index].src;
        lightboxCaption.textContent = galleryImages[index].alt;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Navigate to previous/next image in lightbox
    function navigateLightbox(direction) {
        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        } else {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        }
        
        lightboxImg.src = galleryImages[currentImageIndex].src;
        lightboxCaption.textContent = galleryImages[currentImageIndex].alt;
    }

    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Add click event to zoomable images
    zoomableImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(galleryItems.length + index);
        });
    });

    // Lightbox navigation
    prevImgBtn.addEventListener('click', () => {
        navigateLightbox('prev');
    });

    nextImgBtn.addEventListener('click', () => {
        navigateLightbox('next');
    });

    // Close lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            } else if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });

    // View More/Less Toggle for Gallery
    const viewToggleBtn = document.querySelector('.view-toggle-btn');
    const galleryHiddenItems = document.querySelectorAll('.gallery-item.mobile-hidden');
    
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', () => {
            viewToggleBtn.classList.toggle('active');
            
            if (viewToggleBtn.classList.contains('active')) {
                viewToggleBtn.innerHTML = 'View Less <i class="fas fa-chevron-up"></i>';
                galleryHiddenItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                viewToggleBtn.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
                galleryHiddenItems.forEach(item => {
                    item.style.display = 'none';
                });
            }
        });
    }

    // View More/Less Toggle for Floor Plans
    const floorToggleBtn = document.querySelector('.floor-toggle');
    const floorHiddenItems = document.querySelectorAll('.layout-item.mobile-hidden');
    
    if (floorToggleBtn) {
        floorToggleBtn.addEventListener('click', () => {
            floorToggleBtn.classList.toggle('active');
            
            if (floorToggleBtn.classList.contains('active')) {
                floorToggleBtn.innerHTML = 'View Less <i class="fas fa-chevron-up"></i>';
                floorHiddenItems.forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                floorToggleBtn.innerHTML = 'View More <i class="fas fa-chevron-down"></i>';
                floorHiddenItems.forEach(item => {
                    item.style.display = 'none';
                });
            }
        });
    }

    // Tour Modal
    const headerCta = document.getElementById('headerCta');
    const tourModal = document.getElementById('tourModal');
    const closeModal = document.querySelector('.close-modal');
    const tourForm = document.getElementById('tourForm');
    
    // Open tour modal
    headerCta.addEventListener('click', () => {
        tourModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Close tour modal
    closeModal.addEventListener('click', () => {
        tourModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    tourModal.addEventListener('click', (e) => {
        if (e.target === tourModal) {
            tourModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Tour form submission
    tourForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('tourName').value;
        const email = document.getElementById('tourEmail').value;
        const phone = document.getElementById('tourPhone').value;
        const date = document.getElementById('tourDate').value;
        const time = document.getElementById('tourTime').value;
        const message = document.getElementById('tourMessage').value;
        
        // Here you would typically send the data to a server
        console.log('Tour booked:', { name, email, phone, date, time, message });
        
        // Show success message
        alert('Your tour has been scheduled! We will confirm the details shortly.');
        
        // Reset form and close modal
        tourForm.reset();
        tourModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Lead Form Toggle
    const toggleFormBtn = document.querySelector('.toggle-form');
    const leadForm = document.querySelector('.lead-form');
    
    function toggleLeadForm() {
        leadForm.classList.toggle('active');
        toggleFormBtn.classList.toggle('active');
    }
    
    toggleFormBtn.addEventListener('click', toggleLeadForm);

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the data to a server
        // For demo purposes, we'll just log it and show an alert
        console.log('Form submitted:', { name, email, phone, message });
        
        // Show success message
        alert('Thank you for your interest! Our team will contact you shortly.');
        
        // Reset form
        contactForm.reset();
        
        // Close the form after submission
        setTimeout(() => {
            toggleLeadForm();
        }, 1000);
    });

    // Video Player
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const playButton = document.getElementById('playButton');
    const videoFrame = document.getElementById('videoFrame');
    
    if (videoPlaceholder && playButton && videoFrame) {
        playButton.addEventListener('click', () => {
            videoPlaceholder.style.display = 'none';
            videoFrame.style.display = 'block';
            
            // Start playing the video
            videoFrame.src += '&autoplay=1';
        });
    }
    
    // Video Tabs
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Map Controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const fullscreenBtn = document.getElementById('fullscreen');
    const mapFrame = document.querySelector('.map-frame iframe');
    
    // These would typically interact with a map API like Google Maps
    // For demo purposes, we'll just log the actions
    if (zoomInBtn && zoomOutBtn && fullscreenBtn) {
        zoomInBtn.addEventListener('click', () => {
            console.log('Zoom in clicked');
            // In a real implementation, you would call the map API to zoom in
        });
        
        zoomOutBtn.addEventListener('click', () => {
            console.log('Zoom out clicked');
            // In a real implementation, you would call the map API to zoom out
        });
        
        fullscreenBtn.addEventListener('click', () => {
            console.log('Fullscreen clicked');
            // In a real implementation, you would toggle fullscreen mode
            
            // Simple toggle for demo purposes
            if (mapFrame.style.position !== 'fixed') {
                mapFrame.style.position = 'fixed';
                mapFrame.style.top = '0';
                mapFrame.style.left = '0';
                mapFrame.style.width = '100%';
                mapFrame.style.height = '100%';
                mapFrame.style.zIndex = '2000';
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                mapFrame.style.position = '';
                mapFrame.style.top = '';
                mapFrame.style.left = '';
                mapFrame.style.width = '100%';
                mapFrame.style.height = '100%';
                mapFrame.style.zIndex = '';
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.overview-image, .overview-content, .price-card, .plan-item');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
});


document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Pricing Tabs
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingContents = document.querySelectorAll('.pricing-tab-content');
    
    pricingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Price Breakup Modal
    const priceDetailBtns = document.querySelectorAll('.price-detail-btn');
    const priceModal = document.getElementById('priceModal');
    const closePriceModal = document.querySelector('.close-price-modal');
    const modalFloorTitle = document.querySelector('.modal-floor-title');
    
    // Floor details mapping
    const floorDetails = {
        'lower': {
            title: 'Lower Ground Floor - 300 Sq.ft.',
            basicCost: '₹ 65,00,000',
            gst: '₹ 11,70,000',
            powerBackup: '₹ 75,000',
            maintenance: '₹ 50,000',
            legal: '₹ 25,000',
            total: '₹ 78,20,000'
        },
        'upper': {
            title: 'Upper Ground Floor - 300 Sq.ft.',
            basicCost: '₹ 72,00,000',
            gst: '₹ 12,96,000',
            powerBackup: '₹ 75,000',
            maintenance: '₹ 50,000',
            legal: '₹ 25,000',
            total: '₹ 86,46,000'
        },
        'first': {
            title: 'First Floor - 280 Sq.ft.',
            basicCost: '₹ 53,20,000',
            gst: '₹ 9,57,600',
            powerBackup: '₹ 75,000',
            maintenance: '₹ 50,000',
            legal: '₹ 25,000',
            total: '₹ 64,27,600'
        },
        'second': {
            title: 'Second Floor - 280 Sq.ft.',
            basicCost: '₹ 47,60,000',
            gst: '₹ 8,56,800',
            powerBackup: '₹ 75,000',
            maintenance: '₹ 50,000',
            legal: '₹ 25,000',
            total: '₹ 57,66,800'
        },
        'third': {
            title: 'Third Floor (Food Court) - 300 Sq.ft.',
            basicCost: '₹ 51,00,000',
            gst: '₹ 9,18,000',
            powerBackup: '₹ 75,000',
            maintenance: '₹ 50,000',
            legal: '₹ 25,000',
            total: '₹ 61,68,000'
        }
    };
    
    // Open modal with floor details
    priceDetailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const floor = btn.getAttribute('data-floor');
            const details = floorDetails[floor];
            
            // Update modal content
            modalFloorTitle.textContent = details.title;
            
            // Update price details
            document.querySelector('.detail-row:nth-child(1) .detail-value').textContent = details.basicCost;
            document.querySelector('.detail-row:nth-child(2) .detail-value').textContent = details.gst;
            document.querySelector('.detail-row:nth-child(3) .detail-value').textContent = details.powerBackup;
            document.querySelector('.detail-row:nth-child(4) .detail-value').textContent = details.maintenance;
            document.querySelector('.detail-row:nth-child(5) .detail-value').textContent = details.legal;
            document.querySelector('.detail-row.total .detail-value').textContent = details.total;
            
            // Update payment schedule
            const total = details.total.replace('₹ ', '').replace(',', '').replace(',', '').replace(',', '');
            const booking = parseInt(total) * 0.1;
            const agreement = parseInt(total) * 0.4;
            const structure = parseInt(total) * 0.25;
            const possession = parseInt(total) * 0.25;
            
            document.querySelector('.schedule-row:nth-child(1) .schedule-amount').textContent = '₹ ' + booking.toLocaleString('en-IN');
            document.querySelector('.schedule-row:nth-child(2) .schedule-amount').textContent = '₹ ' + agreement.toLocaleString('en-IN');
            document.querySelector('.schedule-row:nth-child(3) .schedule-amount').textContent = '₹ ' + structure.toLocaleString('en-IN');
            document.querySelector('.schedule-row:nth-child(4) .schedule-amount').textContent = '₹ ' + possession.toLocaleString('en-IN');
            
            // Show modal
            priceModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closePriceModal.addEventListener('click', () => {
        priceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    priceModal.addEventListener('click', (e) => {
        if (e.target === priceModal) {
            priceModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Download price list button
    const downloadPriceBtn = document.querySelector('.download-price-btn');
    if (downloadPriceBtn) {
        downloadPriceBtn.addEventListener('click', () => {
            alert('Price list download initiated. This would typically download a PDF file.');
        });
    }
    
    // Schedule visit button
    const scheduleVisitBtn = document.querySelector('.schedule-visit-btn');
    if (scheduleVisitBtn) {
        scheduleVisitBtn.addEventListener('click', () => {
            // Open tour modal
            if (tourModal) {
                tourModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Download brochure button
    const downloadBrochureBtn = document.querySelector('.download-brochure-btn');
    if (downloadBrochureBtn) {
        downloadBrochureBtn.addEventListener('click', () => {
            alert('Brochure download initiated. This would typically download a PDF file.');
        });
    }
    
    // Modal enquire button
    const modalEnquireBtn = document.querySelector('.modal-enquire-btn');
    if (modalEnquireBtn) {
        modalEnquireBtn.addEventListener('click', () => {
            // Close price modal
            priceModal.style.display = 'none';
            
            // Open lead form
            if (leadForm) {
                leadForm.classList.add('active');
                if (toggleFormBtn) {
                    toggleFormBtn.classList.add('active');
                }
            }
            
            document.body.style.overflow = 'auto';
        });
    }
    
    // Modal download button
    const modalDownloadBtn = document.querySelector('.modal-download-btn');
    if (modalDownloadBtn) {
        modalDownloadBtn.addEventListener('click', () => {
            alert('Detailed price breakup download initiated. This would typically download a PDF file.');
        });
    }

    // Rest of your existing code...
});