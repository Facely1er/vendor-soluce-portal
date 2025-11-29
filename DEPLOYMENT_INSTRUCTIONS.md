# 🚀 VendorSoluce Migration Deployment Guide

## Option 1: Supabase Dashboard (RECOMMENDED) ⭐

This is the easiest and most reliable method:

### Steps:

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/sql/new

2. **Copy the Migration:**
   - Open: `REMOVE_DUPLICATE_ASSETS_MIGRATION.sql` (this file is in the same directory)
   - Select ALL content (Ctrl+A)
   - Copy (Ctrl+C)

3. **Paste and Run:**
   - Paste into Supabase SQL Editor
   - Click "Run" button
   - Wait for completion (takes ~30 seconds)

4. **Verify Success:**
   Look for these messages in the output:
   ```
   ✅ Removed duplicate assets table from VendorSoluce
   ✅ Created properly namespaced vs_ tables
   ✅ Asset references now point to CyberSoluce (Layer 1)
   ✅ Row Level Security enabled
   ```

---

## Option 2: Command Line (If you have psql installed)

If psql doesn't work due to password issues, use Option 1 instead.

```bash
# Note: Password contains special characters, may need escaping
psql "postgresql://postgres:K1551d0ug0u@db.dfklqsdfycwjlcasfciu.supabase.co:5432/postgres" -f REMOVE_DUPLICATE_ASSETS_MIGRATION.sql
```

---

## What This Migration Does

### Removes:
- ❌ Duplicate `assets` table created by VendorSoluce
- ❌ Old `asset_vendor_relationships` table
- ❌ Old `due_diligence_requirements` table
- ❌ Old `alerts` table

### Creates:
- ✅ `vs_vendor_profiles` - Vendor management (VendorSoluce owns)
- ✅ `vs_asset_vendor_relationships` - Links to CyberSoluce assets
- ✅ `vs_vendor_assessments` - Vendor risk assessments
- ✅ `vs_due_diligence_requirements` - Due diligence tracking
- ✅ `vs_alerts` - Vendor-related alerts

### Safety:
- 📦 Automatic backup created: `_backup_vs_assets_20251129`
- 🔄 Can rollback if needed
- 🔒 Row Level Security enabled

---

## After Migration

1. **Update VendorSoluce Code:**
   ```typescript
   // Read assets from CyberSoluce (not own table)
   const { data: assets } = await supabase
     .from('assets')
     .select('*')
     .eq('user_id', userId);
   
   // Enrich with vendor data
   await supabase
     .from('assets')
     .update({
       vendorsoluce_data: {
         primaryVendor: { ... },
         supplyChainTier: 1
       }
     })
     .eq('id', assetId);
   ```

2. **Copy Shared Environment:**
   - Create: `apps/vendorsoluce/.env.local`
   - Content: See `_SHARED_ENV_TEMPLATE.md`

---

## Verification Queries

After running migration, verify with these queries:

```sql
-- 1. Check that old assets table is gone
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'assets' AND table_schema = 'public';
-- Should return 1 row (the CyberSoluce assets table)

-- 2. Check new vs_ tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'vs_%' AND table_schema = 'public';
-- Should see: vs_vendor_profiles, vs_asset_vendor_relationships, etc.

-- 3. Check backup was created
SELECT COUNT(*) FROM _backup_vs_assets_20251129;
-- Shows number of backed up records
```

---

## Troubleshooting

### "Table 'assets' does not exist"
- This is expected! The old duplicate table was removed
- Assets now come from CyberSoluce (shared database)

### "Column does not exist" errors
- Run the CyberSoluce migration first
- Polymorphic fields must exist before this migration

### "Permission denied"
- Use Supabase Dashboard method instead
- Service role required for some operations

---

**Recommended:** Use Option 1 (Supabase Dashboard) for easiest deployment! 🚀

