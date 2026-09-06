// AETHER — WebGPU Diagnostics
// Complete detection of WebGPU availability with root-cause identification
//
// Cases:
//   A — navigator.gpu does not exist
//   B — navigator.gpu exists but requestAdapter() fails
//   C — requestAdapter() succeeds but requestDevice() fails
//   D — WebGPU works
//   E — blocked because page is not a secure context
//   F — browser/OS version below required WebGPU baseline
//   G — running inside an embedded/in-app browser or WebView

export type WebGPUCase = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'UNKNOWN';

export interface WebGPUDiagnostic {
  case: WebGPUCase;
  ready: boolean;
  statusLabel: 'WEBGPU READY' | 'WEBGPU BLOCKED' | 'WEBGPU UNAVAILABLE';
  reason: string;
  recommendation: string;
  environment: {
    url: string;
    protocol: string;
    hostname: string;
    isSecureContext: boolean;
    userAgent: string;
    platform: string;
    isIOS: boolean;
    isSafari: boolean;
    isWebView: boolean;
    isStandalone: boolean;
    browserName: string;
    browserVersion: string;
    osName: string;
    osVersion: string;
  };
  gpu: {
    navigatorGpuExists: boolean;
    adapterName: string;
    adapterVendor: string;
    adapterDevice: string;
    adapterError: string | null;
    deviceError: string | null;
    features: string[];
    limits: Record<string, number> | null;
    isFallbackAdapter: boolean;
  };
}

function parseUserAgent(ua: string) {
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let osName = 'Unknown';
  let osVersion = 'Unknown';

  // iOS version
  const iosMatch = ua.match(/OS (\d+)_(\d+)/);
  if (iosMatch) {
    osName = 'iOS';
    osVersion = `${iosMatch[1]}.${iosMatch[2]}`;
  }

  // macOS version
  const macMatch = ua.match(/Mac OS X (\d+)[_.](\d+)/);
  if (macMatch) {
    osName = 'macOS';
    osVersion = `${macMatch[1]}.${macMatch[2]}`;
  }

  // Windows
  if (ua.includes('Windows')) {
    osName = 'Windows';
    const winMatch = ua.match(/Windows NT (\d+\.\d+)/);
    if (winMatch) osVersion = winMatch[1];
  }

  // Android
  if (ua.includes('Android')) {
    osName = 'Android';
    const andMatch = ua.match(/Android (\d+[\.\d]*)/);
    if (andMatch) osVersion = andMatch[1];
  }

  // Safari (must check before Chrome since Chrome UA also contains "Safari")
  const isSafari = ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Chromium');
  if (isSafari) {
    browserName = 'Safari';
    const safariMatch = ua.match(/Version\/(\d+[\.\d]*)/);
    if (safariMatch) browserVersion = safariMatch[1];
  }

  // Chrome
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browserName = 'Chrome';
    const chromeMatch = ua.match(/Chrome\/(\d+[\.\d]*)/);
    if (chromeMatch) browserVersion = chromeMatch[1];
  }

  // Edge
  if (ua.includes('Edg/')) {
    browserName = 'Edge';
    const edgeMatch = ua.match(/Edg\/(\d+[\.\d]*)/);
    if (edgeMatch) browserVersion = edgeMatch[1];
  }

  // Firefox
  if (ua.includes('Firefox')) {
    browserName = 'Firefox';
    const ffMatch = ua.match(/Firefox\/(\d+[\.\d]*)/);
    if (ffMatch) browserVersion = ffMatch[1];
  }

  return { browserName, browserVersion, osName, osVersion };
}

function detectWebView(ua: string): boolean {
  // Common WebView indicators
  if (ua.includes('FBAN') || ua.includes('FBIOS')) return true; // Facebook
  if (ua.includes('Twitter')) return true;
  if (ua.includes('Instagram')) return true;
  if (ua.includes('Line/')) return true;
  if (ua.includes('WeChat')) return true;
  if (ua.includes('MicroMessenger')) return true;
  if (ua.includes('CocoaPods')) return true;
  // Generic WebView: contains "wv" after Android version
  if (ua.includes('wv)')) return true;
  // Electron
  if (ua.includes('Electron')) return true;
  // WebUI on Android
  if (ua.includes('; wv)')) return true;
  return false;
}

