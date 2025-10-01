# Refer a Friend API Integration

## Overview

This document describes the complete integration of the Refer a Friend API endpoints into the PocketFiler application.

## API Endpoints Integrated

### 1. GET `/auth/referral/link`

- **Purpose**: Generate referral link for the authenticated user
- **Usage**: Fetched on component mount to display user's unique referral link
- **Response**: Returns the referral link URL

### 2. GET `/auth/referral/rewards`

- **Purpose**: Get referral rewards and referred users count
- **Usage**: Displays total referrals, pending rewards, and redeemed rewards
- **Response**: Returns rewards statistics

### 3. GET `/auth/referral/list`

- **Purpose**: Get all referrals with name and referred date
- **Usage**: Displays list of invited friends who have joined
- **Response**: Returns array of referred users with details

### 4. POST `/auth/referral/redeem`

- **Purpose**: Redeem referral points
- **Usage**: Called when user clicks "Redeem Reward" button (requires 3 friends minimum)
- **Response**: Confirms reward redemption and updates user account

## Files Created/Modified

### 1. New Files Created

#### `/src/services/redux/middleware/referral.js`

- Contains all Redux async thunks for referral API calls
- Exports: `getReferralLink`, `getReferralRewards`, `getReferralList`, `redeemReferralPoints`
- Includes proper error handling and logging

#### `/src/Components/Modals/RewardSuccess/RewardSuccess.js`

- Success modal component for reward redemption
- Features:
  - Professional centered modal with close button
  - Animated checkmark icon
  - Dynamic reward message based on API data
  - "View Plans" button to navigate to subscription page
- Fully responsive design

#### `/src/Components/Modals/RewardSuccess/RewardSuccess.css`

- Custom styling for the success modal
- Matches the application's design system
- Includes hover effects and transitions
- Mobile responsive

### 2. Modified Files

#### `/src/config/apiConfig.js`

- Added `REFERRAL` endpoints section to `API_ENDPOINTS` object
- Includes all four referral API endpoints

#### `/src/Pages/ReferFriend/ReferFriend.js`

- Fully integrated all API calls
- Added loading states and error handling
- Implements automatic data fetching on component mount
- Added redeem functionality with proper validation
- **Integrated success modal** for reward redemption instead of toast notifications
- Enhanced with accessibility features (tabindex, aria-labels)
- Displays referred date for invited friends
- Handles share cancellation gracefully without showing errors

#### `/src/Pages/ReferFriend/ReferFriend.css`

- Added styling for invited date display
- Enhanced button hover states and transitions
- Improved user experience with visual feedback

## Features Implemented

### 1. Automatic Data Loading

- On component mount, automatically fetches:
  - User's referral link
  - Referral rewards and statistics
  - List of invited friends
- Shows loading state during data fetch
- Graceful error handling with fallback referral link

### 2. Referral Link Management

- Displays user's unique referral link
- Copy to clipboard functionality
- Native share functionality (when supported)
- Fallback link generation from user ID

### 3. Rewards Display

- Shows total number of invited friends
- Progress indicator (0/6 format)
- Highlights current count in blue

### 4. Redeem Functionality

- **Conditional Display**: Button only visible when user has earned rewards (3+ referrals)
- Button enabled only when pending rewards are available
- Shows loading state during redemption
- Dynamically displays reward amounts from API (contracts & encrypted lockers)
- **Success Modal**: Shows professional modal dialog on successful redemption instead of toast
  - Checkmark icon with animation
  - Clear success message with reward details
  - "View Plans" button to navigate to subscription page
- Error toast notifications for failures
- Automatically refreshes rewards after redemption
- Prevents multiple simultaneous redemption attempts
- Referral link maintains consistent width regardless of button visibility

### 5. Invited Friends List

- Displays all friends who have joined
- Shows avatar (first letter of name/email)
- Displays name and email
- Shows join date in readable format
- Empty state message when no friends have joined

