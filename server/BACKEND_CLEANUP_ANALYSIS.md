# Backend Cleanup Analysis

## Frontend Features vs Backend Features

### ✅ Frontend Features (What we need to support):
1. **Authentication**
   - Login ✓
   - Signup ✓
   - ResetPassword (mock in frontend, not implemented)

2. **Products**
   - List/View products ✓
   - Create product ✓
   - Update product ✓
   - Delete product ✓
   - Stock availability ✓

3. **Warehouses**
   - List/View warehouses ✓
   - Create warehouse ✓
   - Update warehouse ✓
   - Delete warehouse ✓
   - Locations (nested in warehouses) ✓

4. **Operations**
   - Receipts ✓ (backend has RECEIPT type)
   - Deliveries ✓ (backend has DELIVERY type)
   - Transfers ❌ (frontend has, backend missing TRANSFER type)
   - Adjustments ✓ (backend has ADJUSTMENT type)

5. **Move History**
   - View move history ✓

### ⚠️ Backend Features (Analysis):
1. **Auth Routes** - All needed ✓
2. **Product Routes** - All needed ✓
3. **Warehouse Routes** - All needed ✓ (including locations)
4. **Operation Routes** - Missing TRANSFER type
5. **Stock Routes** - Might be redundant (adjustments can be done via operations)
6. **Move Routes** - Needed ✓

### 🔍 Issues to Address:

1. **Missing TRANSFER Operation Type**
   - Frontend expects transfers between locations
   - Backend only has RECEIPT, DELIVERY, ADJUSTMENT
   - Solution: Add TRANSFER to operation types OR handle via ADJUSTMENT

2. **Stock Routes Redundancy**
   - `/api/stock` endpoint might be redundant
   - Stock adjustments can be done via ADJUSTMENT operations
   - Need to check if frontend uses direct stock adjustment endpoint

3. **Operation Types Mismatch**
   - Frontend has: Receipts, Deliveries, Transfers, Adjustments
   - Backend has: RECEIPT, DELIVERY, ADJUSTMENT (no TRANSFER)

### 📋 Recommended Actions:

1. ✅ **DONE**: Fix Swagger YAML syntax errors
2. **TODO**: Add TRANSFER operation type OR map frontend transfers to existing types
3. **TODO**: Verify if `/api/stock` endpoints are used by frontend
4. **TODO**: Remove any unused routes/controllers if not needed
5. **TODO**: Update Swagger documentation to include TRANSFER if added

### 🎯 Current Status:
- Swagger errors: ✅ Fixed
- Backend-Frontend alignment: ⚠️ Needs TRANSFER support
- Unused code cleanup: 🔍 In progress


