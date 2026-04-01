

# Minecraft Auto-Delivery System

## Overview
Jab koi player website se kuch buy kare aur payment verify ho jaye, toh Minecraft server pe automatically command run hoga aur item mil jayega. Ye ek **Spigot Plugin + API** system hoga.

## How It Works

```text
Player buys on website
        ↓
Admin verifies payment (Admin Panel)
        ↓
Command saved to database (e.g., "give PlayerName diamond_sword 1")
        ↓
Spigot Plugin polls API every 10 seconds
        ↓
Plugin gets pending commands → runs them in-game
        ↓
Player gets items automatically!
```

## Technical Plan

### 1. Database: `pending_commands` table
- `id`, `player_name`, `command` (Minecraft command to run), `server` (gem/lifesteal), `status` (pending/executed/failed), `product_info` (what was bought), `created_at`, `executed_at`

### 2. Edge Function: `delivery-api`
- **GET** `/delivery-api?server=gem&secret=XXX` — Plugin polls this to get pending commands
- **POST** `/delivery-api` — Plugin confirms command was executed
- Protected by a `DELIVERY_SECRET` key so only the plugin can access

### 3. Admin Panel: "Deliver" button
- When admin verifies a payment, they click "Deliver" 
- Admin enters the player's Minecraft username + selects what was bought
- System auto-generates the correct Minecraft commands (e.g., `lp user PlayerName parent set pro`, `crate give PlayerName blood-key 1`)
- Commands go into `pending_commands` table

### 4. Spigot Plugin (Java .jar file)
- A lightweight plugin that runs on your Paper/Spigot server
- Every 10 seconds, polls the API for pending commands
- Executes commands via Bukkit console
- Reports back success/failure
- I'll provide the complete Java source code + compiled instructions

### 5. Command Templates (Admin configurable)
- Admin panel me har product ke liye command template set kar sakte ho
- Example templates:
  - Rank: `lp user {player} parent set {rank_name}`
  - Key: `crate give {player} {key_name} 1`
  - Currency: `eco give {player} {amount}`
- `{player}` automatically replace hoga actual username se

## Files to Create/Edit
1. **New migration**: `pending_commands` table + `command_templates` column in products
2. **New edge function**: `supabase/functions/delivery-api/index.ts`
3. **Edit**: `supabase/functions/admin-auth/index.ts` — add delivery actions
4. **Edit**: `src/pages/Admin.tsx` — add Delivery tab
5. **New component**: `src/components/admin/AdminDelivery.tsx` — manage pending deliveries
6. **New file**: `/mnt/documents/SpicyDelivery-Plugin.java` — Spigot plugin source code
7. **Edit**: `src/components/admin/AdminProducts.tsx` — add command template field per product

## Secret Needed
- `DELIVERY_SECRET` — a random key that the plugin uses to authenticate with the API