### 6. Enhanced UX

- Smooth transitions and hover effects
- Loading states for async operations
- Proper accessibility attributes
- Keyboard navigation support
- Visual feedback for all interactions

## Usage Example

```javascript
import { useDispatch } from "react-redux";
import {
  getReferralLink,
  getReferralRewards,
  getReferralList,
  redeemReferralPoints,
} from "../../services/redux/middleware/referral";

// In your component:
const dispatch = useDispatch();

// Fetch referral link
const linkResult = await dispatch(getReferralLink()).unwrap();

// Fetch rewards
const rewardsResult = await dispatch(getReferralRewards()).unwrap();

// Fetch referral list
const listResult = await dispatch(getReferralList()).unwrap();

// Redeem points
const redeemResult = await dispatch(redeemReferralPoints({})).unwrap();
```

## Error Handling

All API calls include comprehensive error handling:

- Network errors
- Authentication errors
- Invalid response handling
- User-friendly toast notifications
- Fallback mechanisms for critical features

## State Management

The component maintains the following states:

- `invitedFriends`: Array of referred users
- `referralLink`: User's unique referral link
- `rewards`: Object containing:
  - `totalReferrals`: Total number of successful referrals
  - `pendingRewards`: Number of rewards waiting to be redeemed
  - `redeemedRewards`: Number of rewards already redeemed
  - `contractsEarned`: Number of contracts per reward (default: 1)
  - `lockersEarned`: Number of encrypted lockers per reward (default: 1)
- `loading`: Boolean for initial data load
- `isRedeeming`: Boolean for redemption in progress
- `hasEarnedRewards`: Computed boolean (true when invitedCount >= 3)
- `canRedeem`: Computed boolean (true when hasEarnedRewards && pendingRewards > 0)

## Validation Rules

1. **Redeem Reward Button**:

   - **Visibility**: Only shown when user has 3+ invited friends
   - **Enabled State**: Requires both 3+ friends AND pending rewards > 0
   - Disabled during redemption process
   - Shows appropriate feedback message based on condition
   - Referral link maintains 60% width whether button is shown or hidden

2. **API Calls**:
   - All calls include authentication token
   - Proper error handling for each endpoint
   - Automatic retry not implemented (can be added if needed)

## Best Practices Followed

1. ✅ DRY Principle - No code repetition
2. ✅ Early Returns - Loading state handled early
3. ✅ Accessibility - All interactive elements have proper ARIA labels and tabindex
4. ✅ Error Handling - Comprehensive error handling with user feedback
5. ✅ Loading States - Clear indication of async operations
6. ✅ Descriptive Naming - Clear function and variable names
7. ✅ Type Safety - Proper null checking and fallbacks
8. ✅ User Feedback - Toast notifications for all actions

## Testing Recommendations

1. Test with 0 referrals (button should be hidden)
2. Test with 1-2 referrals (button should be hidden)
3. Test with 3+ referrals and pending rewards (button should be visible and enabled)
4. Test with 3+ referrals but no pending rewards (button should be visible but disabled)
5. Test copy link functionality
6. Test share link functionality (on supported devices)
7. Test redemption flow (after successful redemption, button state should update)
8. Test error scenarios (network failures, invalid responses)
9. Test loading states
10. Test with various friend list sizes (empty, 1 friend, multiple friends)
11. Verify referral link maintains consistent width with/without button
12. Test dynamic reward text with different contract and locker amounts

## Future Enhancements

Potential improvements that could be added:

1. Pull-to-refresh functionality
2. Pagination for large friend lists
3. Social media share integration
4. Referral analytics dashboard
5. Custom reward tiers
6. Email invitation functionality
7. Referral history tracking
8. Reward redemption history

## Notes

- The fallback referral link uses the user's ID from localStorage
- All API calls use the configured API interceptor with automatic token injection
- The component follows React best practices with hooks and functional components
- CSS follows the existing design system of the application
