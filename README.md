# capacitor-app-maps-bug-report
This is for minimal reproduction bug of code.

# Procedure
1. Replace `YOUR_API_KEY` at `src/environment/environment.prod.ts`, `src/environment/environment.ts`, and `android/app/src/main/AndroidManifest.xml`.
2. Run `npm install` for the first time.
3. Run `ionic capacitor build android` for compiling the program.
4. At Android Studio, click Play for runnning it.
