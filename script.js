document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animation Setup using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before the element fully enters viewport
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed to only animate once
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Hide Navigation Header on Scroll Down, Show on Scroll Up
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });

    // 3. Smooth scrolling for internal anchor links (already covered by CSS, 
    // but JS can enhance it if needed, or handle offset for the fixed header)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Scroll accounting for header height (approx 80px)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Security Verification Challenge for Connect Button
    const connectBtn = document.getElementById('connect-btn');
    const connectModal = document.getElementById('connect-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const challengeForm = document.getElementById('connect-challenge-form');
    const challengeAnswer = document.getElementById('challenge-answer');
    const modalError = document.getElementById('modal-error');

    // Valid acceptable answers (case-insensitive)
    const validAnswers = ['san diego', 'sandiego', 'san diego, ca', 'san diego, california'];

    if (connectBtn && connectModal) {
        connectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            connectModal.classList.add('active');
            modalError.style.display = 'none';
            challengeAnswer.value = '';
            setTimeout(() => challengeAnswer.focus(), 100);
        });

        const closeModal = () => {
            connectModal.classList.remove('active');
        };

        closeModalBtn.addEventListener('click', closeModal);

        connectModal.addEventListener('click', (e) => {
            if (e.target === connectModal) {
                closeModal();
            }
        });

        challengeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userAnswer = challengeAnswer.value.trim().toLowerCase();

            if (validAnswers.includes(userAnswer)) {
                modalError.style.display = 'none';
                closeModal();
                // Trigger email link on correct answer
                window.location.href = 'mailto:davidshaharah@gmail.com';
            } else {
                modalError.style.display = 'block';
                challengeAnswer.value = '';
                challengeAnswer.focus();
            }
        });
    }

    // 5. Custom Gold Follower Cursor (Desktop)
    const customCursor = document.getElementById('custom-cursor');
    if (customCursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
            customCursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
        });
    }

    // 6. Download CV Modal
    const downloadCvBtn = document.getElementById('download-cv-btn');
    const cvModal = document.getElementById('cv-modal');
    const closeCvModalBtn = document.getElementById('close-cv-modal');

    if (downloadCvBtn && cvModal) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cvModal.classList.add('active');
        });

        if (closeCvModalBtn) {
            closeCvModalBtn.addEventListener('click', () => {
                cvModal.classList.remove('active');
            });
        }

        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.classList.remove('active');
            }
        });
    }

    // 7. Operational Impact & ROI Calculator Sliders
    const empSlider = document.getElementById('emp-slider');
    const invSlider = document.getElementById('inv-slider');
    const empVal = document.getElementById('emp-val');
    const invVal = document.getElementById('inv-val');
    const metricHours = document.getElementById('metric-hours');
    const metricSpeed = document.getElementById('metric-speed');

    if (empSlider && invSlider) {
        const updateROI = () => {
            const emp = parseInt(empSlider.value, 10);
            const inv = parseInt(invSlider.value, 10);

            if (empVal) empVal.textContent = emp;
            if (invVal) invVal.textContent = inv;

            // Calculation formulas
            const hoursSaved = Math.round(emp * 0.25 + inv * 0.08);
            const speedIndex = Math.min(99.9, (98.5 + (inv / 300)).toFixed(1));

            if (metricHours) metricHours.textContent = `${hoursSaved} hrs`;
            if (metricSpeed) metricSpeed.textContent = `${speedIndex}%`;
        };

        ['input', 'change', 'pointermove', 'touchmove'].forEach(evt => {
            empSlider.addEventListener(evt, updateROI);
            invSlider.addEventListener(evt, updateROI);
        });
        updateROI(); // Initial calculation
    }

    // 8. Testimonials Carousel (Auto-Rotating with Progress Line)
    const testCards = document.querySelectorAll('.testimonial-card');
    const prevTestBtn = document.getElementById('prev-test');
    const nextTestBtn = document.getElementById('next-test');
    const progressFill = document.getElementById('test-progress-fill');
    let currentTestIndex = 0;
    let autoRotateInterval = null;

    if (testCards.length > 0 && prevTestBtn && nextTestBtn) {
        const showTestimonial = (index) => {
            testCards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
            resetProgressBar();
        };

        const resetProgressBar = () => {
            if (!progressFill) return;
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
            // Force reflow to reset CSS transition
            void progressFill.offsetWidth;
            progressFill.style.transition = 'width 5s linear';
            progressFill.style.width = '100%';
        };

        const nextSlide = () => {
            currentTestIndex = (currentTestIndex + 1) % testCards.length;
            showTestimonial(currentTestIndex);
        };

        const prevSlide = () => {
            currentTestIndex = (currentTestIndex - 1 + testCards.length) % testCards.length;
            showTestimonial(currentTestIndex);
        };

        const startAutoRotate = () => {
            stopAutoRotate();
            resetProgressBar();
            autoRotateInterval = setInterval(nextSlide, 5000); // 5 second timer
        };

        const stopAutoRotate = () => {
            if (autoRotateInterval) clearInterval(autoRotateInterval);
        };

        prevTestBtn.addEventListener('click', () => {
            prevSlide();
            startAutoRotate();
        });

        nextTestBtn.addEventListener('click', () => {
            nextSlide();
            startAutoRotate();
        });

        // Start auto-rotation on page load
        startAutoRotate();
    }

    // 9. Vertical Section Progress Line & Active Dot Highlight
    const vScrollFill = document.getElementById('vertical-scroll-fill');
    const vNavItems = document.querySelectorAll('.v-nav-item');
    const sections = document.querySelectorAll('section[id]');
    const sectionList = Array.from(sections);

    const updateVerticalScroll = () => {
        // Highlight closest active section in gold
        const viewportCenter = window.scrollY + (window.innerHeight / 2);
        let closestIndex = 0;
        let minDistance = Infinity;

        sectionList.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = window.scrollY + rect.top + (rect.height / 2);
            const distance = Math.abs(viewportCenter - sectionCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        vNavItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === closestIndex);
        });
    };

    window.addEventListener('scroll', updateVerticalScroll);
    updateVerticalScroll();

    // 10. Section Jump Mode with Vertical Progress Fill (10-second Interval)
    const autoToggleBtn = document.getElementById('auto-scroll-toggle');
    
    let currentSectionIndex = 0;
    let progressAnimFrame = null;
    let isAutoJumpActive = true;
    let startTime = null;
    const intervalDuration = 10000; // 10 seconds per section

    let isProgrammaticScrolling = false;

    const scrollToSectionIndex = (index) => {
        currentSectionIndex = index % sectionList.length;
        const targetSection = sectionList[currentSectionIndex];
        if (targetSection) {
            isProgrammaticScrolling = true;
            vNavItems.forEach((item, idx) => {
                item.classList.toggle('active', idx === currentSectionIndex);
            });
            const headerOffset = 70;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
            setTimeout(() => {
                isProgrammaticScrolling = false;
            }, 1000);
        }
    };

    const animateVerticalProgress = (timestamp) => {
        if (!isAutoJumpActive || sectionList.length <= 1) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const totalSegments = sectionList.length - 1; // 6 segments between 7 dots
        const segmentProgress = Math.min(1, elapsed / intervalDuration);

        // Fill line segment-by-segment between current dot and next dot over 10s
        const currentSegment = currentSectionIndex % sectionList.length;
        const totalProgressPercent = Math.min(100, ((currentSegment + segmentProgress) / totalSegments) * 100);

        if (vScrollFill) {
            vScrollFill.style.height = `${totalProgressPercent}%`;
        }

        // Dynamically fill approaching dot as line travels toward it
        const nextIndex = (currentSegment + 1) % sectionList.length;
        const fillPercent = Math.round(segmentProgress * 100);

        vNavItems.forEach((item, idx) => {
            const dot = item.querySelector('.v-dot');
            if (!dot) return;
            if (idx === currentSegment) {
                dot.style.setProperty('--dot-fill', '100%');
                dot.style.borderColor = 'var(--accent-gold)';
            } else if (idx === nextIndex) {
                dot.style.setProperty('--dot-fill', `${fillPercent}%`);
                if (segmentProgress >= 0.85) {
                    dot.style.borderColor = 'var(--accent-gold)';
                } else {
                    dot.style.borderColor = 'var(--border-color)';
                }
            } else {
                dot.style.setProperty('--dot-fill', '0%');
                dot.style.borderColor = 'var(--border-color)';
            }
        });

        if (elapsed >= intervalDuration) {
            startTime = timestamp;
            if (nextIndex === 0) {
                if (vScrollFill) vScrollFill.style.height = '0%';
            }
            scrollToSectionIndex(nextIndex);
        }

        progressAnimFrame = requestAnimationFrame(animateVerticalProgress);
    };

    const startAutoJumpMode = () => {
        stopAutoJumpMode();
        isAutoJumpActive = true;
        startTime = null;
        if (autoToggleBtn) {
            autoToggleBtn.textContent = 'AUTO: ON';
            autoToggleBtn.style.borderColor = 'var(--accent-gold)';
            autoToggleBtn.style.color = 'var(--accent-gold)';
        }
        progressAnimFrame = requestAnimationFrame(animateVerticalProgress);
    };

    const stopAutoJumpMode = () => {
        isAutoJumpActive = false;
        if (progressAnimFrame) cancelAnimationFrame(progressAnimFrame);
        if (autoToggleBtn) {
            autoToggleBtn.textContent = 'AUTO: OFF';
            autoToggleBtn.style.borderColor = 'var(--border-color)';
            autoToggleBtn.style.color = 'var(--text-secondary)';
        }
    };

    if (autoToggleBtn) {
        autoToggleBtn.addEventListener('click', () => {
            if (isAutoJumpActive) {
                stopAutoJumpMode();
            } else {
                startAutoJumpMode();
            }
        });
    }

    // Stop auto presentation on manual user scroll/touch/keydown until turned back ON via button click
    const handleManualScroll = () => {
        if (!isProgrammaticScrolling && isAutoJumpActive) {
            stopAutoJumpMode();
        }
    };

    window.addEventListener('wheel', handleManualScroll, { passive: true });
    window.addEventListener('touchstart', handleManualScroll, { passive: true });
    window.addEventListener('keydown', (e) => {
        if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) {
            handleManualScroll();
        }
    }, { passive: true });

    // Start Auto Jump & Vertical Progress on load
    startAutoJumpMode();
});
