# AETHER WebGPU Troubleshooting

## Requirements

- **iOS 26+** with **Safari 26+** — WebGPU is NOT available on earlier versions
- **Secure context** — HTTPS or localhost required
- **Standalone Safari** — not an in-app browser or WebView

## Common Issues

### "navigator.gpu is undefined" on iPhone

**Cause:** Most likely you are using HTTP (not HTTPS), or your iOS/Safari version is too old.

**Fix:**
1. Update to iOS 26+ and Safari 26+
2. Serve over HTTPS (see Local Development below)
3. Open the URL in standalone Safari, not from within another app

### WebGPU works on desktop but not on iPhone

**Cause:** iOS Safari requires a secure context (HTTPS) for WebGPU. Desktop browsers are more lenient with `http://` on `localhost`.

**Fix:** See "Local Development over LAN" below.

### "requestAdapter() returned null"

**Cause:** The browser recognizes the WebGPU API but cannot obtain a GPU adapter. This can happen because:
- The page is not a secure context
- Hardware acceleration is disabled
- Battery saver mode is active
- The device has no compatible GPU

**Fix:**
1. Ensure you are using HTTPS
2. Check Settings → Safari → Advanced → ensure WebGPU feature flags are enabled
3. Disable Low Power Mode
4. Close other GPU-intensive tabs

### "requestDevice() failed"

**Cause:** A GPU adapter was found but the browser could not create a logical device. This can happen due to:
- Driver issues
- Too many concurrent GPU tabs
- Resource exhaustion

**Fix:** Close other tabs with heavy GPU usage. Restart Safari.

### Page loads but shows blank / nothing renders

**Cause:** Likely running inside an in-app browser (Facebook, Instagram, Twitter, WeChat, etc.) that does not support WebGPU.

**Fix:** Copy the URL and paste it directly into the Safari address bar. Do not open it from within another app.

### "In-app browser / WebView detected"

**Cause:** The URL was opened from a link in another app. In-app browsers on iOS do not have WebGPU access.

**Fix:** Open the URL directly in Safari:
1. Copy the URL
2. Open Safari
3. Paste into the address bar
4. Navigate

## Local Development over LAN

WebGPU requires a secure context. When accessing your development server from an iPhone over LAN, plain HTTP (`http://192.168.x.x:5173`) is NOT a secure context on iOS.

### Option 1: Self-Signed HTTPS (Recommended)

Generate a self-signed certificate and serve with Vite HTTPS:

```bash
# Generate certificate (one-time)
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes \
  -subj "/CN=192.168.100.79"

# Update vite.config.ts to use https
# server: { https: { key: readFileSync('key.pem'), cert: readFileSync('cert.pem') } }
```

On first visit, Safari will show a security warning. Tap "Advanced" → "Proceed to 192.168.100.79 (unsafe)" to continue.

### Option 2: Use localhost on Desktop

For desktop testing, `http://localhost:5173` IS a secure context and WebGPU will work.

### Option 3: `vite-plugin-mkcert`

For automated local HTTPS:

```bash
npm install -D vite-plugin-mkcert
```

```ts
// vite.config.ts
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [mkcert()],
  server: { host: '0.0.0.0', port: 5173 }
});
```

This automatically generates and trusts a local CA certificate.

## WebGPU Feature Detection Cases

The AETHER diagnostic system identifies the exact cause:

| Case | Status | Meaning |
|---|---|---|
| A | UNAVAILABLE | `navigator.gpu` does not exist — browser lacks WebGPU |
| B | BLOCKED | `requestAdapter()` failed — no GPU adapter available |
| C | BLOCKED | `requestDevice()` failed — driver or resource issue |
| D | READY | WebGPU is fully functional |
| E | BLOCKED | Not a secure context — needs HTTPS |
| F | UNAVAILABLE | Browser/OS version too old — needs Safari 26+ / iOS 26+ |
| G | BLOCKED | In-app browser or WebView — use standalone Safari |

## Verifying WebGPU in Safari

1. Open Safari on your iPhone
2. Navigate to the AETHER WebGPU app
3. Go to the **WebGPU Diag** tab
4. The diagnostic will automatically run and show:
   - **WEBGPU READY** — you're good
   - **WEBGPU BLOCKED** — see the diagnosis for the specific cause
   - **WEBGPU UNAVAILABLE** — browser/OS needs updating

You can tap **Copy Diagnostics** to get a full text report for debugging.

## Safari Feature Flags

In some cases, WebGPU may need to be explicitly enabled:

1. Open Settings → Safari → Advanced → Feature Flags
2. Look for "WebGPU" and ensure it is enabled
3. Restart Safari

## Browser Support Matrix

| Browser | Platform | Minimum Version |
|---|---|---|
| Safari | iOS | 26+ (iOS 26+) |
| Safari | macOS | 18+ (macOS 14+) |
| Chrome | Desktop | 113+ |
| Edge | Desktop | 113+ |
| Firefox | Desktop | 141+ |

**Important:** On iOS, only Safari supports WebGPU natively. Chrome, Edge, and other browsers on iOS use WebKit under the hood and do NOT expose WebGPU.

## Getting Help

If the diagnostic shows a case you cannot resolve:
1. Copy the full diagnostic report using the Copy button
2. Include your iPhone model, iOS version, and Safari version
3. Note whether you are using HTTP or HTTPS
