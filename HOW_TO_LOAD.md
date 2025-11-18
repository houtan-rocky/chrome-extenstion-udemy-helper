# How to Load the Extension

## ⚠️ IMPORTANT: Always load from the `dist` folder!

The extension **MUST** be loaded from the `dist` folder after building. The `src` folder contains source files that need to be compiled.

## Steps:

1. **Build the extension first:**
   ```bash
   yarn build
   ```

2. **Open Chrome Extensions:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

3. **Load the extension:**
   - Click "Load unpacked"
   - Navigate to: `C:\Repos\chrome-extenstion-udemy-helper\dist`
   - Select the `dist` folder (NOT the root folder or src folder)

4. **Verify:**
   - The extension should appear in your extensions list
   - Click the extension icon to test the popup

## Development Workflow:

1. Make changes to files in `src/`
2. Run `yarn build` to compile
3. Reload the extension in Chrome (click the reload button on the extension card)
4. Test your changes

## Troubleshooting:

- **Error: "Failed to load module script"** → You're loading from the wrong folder. Make sure you select the `dist` folder.
- **Extension not working** → Make sure you ran `yarn build` first
- **Changes not appearing** → Reload the extension after rebuilding

