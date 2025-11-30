# QianlunShop Bug Fixes - TODO List

## Fix #1: Correct Promo Code Calculation in Order Placement
- [x] Analyze current grand total calculation in CheckoutManager.placeOrder()
- [x] Fix discount application: discount should reduce subtotal before tax calculation
- [x] Update placeOrder() totals calculation to apply discount to subtotal first, then calculate tax on discounted amount

## Fix #2: Implement Auto-Apply Free Shipping Logic
- [x] Analyze current shipping selection logic in CheckoutManager.setupEventListeners()
- [x] Add method to auto-update shipping selection when cart total changes
- [x] Modify calculateTotals() to check and auto-select free shipping when eligible
- [x] Ensure shipping options update dynamically with cart changes

## Fix #3: Improve Cart Update Race Condition Handling
- [x] Analyze current update() method in Cart class with 3-second lock timeout
- [x] Implement update queue to serialize rapid update operations
- [x] Add better lock management with exponential backoff and queue processing
- [x] Prevent concurrent updates that could cause race conditions

## Testing & Verification
- [ ] Test promo code application in checkout flow
- [ ] Verify free shipping auto-application
- [ ] Test rapid quantity updates for race conditions
- [ ] Run checkout flow end-to-end to ensure all calculations are correct

## Summary
All three critical bugs have been fixed:
1. ✅ Promo code calculation now applies discount to subtotal before tax calculation
2. ✅ Free shipping auto-applies when cart total meets threshold and updates dynamically
3. ✅ Cart updates now use queue-based processing to prevent race conditions from rapid clicks