function detectSafari(ua: string): boolean {
  return ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Chromium');
}

export async function runWebGPUDiagnostics(): Promise<WebGPUDiagnostic> {
  const ua = navigator.userAgent;
  const parsed = parseUserAgent(ua);
  const isIOS = parsed.osName === 'iOS';
  const isSafari = detectSafari(ua);
  const isWebView = detectWebView(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

  const env: WebGPUDiagnostic['environment'] = {
    url: window.location.href,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    isSecureContext: window.isSecureContext,
    userAgent: ua,
    platform: navigator.platform,
    isIOS,
    isSafari,
    isWebView,
    isStandalone,
    browserName: parsed.browserName,
    browserVersion: parsed.browserVersion,
    osName: parsed.osName,
    osVersion: parsed.osVersion,
  };

  const gpu: WebGPUDiagnostic['gpu'] = {
    navigatorGpuExists: !!navigator.gpu,
    adapterName: '',
    adapterVendor: '',
    adapterDevice: '',
    adapterError: null,
    deviceError: null,
    features: [],
    limits: null,
    isFallbackAdapter: false,
  };

  // ── CASE G: In-app browser / WebView ──
  if (isWebView) {
    return {
      case: 'G',
      ready: false,
      statusLabel: 'WEBGPU BLOCKED',
      reason: 'Running inside an in-app browser or WebView. WebGPU is typically not available in embedded browsers.',
      recommendation: 'Open this URL in the standalone Safari app. Do not open it from within another app (Facebook, Instagram, Twitter, WeChat, etc.).',
      environment: env,
      gpu,
    };
  }

  // ── CASE E: Not a secure context ──
  if (!window.isSecureContext) {
    return {
      case: 'E',
      ready: false,
      statusLabel: 'WEBGPU BLOCKED',
      reason: `Page is not a secure context. Protocol: ${window.location.protocol}. WebGPU requires HTTPS or localhost.`,
      recommendation: isIOS
        ? 'For local development, use a self-signed HTTPS certificate or expose via a tunnel. iOS Safari does not grant WebGPU to plain HTTP pages, even on local networks.'
        : 'Serve over HTTPS or use localhost. Plain HTTP pages do not have WebGPU access.',
      environment: env,
      gpu,
    };
  }

  // ── CASE A: navigator.gpu does not exist ──
  if (!navigator.gpu) {
    // Try to determine why
    let reason = 'navigator.gpu is undefined. WebGPU API is not exposed.';
    let recommendation = '';

    if (isIOS) {
      const majorVersion = parseInt(parsed.osVersion.split('.')[0], 10);
      if (majorVersion < 26) {
        reason = `iOS ${parsed.osVersion} detected. WebGPU on iOS requires Safari 26+ / iOS 26+. Your OS version is too old.`;
        recommendation = 'Update to iOS 26 or later. WebGPU is not available on earlier iOS versions.';
        return {
          case: 'F', ready: false, statusLabel: 'WEBGPU UNAVAILABLE',
          reason, recommendation, environment: env, gpu,
        };
      }
      if (parsed.browserName !== 'Safari') {
        reason = `Running ${parsed.browserName} on iOS ${parsed.osVersion}. WebGPU on iOS is only supported in Safari, not in other browsers' WebViews.`;
        recommendation = 'Open this URL in the standalone Safari app, not in Chrome, Edge, or in-app browsers.';
        return {
          case: 'F', ready: false, statusLabel: 'WEBGPU BLOCKED',
          reason, recommendation, environment: env, gpu,
        };
      }
    }

    if (parsed.osName === 'macOS') {
      const majorVersion = parseInt(parsed.osVersion.split('.')[0], 10);
      if (majorVersion < 14) {
        reason = `macOS ${parsed.osVersion} detected. WebGPU on macOS requires Safari 18+ / macOS 14+. Your OS version may be too old.`;
        recommendation = 'Update to macOS 14 (Sonoma) or later with Safari 18+.';
        return {
          case: 'F', ready: false, statusLabel: 'WEBGPU UNAVAILABLE',
          reason, recommendation, environment: env, gpu,
        };
      }
    }

    recommendation = 'Use a browser that supports WebGPU: Safari 26+ on iOS 26+, Chrome 113+ on desktop, Edge 113+, or Firefox 141+.';
    return {
      case: 'A', ready: false, statusLabel: 'WEBGPU UNAVAILABLE',
      reason, recommendation, environment: env, gpu,
    };
  }

  // ── CASE B: requestAdapter() fails ──
  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) {
      gpu.adapterError = 'requestAdapter() returned null';

      let reason = 'navigator.gpu exists but requestAdapter() returned null. No GPU adapter is available.';
      let recommendation = '';

      if (isIOS) {
        const majorVersion = parseInt(parsed.osVersion.split('.')[0], 10);
        if (majorVersion >= 26) {
          reason = `iOS ${parsed.osVersion} with Safari ${parsed.browserVersion} detected. requestAdapter() returned null. This may be a temporary hardware issue or WebGPU may need to be enabled in Safari settings.`;
          recommendation = 'Try: Settings → Safari → Advanced → Feature Flags → Ensure WebGPU is enabled. Also try restarting Safari.';
        }
      } else if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
        reason = 'requestAdapter() returned null. This can happen on insecure HTTP pages that are not localhost.';
        recommendation = 'Serve the page over HTTPS. Some browsers deny GPU adapter access on non-secure origins.';
      } else {
        recommendation = 'Check that hardware acceleration is enabled in your browser settings. On mobile, ensure battery saver mode is off.';
      }

      return {
        case: 'B', ready: false, statusLabel: 'WEBGPU BLOCKED',
        reason, recommendation, environment: env, gpu,
      };
    }

    // ── Adapter obtained — collect info ──
    gpu.adapterName = (adapter as any).name ?? 'Unknown GPU';
    gpu.adapterVendor = (adapter as any).vendor ?? 'Unknown';
    gpu.adapterDevice = (adapter as any).device ?? 'Unknown';
    gpu.isFallbackAdapter = (adapter as any).isFallbackAdapter ?? false;

    const featuresArr: string[] = [];
    for (const f of adapter.features) {
      featuresArr.push(f.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    }
    gpu.features = featuresArr;

    const lim = adapter.limits;
    gpu.limits = {
      maxBufferSize: lim.maxBufferSize,
      maxTextureDimension1D: lim.maxTextureDimension1D,
      maxTextureDimension2D: lim.maxTextureDimension2D,
      maxTextureDimension3D: lim.maxTextureDimension3D,
      maxComputeWorkgroupStorageSize: lim.maxComputeWorkgroupStorageSize,
      maxComputeInvocationsPerWorkgroup: lim.maxComputeInvocationsPerWorkgroup,
      maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize,
      maxUniformBufferBindingSize: lim.maxUniformBufferBindingSize,
      maxComputeWorkgroupSizeX: lim.maxComputeWorkgroupSizeX,
      maxComputeWorkgroupSizeY: lim.maxComputeWorkgroupSizeY,
      maxComputeWorkgroupSizeZ: lim.maxComputeWorkgroupSizeZ,
      maxComputeWorkgroupsPerDimension: lim.maxComputeWorkgroupsPerDimension,
      maxColorAttachments: lim.maxColorAttachments,
      minStorageBufferOffsetAlignment: lim.minStorageBufferOffsetAlignment,
      minUniformBufferOffsetAlignment: lim.minUniformBufferOffsetAlignment,
    };

    // ── CASE C: requestDevice() fails ──
    try {
      const device = await adapter.requestDevice({ requiredLimits: {} });
      device.destroy();
    } catch (e) {
      gpu.deviceError = (e as Error).message;
      return {
        case: 'C', ready: false, statusLabel: 'WEBGPU BLOCKED',
        reason: `Adapter found (${gpu.adapterName}) but requestDevice() failed: ${(e as Error).message}`,
        recommendation: 'The GPU adapter was found but could not create a logical device. This may indicate a driver issue or resource exhaustion. Try closing other GPU-intensive tabs.',
        environment: env, gpu,
      };
    }

    // ── CASE D: WebGPU works ──
    return {
      case: 'D', ready: true, statusLabel: 'WEBGPU READY',
      reason: `WebGPU is fully functional. Adapter: ${gpu.adapterName}.`,
      recommendation: 'No action needed.',
      environment: env, gpu,
    };

  } catch (e) {
    gpu.adapterError = (e as Error).message;
    return {
      case: 'B', ready: false, statusLabel: 'WEBGPU BLOCKED',
      reason: `requestAdapter() threw an error: ${(e as Error).message}`,
      recommendation: 'An unexpected error occurred while requesting a GPU adapter. This may indicate a browser or driver issue.',
      environment: env, gpu,
    };
  }
}

