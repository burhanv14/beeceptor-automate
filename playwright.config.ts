// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    expect: {
        timeout: 10000
    },
    fullyParallel: false,
    retries: 2,
    workers: 1,
    reporter: [
        ['html'],
        ['list']
    ],
    use: {
        // Base URL for navigation
        baseURL: 'https://app.beeceptor.com',

        // Collect trace when retrying the failed test
        trace: 'retain-on-failure',

        // Capture screenshot on failure
        screenshot: 'on',

        // Record video when retrying the failed test
        video: 'on',

        // Viewport size
        viewport: { width: 1280, height: 720 },

        // Navigation timeout
        navigationTimeout: 20000,

        // Action timeout
        actionTimeout: 15000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],

    // Directory for storing artifacts
    outputDir: 'test-results',
});