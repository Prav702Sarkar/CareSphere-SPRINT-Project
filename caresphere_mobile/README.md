# 🌸 CareSphere Mobile — Android & Flutter App

**CareSphere Mobile** is a cross-platform Flutter application for Women's Wellness, Menstrual Cycle Tracking, PCOS/PCOD Education, and UTI Awareness.

---

## 🚀 Quick Start in Android Studio

### 1. Open in Android Studio
1. Launch **Android Studio**.
2. Click **Open** (or `File > Open...`).
3. Navigate to and select the folder:
   ```
   g:\Shoolini university\college projects build\UTI Sprint Project\caresphere_mobile
   ```
4. Allow Android Studio to sync the Gradle build and Flutter plugins.

### 2. Build Android APK
- **Via Android Studio Menu**:
  * Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
  * Once built, click **locate** to find `app-debug.apk` or `app-release.apk`.
- **Via Terminal**:
  ```bash
  cd caresphere_mobile
  flutter build apk --release
  ```

---

## 🔑 Pre-Configured API Integrations

All live keys are already integrated into [`lib/core/constants/api_constants.dart`](lib/core/constants/api_constants.dart):

* **Supabase Cloud Backend**:
  * URL: `https://bngrfrictoapkkwondak.supabase.co`
  * Relational Database, Row Level Security, Profiles, Health Profiles, Cycle Logs, and Loved Ones tables.
* **Groq Cloud AI**:
  * Model: `llama-3.3-70b-versatile`
  * 24/7 AI Health Companion with clinical safety prompt guardrails and non-diagnostic fallback protections.
* **Partner Connection Code System**:
  * 6-character connection codes (`CARE-XXXX`) with 1-click clipboard copying and live health records sharing.

---

## 📱 Mobile Architecture

```
caresphere_mobile/
├── android/                   # Android native project & Gradle config
│   ├── app/
│   │   ├── build.gradle.kts   # Android SDK compileSdk, Java 17, minSdk 21
│   │   └── src/main/
│   │       └── AndroidManifest.xml # INTERNET & network permissions
├── lib/
│   ├── core/
│   │   ├── constants/         # API endpoints & Supabase/Groq keys
│   │   ├── theme/             # Material 3 CareSphere Theme & Google Fonts
│   │   └── services/          # Groq AIService & SupabaseService
│   ├── features/
│   │   ├── splash/            # Animated splash screen & auto-role router
│   │   ├── role_selection/    # Women's vs Boys' portal selector
│   │   ├── woman/             # Women's health home, cycle tracker & hydration
│   │   ├── man/               # Boys' UTI prevention & partner viewer
│   │   ├── ai_chat/           # 24/7 AI Health Companion chat screen
│   │   └── partner/           # Loved Ones code generator & connection modal
│   └── main.dart              # Supabase initialization & app entry point
└── pubspec.yaml               # Flutter dependencies (Supabase, Google Fonts, HTTP)
```