export function formatDiagnosticReport(d: WebGPUDiagnostic): string {
  const lines: string[] = [];
  lines.push('═══ AETHER WEBGPU DIAGNOSTIC REPORT ═══');
  lines.push('');
  lines.push(`STATUS: ${d.statusLabel}`);
  lines.push(`CASE: ${d.case}`);
  lines.push(`REASON: ${d.reason}`);
  lines.push(`RECOMMENDATION: ${d.recommendation}`);
  lines.push('');
  lines.push('── ENVIRONMENT ──');
  lines.push(`  URL: ${d.environment.url}`);
  lines.push(`  Protocol: ${d.environment.protocol}`);
  lines.push(`  Hostname: ${d.environment.hostname}`);
  lines.push(`  Secure Context: ${d.environment.isSecureContext}`);
  lines.push(`  iOS: ${d.environment.isIOS}`);
  lines.push(`  Safari: ${d.environment.isSafari}`);
  lines.push(`  WebView: ${d.environment.isWebView}`);
  lines.push(`  Standalone PWA: ${d.environment.isStandalone}`);
  lines.push(`  Browser: ${d.environment.browserName} ${d.environment.browserVersion}`);
  lines.push(`  OS: ${d.environment.osName} ${d.environment.osVersion}`);
  lines.push(`  Platform: ${d.environment.platform}`);
  lines.push(`  User Agent: ${d.environment.userAgent}`);
  lines.push('');
  lines.push('── WEBGPU ──');
  lines.push(`  navigator.gpu exists: ${d.gpu.navigatorGpuExists}`);
  if (d.gpu.adapterName) lines.push(`  Adapter: ${d.gpu.adapterName}`);
  if (d.gpu.adapterVendor) lines.push(`  Vendor: ${d.gpu.adapterVendor}`);
  if (d.gpu.adapterDevice) lines.push(`  Device: ${d.gpu.adapterDevice}`);
  if (d.gpu.adapterError) lines.push(`  Adapter Error: ${d.gpu.adapterError}`);
  if (d.gpu.deviceError) lines.push(`  Device Error: ${d.gpu.deviceError}`);
  lines.push(`  Fallback adapter: ${d.gpu.isFallbackAdapter}`);
  if (d.gpu.features.length > 0) {
    lines.push(`  Features (${d.gpu.features.length}):`);
    for (const f of d.gpu.features) lines.push(`    ${f}`);
  }
  if (d.gpu.limits) {
    lines.push('  Limits:');
    for (const [k, v] of Object.entries(d.gpu.limits)) {
      lines.push(`    ${k}: ${typeof v === 'number' ? v.toLocaleString() : v}`);
    }
  }
  lines.push('');
  lines.push(`Timestamp: ${new Date().toISOString()}`);
  return lines.join('\n');
}
