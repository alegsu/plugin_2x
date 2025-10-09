# Fixed Price Discount Type Implementation

## Summary
This implementation adds first-class backend support for the 'fixed_price' discount type in both BXGY (Buy X Get Y) and BXGX (Buy X Get X) rules across multiple application modes (Cheapest/Highest product in cart and general BOGO calculations).

## Changes Made

### 1. Admin Views
Added 'Fixed price' option to discount type dropdowns so the option persists after page reload:

- **File**: `woo-discount-rules-pro/App/Views/Admin/Discounts/buy-x-get-y-range.php`
  - Added `<option value="fixed_price">` to the discount type select element
  
- **File**: `woo-discount-rules-pro/App/Views/Admin/Discounts/buy-x-get-x-range.php`
  - Added `<option value="fixed_price">` to the discount type select element

### 2. Backend Calculation Logic - Cheapest.php
Updated three key methods to handle 'fixed_price' discount type:

- **File**: `woo-discount-rules-pro/App/Rules/Cheapest.php`

#### Method: `calculateDiscountPriceFromRuleRange()`
- Added handling for `fixed_price` type
- Calculates discount by converting fixed price to discount amount using existing flat discount helper

#### Method: `getDiscountValueFromRule()`
- Added handling for `fixed_price` type
- Converts the fixed price value using `CoreMethodCheck::getConvertedFixedPrice()`
- Calculates discount as: `discount_value = price - fixed_price`
- Ensures discount is never negative

#### Method: `calculateDiscountPricePerQuantity()`
- Added handling for `fixed_price` type
- Calculates per-product discount amount based on fixed price
- Ensures discount is never negative

### 3. Backend Calculation Logic - BOGO.php
Updated two key methods to handle 'fixed_price' discount type:

- **File**: `woo-discount-rules-pro/App/Rules/BOGO.php`

#### Method: `calculateDiscountPriceFromRuleRange()`
- Added handling for `fixed_price` type
- Follows same logic as Cheapest.php

#### Method: `getDiscountValueFromRule()`
- Added handling for `fixed_price` type
- Follows same logic as Cheapest.php

## How Fixed Price Works

The 'fixed_price' discount type sets the discounted item to a specific price rather than applying a percentage or flat discount.

### Calculation Logic:
1. **Input**: Original item price and fixed price value from rule
2. **Process**: `discount_amount = original_price - fixed_price`
3. **Safety**: If result is negative, discount is set to 0
4. **Application**: Uses existing flat discount calculation method with the computed discount amount

### Example:
- Rule: Buy 2-3, Get 1 at fixed price of $1.00
- Cart has 3 items at $10 each
- Cheapest item gets: `discount = $10 - $1 = $9` discount per piece
- Final price for cheapest item: $1.00

## Integration Points

The 'fixed_price' type integrates seamlessly with existing discount calculation flow:

1. **Admin UI**: New option in dropdown persists through save/reload
2. **JavaScript Handler**: Existing JS in `admin_script.js` already handles 'fixed_price' case
3. **Backend Calculation**: Uses same calculation methods as 'flat' discount
4. **Reusable Logic**: Leverages `getDiscountPriceForProductFromQuantityBasedFlatDiscount()` helper

## Files Modified
1. `woo-discount-rules-pro/App/Views/Admin/Discounts/buy-x-get-y-range.php`
2. `woo-discount-rules-pro/App/Views/Admin/Discounts/buy-x-get-x-range.php`
3. `woo-discount-rules-pro/App/Rules/Cheapest.php`
4. `woo-discount-rules-pro/App/Rules/BOGO.php`

## Affected Rule Types
- Buy X Get Y (BXGY) - All modes
- Buy X Get X (BXGX) - All modes
- Cheapest/Highest product application modes

## Testing Recommendations

### Manual Testing Scenario:
1. Create a BXGY rule with:
   - Type: Buy X Get Y – All
   - Mode: Cheapest
   - Range: Buy 2–3, Get 1
   - Discount type: Fixed price
   - Value: 1.00
   
2. Add 3 items to cart with different prices
3. Verify the cheapest item is discounted to $1.00
4. Check cart totals reflect the discount
5. Save and reload the rule to ensure 'Fixed price' option persists

### Edge Cases to Test:
- Fixed price = 0 (should make item free)
- Fixed price > item price (discount should be 0)
- Multiple items with same price
- Recursive quantity ranges
- Different currency conversions
