

# Plan: Rank Perks Update + Admin Panel Fix + Editable Perks

## 1. Rank Perks Changes (Checkout.tsx + GuidedTour.tsx)

Saare ranks me ye changes honge:

- **"/Backpack" → "/pv"** (jahan bhi hai)
- **"/Fly" hata do** (saare ranks se)
- **"/Withdraw" hata do** (saare ranks se)
- GuidedTour me bhi "/fly" mention hatega
- OneBlockRanksSection me bhi "/Fly" hatega

**Example: PRO rank perks**
Before: `["/Kit", "/Fly", "/Withdraw", "2 Home Slots", "2 Auction Slots", "Priority Support"]`
After: `["/Kit", "/pv", "2 Home Slots", "2 Auction Slots", "Priority Support"]`

## 2. Admin Panel Login Fix

Admin login edge function (`admin-auth`) ko debug karenge. Current issue investigate karke fix karenge — likely session/password verification flow me koi bug hai.

## 3. Admin Panel: Editable Perks from Products

Abhi perks hardcoded hain `Checkout.tsx` me. Plan:

- Products table me ek `metadata` field already hai (jsonb) — isme `perks` array store karenge
- Admin panel me product edit form me **perks editor** add karenge — chips/tags style me perks add/remove kar sakte ho
- Checkout page ko update karenge ki wo database se perks load kare instead of hardcoded values
- Isse admin panel se koi bhi perk change kar sakta hai bina code touch kiye

### Technical Details

**Files to modify:**
- `src/pages/Checkout.tsx` — Replace hardcoded perks with dynamic from DB, replace Backpack→pv, remove Fly/Withdraw
- `src/components/GuidedTour.tsx` — Remove /fly mention
- `src/components/OneBlockRanksSection.tsx` — Remove /Fly from bonuses
- `src/components/admin/AdminProducts.tsx` — Add perks editor (tag-style input)
- `supabase/functions/admin-auth/index.ts` — Debug and fix login issue
- `src/pages/Admin.tsx` — Fix any session handling bugs

**Database:** No schema changes needed — `metadata` jsonb column already exists on products table, perks will be stored there.

