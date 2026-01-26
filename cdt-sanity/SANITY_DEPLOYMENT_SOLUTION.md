# Sanity Deployment Solution Guide

## Current Issue Analysis

The Sanity deployment is failing with the error:
```
Error: Forbidden - User is missing required grant sanity.project.deployStudio to perform this operation
```

This indicates a **permissions issue**, not an authentication issue. The user can log in successfully but lacks the necessary deployment permissions.

## Root Cause

1. **Authentication works**: The SANITY_AUTH_TOKEN is valid and allows basic operations
2. **Authorization fails**: The token/user lacks the `sanity.project.deployStudio` permission
3. **Project ID**: sbvvl9vs (CDT project)
4. **Dataset**: production

## Solutions

### Option 1: Get Proper Permissions (Recommended)

1. **Go to Sanity Management Console**:
   👉 [https://www.sanity.io/manage/project/sbvvl9vs](https://www.sanity.io/manage/project/sbvvl9vs)

2. **Navigate to**:
   - Project Settings → API → Tokens

3. **Create a new token with deploy permissions**:
   ```bash
   # Create a new token with deployStudio permission
   npx sanity tokens create --project sbvvl9vs --name "Deployment Token" --ability deployStudio
   ```

4. **Update your .env.local file**:
   ```env
   SANITY_AUTH_TOKEN=your_new_token_with_deploy_permissions
   ```

### Option 2: Use Existing Admin Token

If you have access to an existing admin token:
1. Replace the current SANITY_AUTH_TOKEN in .env.local
2. Run deployment again

### Option 3: Ask Project Administrator

Contact the project administrator to:
1. Grant your user account the deployStudio permission, OR
2. Provide you with a token that has deployStudio permissions

## Verification Commands

Once you have the proper token, verify it works:

```bash
# Check current user/project info
cd cdt-sanity
SANITY_AUTH_TOKEN=your_token_here npx sanity projects list

# Test deployment
SANITY_AUTH_TOKEN=your_token_here npx sanity deploy
```

## Alternative Deployment Methods

If you still can't get deploy permissions:

### Method 1: Use Sanity CLI with different approach
```bash
cd cdt-sanity
npx sanity install
npx sanity build
# Then manually upload the built files
```

### Method 2: Use Sanity API directly
```javascript
// Use the Sanity client to deploy schema programmatically
const sanityClient = require('@sanity/client');
const client = sanityClient({
  projectId: 'sbvvl9vs',
  dataset: 'production',
  token: 'your_token_here',
  useCdn: false
});

// Implement schema deployment logic
```

## Troubleshooting

1. **Token format**: Ensure token is complete (no line breaks)
2. **Project ID**: Verify it's `sbvvl9vs`
3. **Dataset**: Should be `production`
4. **CLI version**: Update Sanity CLI: `npm update -g @sanity/cli`

## Files Configuration

Your configuration files are correctly set up:

- ✅ `.env` - Contains project configuration
- ✅ `.env.local` - Contains auth token
- ✅ `cdt-sanity/sanity.config.js` - Proper project setup

## Next Steps

1. **Obtain proper permissions** (most important)
2. **Update the token** in .env.local
3. **Run deployment**: `cd cdt-sanity && npx sanity deploy`
4. **Verify**: Check deployment status in Sanity Studio

---

**Need help?** Contact Sanity support or your project administrator for assistance with permissions.
