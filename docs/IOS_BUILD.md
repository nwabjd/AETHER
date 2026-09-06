# AETHER iOS Build Pipeline

## Overview

The iOS build runs on GitHub Actions free-tier public macOS runners. There is no Mac in local development. The HP workstation pushes code; GitHub Actions builds and signs; the artifact is deployed to the iPhone.

## Pipeline

```
HP Workstation (Windows)
  → git push to GitHub
  → GitHub Actions trigger (macOS runner)
  → Xcode build
  → Code signing
  → IPA artifact
  → Deploy to iPhone 17 Pro
```

## GitHub Actions Workflow

The workflow runs on `macos-latest` (Apple's Silicon runners, free for public repos).

### Prerequisites

1. An Apple Developer account (free tier works for personal devices).
2. A signing certificate and provisioning profile registered in the Apple Developer portal.
3. The certificate and profile stored as GitHub Actions secrets (base64-encoded).

### Required Secrets

| Secret | Description |
|---|---|
| `APPLE_CERTIFICATE` | Base64-encoded .p12 signing certificate |
| `APPLE_CERTIFICATE_PASSWORD` | Password for the .p12 file |
| `APPLE_PROVISIONING_PROFILE` | Base64-encoded .mobileprovision file |
| `APPLE_TEAM_ID` | Apple Developer Team ID |

### Workflow File

Place at `.github/workflows/build.yml`:

```yaml
name: Build AETHER Native

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: macos-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode.app

      - name: Install provisioning profile
        env:
          PROFILE: ${{ secrets.APPLE_PROVISIONING_PROFILE }}
        run: |
          mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
          echo "$PROFILE" | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/profile.mobileprovision

      - name: Install certificate
        env:
          CERT: ${{ secrets.APPLE_CERTIFICATE }}
          CERT_PASS: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
        run: |
          echo "$CERT" | base64 --decode > cert.p12
          security create-keychain -p "" build.keychain
          security default-keychain -s build.keychain
          security unlock-keychain -p "" build.keychain
          security import cert.p12 -k build.keychain -P "$CERT_PASS" -T /usr/bin/codesign
          security set-key-partition-list -S apple-tool:,apple: -s -k "" build.keychain

      - name: Build
        run: |
          xcodebuild -project AETHER.xcodeproj \
            -scheme AETHER \
            -sdk iphoneos \
            -configuration Release \
            -archivePath build/AETHER.xcarchive \
            archive

      - name: Export IPA
        run: |
          xcodebuild -exportArchive \
            -archivePath build/AETHER.xcarchive \
            -exportOptionsPlist ExportOptions.plist \
            -exportPath build/

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: AETHER-unsigned
          path: build/*.ipa
```

### ExportOptions.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
```

## Deployment to iPhone

After the workflow produces an IPA artifact:

1. Download the IPA from the GitHub Actions artifacts.
2. Install via Apple Configurator, or
3. Use `ios-deploy` / `pymobiledevice3` from the HP workstation over USB, or
4. Use TestFlight (requires App Store Connect, free for personal use).

For direct USB deployment from Windows without a Mac, `pymobiledevice3` can install IPAs:

```bash
pymobiledevice3 apps install path/to/AETHER.ipa
```

## Important Notes

- The macOS runner is used ONLY for Xcode build and signing. It is not a development environment.
- All code editing, model work, and testing happen on the HP workstation.
- The free-tier runner has time limits (~20 minutes per job). Keep builds lean.
- Do not store credentials in the repository. Use GitHub Actions secrets only.
