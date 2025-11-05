// =========================
// ♿ ACCESSIBILITY ENHANCER - ARIA, Keyboard Navigation & Screen Reader Support
// Comprehensive accessibility improvements
// =========================

export class AccessibilityEnhancer {
  constructor() {
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.currentFocusIndex = -1;
    this.focusableItems = [];
    this.isEnhanced = false;
    this.init();
  }

  // =========================
  // 🚀 INITIALIZE ACCESSIBILITY FEATURES
  // =========================

  init() {
    this.enhanceKeyboardNavigation();
    this.enhanceARIA();
    this.enhanceFocusManagement();
    this.enhanceScreenReaderSupport();
    this.addSkipLinks();
    this.enhanceFormAccessibility();
    this.enhanceImageAccessibility();

    // Listen for dynamic content changes
    this.observeDynamicContent();

    this.isEnhanced = true;
    console.log('♿ Accessibility enhancements initialized');
  }

  // =========================
  // ⌨️ KEYBOARD NAVIGATION
  // =========================

  enhanceKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Tab navigation
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }

      // Escape key handling
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }

      // Arrow key navigation for custom components
      if (e.key.startsWith('Arrow')) {
        this.handleArrowNavigation(e);
      }

      // Enter/Space for custom buttons
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivationKeys(e);
      }
    });

    // Focus trap for modals
    this.setupFocusTraps();
  }

  handleTabNavigation(e) {
    // Update focusable elements list
    this.updateFocusableElements();

    if (this.focusableItems.length === 0) return;

    const currentIndex = this.getCurrentFocusIndex();

    if (e.shiftKey) {
      // Shift+Tab: move backward
      e.preventDefault();
      const newIndex = currentIndex <= 0 ? this.focusableItems.length - 1 : currentIndex - 1;
      this.focusElement(this.focusableItems[newIndex]);
    } else {
      // Tab: move forward
      if (currentIndex >= this.focusableItems.length - 1) {
        e.preventDefault();
        this.focusElement(this.focusableItems[0]);
      }
    }
  }

  handleEscapeKey(e) {
    // Close modals, dropdowns, etc.
    const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
    if (activeModal) {
      this.closeModal(activeModal);
      e.preventDefault();
      return;
    }

    // Close dropdowns
    const activeDropdown = document.querySelector('[aria-expanded="true"]');
    if (activeDropdown) {
      this.closeDropdown(activeDropdown);
      e.preventDefault();
      return;
    }
  }

  closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    // Return focus to the element that opened the modal
    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
    if (trigger) {
      trigger.focus();
    }
  }

  closeDropdown(dropdown) {
    dropdown.setAttribute('aria-expanded', 'false');
    const menu = dropdown.nextElementSibling;
    if (menu) {
      menu.setAttribute('aria-hidden', 'true');
    }
  }

  handleArrowNavigation(e) {
    const target = e.target;

    // Custom select dropdowns
    if (target.hasAttribute('role') && target.getAttribute('role') === 'listbox') {
      this.handleListboxNavigation(e, target);
    }

    // Menu navigation
    if (target.closest('[role="menu"]')) {
      this.handleMenuNavigation(e, target);
    }
  }

  handleListboxNavigation(e, listbox) {
    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    if (options.length === 0) return;

    const currentIndex = options.findIndex(option => option.getAttribute('aria-selected') === 'true');
    let newIndex = currentIndex;

    if (e.key === 'ArrowDown') {
      newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'ArrowUp') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    }

    if (newIndex !== currentIndex) {
      e.preventDefault();
      options.forEach((option, index) => {
        option.setAttribute('aria-selected', index === newIndex ? 'true' : 'false');
      });
      options[newIndex].focus();
    }
  }

  handleMenuNavigation(e, menuItem) {
    const menu = menuItem.closest('[role="menu"]');
    const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
    if (items.length === 0) return;

    const currentIndex = items.indexOf(menuItem);
    let newIndex = currentIndex;

    if (e.key === 'ArrowDown') {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'ArrowUp') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    }

    if (newIndex !== currentIndex) {
      e.preventDefault();
      items[newIndex].focus();
    }
  }

  handleActivationKeys(e) {
    const target = e.target;

    // Custom buttons
    if (target.hasAttribute('role') && target.getAttribute('role') === 'button') {
      e.preventDefault();
      target.click();
    }
  }

  // =========================
  // 🎯 FOCUS MANAGEMENT
  // =========================

  enhanceFocusManagement() {
    // Focus visible styles
    document.addEventListener('focusin', (e) => {
      this.handleFocusIn(e.target);
    });

    document.addEventListener('focusout', (e) => {
      this.handleFocusOut(e.target);
    });

    // Skip to main content
    this.addSkipLinks();
  }

  // =========================
  // 🎣 FOCUS TRAPS
  // =========================

  setupFocusTraps() {
    // Focus trap for modals and dialogs
    const modals = document.querySelectorAll('[role="dialog"], .modal, .popup');
    modals.forEach(modal => {
      this.setupFocusTrap(modal);
    });
  }

  setupFocusTrap(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Store the event listener for cleanup
    container._focusTrapHandler = handleTabKey;
  }

  handleFocusIn(element) {
    element.classList.add('focus-visible');

    // Announce to screen readers
    if (element.hasAttribute('aria-label')) {
      this.announceToScreenReader(element.getAttribute('aria-label'));
    }
  }

  handleFocusOut(element) {
    element.classList.remove('focus-visible');
  }

  focusElement(element) {
    if (element && typeof element.focus === 'function') {
      element.focus();
      this.scrollIntoViewIfNeeded(element);
    }
  }

  scrollIntoViewIfNeeded(element) {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isVisible) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // =========================
  // 🏷️ ARIA ENHANCEMENTS
  // =========================

  enhanceARIA() {
    // Add missing ARIA labels
    this.addARIAToImages();
    this.addARIAToButtons();
    this.addARIAToLinks();
    this.addARIAToForms();

    // Dynamic ARIA updates
    this.setupDynamicARIA();
  }

  setupDynamicARIA() {
    // Setup dynamic ARIA for elements that change state
    this.setupLiveRegions();
  }

  setupLiveRegions() {
    // Already handled in enhanceScreenReaderSupport
  }

  addARIAToImages() {
    const images = document.querySelectorAll('img:not([alt]):not([aria-label])');
    images.forEach(img => {
      const alt = img.getAttribute('alt') || this.generateImageAlt(img);
      img.setAttribute('alt', alt);
    });
  }

  addARIAToButtons() {
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      if (!button.textContent.trim() && !button.querySelector('img, svg, .icon')) {
        const label = this.generateButtonLabel(button);
        button.setAttribute('aria-label', label);
      }
    });
  }

  addARIAToLinks() {
    const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
    links.forEach(link => {
      if (!link.textContent.trim() && !link.querySelector('img, svg, .icon')) {
        const label = this.generateLinkLabel(link);
        link.setAttribute('aria-label', label);
      }
    });
  }

  addARIAToForms() {
    // Add labels to form inputs
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      if (!input.getAttribute('aria-label')) {
        const label = this.findAssociatedLabel(input) || this.generateInputLabel(input);
        if (label) {
          input.setAttribute('aria-label', label);
        }
      }
    });

    // Add fieldsets and legends where appropriate
    this.addFieldsetsToRadioGroups();
  }

  addFieldsetsToRadioGroups() {
    // Group radio buttons with the same name into fieldsets
    const radioGroups = {};

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      const name = radio.name;
      if (!name) return;

      if (!radioGroups[name]) {
        radioGroups[name] = [];
      }
      radioGroups[name].push(radio);
    });

    Object.keys(radioGroups).forEach(name => {
      const radios = radioGroups[name];
      if (radios.length > 1) {
        // Check if already wrapped in fieldset
        const existingFieldset = radios[0].closest('fieldset');
        if (!existingFieldset) {
          // Create fieldset wrapper
          const fieldset = document.createElement('fieldset');
          const legend = document.createElement('legend');

          // Find common parent
          const parent = radios[0].parentElement;
          const isGrouped = radios.every(r => r.parentElement === parent);

          if (isGrouped) {
            // Wrap all radios in fieldset
            parent.insertBefore(fieldset, radios[0]);
            radios.forEach(radio => {
              fieldset.appendChild(radio);
            });

            // Add legend if there's a label
            const label = parent.querySelector(`label[for="${radios[0].id}"]`);
            if (label) {
              legend.textContent = label.textContent;
              fieldset.insertBefore(legend, fieldset.firstChild);
              label.remove();
            }
          }
        }
      }
    });
  }

  // =========================
  // 🔊 SCREEN READER SUPPORT
  // =========================

  enhanceScreenReaderSupport() {
    // Live regions for dynamic content
    this.addLiveRegions();

    // Status announcements
    this.setupStatusAnnouncements();

    // Error announcements
    this.setupErrorAnnouncements();
  }

  setupStatusAnnouncements() {
    // Setup status announcements for dynamic content updates
    // This is handled by live regions
  }

  setupErrorAnnouncements() {
    // Setup error announcements for form validation
    // This is handled by form validation
  }

  addLiveRegions() {
    // Add live region for cart updates
    if (!document.querySelector('[aria-live="polite"][data-cart-status]')) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('data-cart-status', '');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Add live region for form errors
    if (!document.querySelector('[aria-live="assertive"][data-form-errors]')) {
      const errorRegion = document.createElement('div');
      errorRegion.setAttribute('aria-live', 'assertive');
      errorRegion.setAttribute('aria-atomic', 'true');
      errorRegion.setAttribute('data-form-errors', '');
      errorRegion.className = 'sr-only';
      document.body.appendChild(errorRegion);
    }
  }

  announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.querySelector(`[aria-live="${priority}"]`);
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  // =========================
  // ⏭️ SKIP LINKS
  // =========================

  addSkipLinks() {
    if (document.querySelector('.skip-links')) return;

    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    `;

    document.body.insertBefore(skipLinks, document.body.firstChild);

    // Add IDs to target elements
    const mainContent = document.querySelector('main') || document.querySelector('.container');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.id) {
      nav.id = 'navigation';
    }

    const search = document.querySelector('input[type="search"], #searchInput');
    if (search && !search.id) {
      search.id = 'search';
    }
  }

  // =========================
  // 📝 FORM ACCESSIBILITY
  // =========================

  enhanceFormAccessibility() {
    // Add error messages to form fields
    this.addFormValidation();

    // Enhance required field indicators
    this.enhanceRequiredFields();

    // Add progress indicators for multi-step forms
    this.addFormProgress();
  }

  enhanceRequiredFields() {
    // Add visual indicators for required fields
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
      if (!input.hasAttribute('aria-required')) {
        input.setAttribute('aria-required', 'true');
      }
    });
  }

  addFormProgress() {
    // Add progress indicators for multi-step forms
    const multiStepForms = document.querySelectorAll('form[data-steps]');
    multiStepForms.forEach(form => {
      const totalSteps = parseInt(form.dataset.steps);
      const currentStep = parseInt(form.dataset.currentStep) || 1;

      if (totalSteps > 1) {
        const progressContainer = form.querySelector('.form-progress') || document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.setAttribute('role', 'progressbar');
        progressContainer.setAttribute('aria-valuenow', currentStep);
        progressContainer.setAttribute('aria-valuemax', totalSteps);
        progressContainer.setAttribute('aria-valuemin', '1');
        progressContainer.setAttribute('aria-label', `Step ${currentStep} of ${totalSteps}`);

        if (!form.contains(progressContainer)) {
          form.insertBefore(progressContainer, form.firstChild);
        }
      }
    });
  }

  addFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const invalidFields = form.querySelectorAll(':invalid');
        if (invalidFields.length > 0) {
          const errors = Array.from(invalidFields).map(field => {
            const label = this.findAssociatedLabel(field) || field.name || 'Field';
            return `${label} is required`;
          });

          this.announceToScreenReader(`Form errors: ${errors.join(', ')}`, 'assertive');
        }
      });
    });
  }

  // =========================
  // 🖼️ IMAGE ACCESSIBILITY
  // =========================

  enhanceImageAccessibility() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading states
      img.addEventListener('load', () => {
        img.setAttribute('aria-busy', 'false');
      });

      img.addEventListener('error', () => {
        img.setAttribute('aria-busy', 'false');
        this.announceToScreenReader('Image failed to load', 'assertive');
      });

      // Set initial loading state
      if (!img.complete) {
        img.setAttribute('aria-busy', 'true');
      }
    });
  }

  // =========================
  // 🔄 DYNAMIC CONTENT OBSERVER
  // =========================

  observeDynamicContent() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // New elements added
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.enhanceElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  enhanceElement(element) {
    // Apply accessibility enhancements to newly added elements
    if (element.matches('img')) {
      this.addARIAToImages();
    } else if (element.matches('button')) {
      this.addARIAToButtons();
    } else if (element.matches('a')) {
      this.addARIAToLinks();
    } else if (element.matches('input, select, textarea')) {
      this.addARIAToForms();
    }

    // Recursively enhance child elements
    element.querySelectorAll('img, button, a, input, select, textarea').forEach(child => {
      this.enhanceElement(child);
    });
  }

  // =========================
  // 🛠️ UTILITY METHODS
  // =========================

  updateFocusableElements() {
    this.focusableItems = Array.from(document.querySelectorAll(this.focusableElements))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }

  getCurrentFocusIndex() {
    return this.focusableItems.indexOf(document.activeElement);
  }

  findAssociatedLabel(input) {
    // Check for label with 'for' attribute
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent.trim();

    // Check for wrapping label
    const wrapper = input.closest('label');
    if (wrapper) return wrapper.textContent.trim();

    return null;
  }

  generateImageAlt(img) {
    const src = img.src || img.dataset.src || '';
    const filename = src.split('/').pop().split('.')[0];
    return filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  generateButtonLabel(button) {
    const icon = button.querySelector('.icon, svg, img');
    if (icon) {
      return icon.getAttribute('alt') || icon.getAttribute('aria-label') || 'Button';
    }
    return 'Button';
  }

  generateLinkLabel(link) {
    const icon = link.querySelector('.icon, svg, img');
    if (icon) {
      return icon.getAttribute('alt') || icon.getAttribute('aria-label') || 'Link';
    }
    return 'Link';
  }

  generateInputLabel(input) {
    const name = input.name || input.id || input.placeholder;
    if (name) {
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
    }
    return 'Input field';
  }

  // =========================
  // 📊 GET ACCESSIBILITY STATUS
  // =========================

  getAccessibilityStatus() {
    return {
      skipLinks: document.querySelectorAll('.skip-link').length,
      ariaLabels: document.querySelectorAll('[aria-label]').length,
      focusableElements: this.focusableItems.length,
      imagesWithAlt: document.querySelectorAll('img[alt]').length,
      totalImages: document.querySelectorAll('img').length,
      forms: document.querySelectorAll('form').length,
      liveRegions: document.querySelectorAll('[aria-live]').length
    };
  }

  // =========================
  // 🧹 CLEANUP
  // =========================

  destroy() {
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyboardNavigation);
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('focusout', this.handleFocusOut);

    // Remove skip links
    const skipLinks = document.querySelector('.skip-links');
    if (skipLinks) {
      skipLinks.remove();
    }

    console.log('♿ AccessibilityEnhancer destroyed');
  }
}

// =========================
// 🌐 SINGLETON INSTANCE
// =========================

export const accessibilityEnhancer = new AccessibilityEnhancer();
export default AccessibilityEnhancer;
