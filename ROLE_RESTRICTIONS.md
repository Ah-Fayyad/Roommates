# Role-Based Access Control (RBAC) System

## User Roles

### 1. **USER** (Tenant/Roommate Seeker)

- Looking for a room to rent
- Should be able to:
  - Browse listings ✅
  - View listing details ✅
  - Save favorites ✅
  - View smart matches ✅ (AI-powered roommate matching)
  - Send visit requests ✅
  - View sent/received visit requests ✅
  - Chat with landlords/advertisers ✅
  - View notifications ✅
  - Edit profile and preferences ✅

### 2. **LANDLORD** (Property Owner/Room Renter)

- Owns and rents out rooms
- Should be able to:
  - Browse listings (to see market) ✅
  - Create listings ✅ (restricted)
  - Manage own listings (MyListings) ✅ (restricted)
  - View/accept/decline visit requests ✅
  - View sent/received visit requests ✅ (receive from tenants)
  - Save favorites ✅
  - Chat with tenants ✅
  - View analytics/stats for listings ✅
  - Edit profile ✅
  - Should NOT have access to:
    - Smart Matching (Matches page) ❌ - This is for tenants

### 3. **ADVERTISER** (Commercial Property Manager)

- Similar to LANDLORD but might manage multiple properties
- Same permissions as LANDLORD
- Future: Might have additional features like bulk listing, advanced analytics

### 4. **ADMIN** (Administrator)

- Full platform access
- Should be able to:
  - Access admin dashboard ✅
  - Manage users ✅
  - Review listings for moderation ✅
  - Handle reports ✅
  - View analytics ✅
  - Manage content ✅
  - Ban/unban users ✅
  - Verify users ✅

## Feature-Level Restrictions

| Feature               | USER | LANDLORD | ADVERTISER | ADMIN |
| --------------------- | ---- | -------- | ---------- | ----- |
| Browse Listings       | ✅   | ✅       | ✅         | ✅    |
| View Listing Details  | ✅   | ✅       | ✅         | ✅    |
| Create Listing        | ❌   | ✅       | ✅         | ✅    |
| Manage My Listings    | ❌   | ✅       | ✅         | ✅    |
| Smart Matching        | ✅   | ❌       | ❌         | ❌    |
| Save Favorites        | ✅   | ✅       | ✅         | ❌    |
| Send Visit Request    | ✅   | ❌       | ❌         | ❌    |
| Receive Visit Request | ❌   | ✅       | ✅         | ❌    |
| View My Visits        | ✅   | ✅       | ✅         | ❌    |
| Chat                  | ✅   | ✅       | ✅         | ❌    |
| Admin Dashboard       | ❌   | ❌       | ❌         | ✅    |
| User Management       | ❌   | ❌       | ❌         | ✅    |
| Content Moderation    | ❌   | ❌       | ❌         | ✅    |
| View Reports          | ❌   | ❌       | ❌         | ✅    |

## Routes Implementation

### Frontend (React Router)

Routes use the `<ProtectedRoute>` component with `requiredRoles` prop.

```tsx
// USER-only features
<Route path="matches" element={
  <ProtectedRoute requiredRoles={["USER"]}>
    <Matches />
  </ProtectedRoute>
} />

// LANDLORD/ADVERTISER-only features
<Route path="my-listings" element={
  <ProtectedRoute requiredRoles={["LANDLORD", "ADVERTISER"]}>
    <MyListings />
  </ProtectedRoute>
} />

// Multi-role features
<Route path="favorites" element={
  <ProtectedRoute requiredRoles={["USER", "LANDLORD", "ADVERTISER"]}>
    <Favorites />
  </ProtectedRoute>
} />

// Admin-only
<Route path="/admin" element={
  <ProtectedRoute requiredRole="ADMIN">
    <AdminLayout />
  </ProtectedRoute>
} />
```

### Backend (Express Middleware)

Routes use custom authentication middleware:

```typescript
// Admin-only
router.use(authenticate, requireAdmin);

// Landlord/Advertiser-only
router.post("/", authenticate, requireLandlord, validateListing, createListing);

// All authenticated users
router.get("/", authenticate, getVisits);

// Public endpoint
router.get("/listings", getListings);
```

## Implementation Guidelines

### When Adding a New Feature:

1. Determine which roles should have access
2. Add role check in frontend routes (`ProtectedRoute`)
3. Add role check in backend routes (middleware)
4. Update this document
5. Test with each role type

### Common Patterns:

- **User-exclusive**: Matches, AI recommendations
- **Landlord-exclusive**: Create/manage listings, visit acceptance
- **Shared features**: Browse, Chat, Favorites, Settings

## Future Enhancements

1. **Role-based API endpoints**: Ensure all backend endpoints enforce role checks
2. **Dynamic permissions**: Allow role customization by admins
3. **Audit logging**: Track role-based access changes
4. **Rate limiting by role**: Different rate limits for different user types
