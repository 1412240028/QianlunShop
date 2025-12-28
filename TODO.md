# QianlunShop Improvement Plan

## High Priority 🔴
- [ ] Create IndexedDB storage module (js/indexed-db.js)
- [ ] Update config.js with centralized ASSETS config
- [ ] Update config.js Utils to use IndexedDB instead of localStorage
- [ ] Update cart.js to use IndexedDB for cart storage
- [ ] Update error-handler.js to use IndexedDB and add window.onerror boundary
- [ ] Update products.js to use centralized ASSETS paths
- [ ] Update sw.js to use centralized ASSETS paths

## Medium Priority 🟡
- [ ] Refactor mobile menu in script-final.js into MobileMenu class with destroy() method
- [ ] Call initLazyLoading() in script-final.js
- [ ] Add window.onerror boundary in error-handler.js (already partially done)

## Low Priority 🟢
- [ ] Create webpack.config.js for code splitting and bundle optimization
- [ ] Implement detailed analytics tracking
- [ ] Add virtual scrolling for product lists

## Testing & Verification
- [ ] Test IndexedDB functionality across browsers
- [ ] Verify lazy loading works on products page
- [ ] Test mobile menu cleanup on page navigation
- [ ] Monitor bundle size improvements
