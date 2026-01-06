# Railway Deployment Troubleshooting

## Error: "Error creating build plan with Railpack"

This error typically occurs when Railway cannot detect your project structure or build configuration.

### Solution 1: Set Root Directory (MOST COMMON FIX)

1. In Railway dashboard, go to your service
2. Click on **Settings** tab
3. Scroll to **Source** section
4. Set **Root Directory** to: `backend`
5. Save and redeploy

### Solution 2: Verify nixpacks.toml exists

Ensure `backend/nixpacks.toml` exists in your repository. This file tells Railway exactly how to build your project.

### Solution 3: Check Railway Service Configuration

1. Go to your Railway service
2. Click **Settings** → **Deploy**
3. Verify:
   - **Build Command**: Should be `npm run build` (or leave empty to use nixpacks.toml)
   - **Start Command**: Should be `npm start`
   - **Root Directory**: Must be `backend`

### Solution 4: Manual Railway Configuration

If automatic detection fails:

1. In Railway service settings, go to **Variables** tab
2. Add these build settings (if not using nixpacks.toml):
   - `NIXPACKS_BUILD_CMD`: `npm run build`
   - `NIXPACKS_START_CMD`: `npm start`

### Solution 5: Check package.json

Ensure your `package.json` has:
- `"engines"` field specifying Node version
- `"build"` script that compiles TypeScript
- `"start"` script that runs the compiled code

### Verification Steps

After fixing, verify:
1. Railway can see your `package.json` in the `backend` directory
2. Build logs show `npm install` running
3. Build logs show `npm run build` (TypeScript compilation)
4. Deploy logs show `npm start` running
5. Server starts on the PORT environment variable

### Common Mistakes

- ❌ Root directory set to repository root instead of `backend`
- ❌ Missing `nixpacks.toml` or incorrect format
- ❌ TypeScript not compiling (check `tsconfig.json`)
- ❌ Missing `dist/` directory after build
- ❌ Wrong start command (should be `node dist/server.js`)

