// tests/example.spec.ts
import { test, expect, type Page } from '@playwright/test';

interface ProxyRuleConfig {
    method: string;
    pathOperator: string;
    path: string;
    targetEndpoint: string;
    description: string;
}

// Configuration for Animechan API
const ANIMECHAN_CONFIG: ProxyRuleConfig = {
    method: 'GET',
    pathOperator: 'EM',
    path: '/quote',
    targetEndpoint: 'https://animechan.io/api/v1/quotes/random',
    description: 'Anime Quotes Proxy'
};

class ProxyRuleAutomation {
    private readonly page: Page;
    private readonly config: ProxyRuleConfig;

    constructor(page: Page, config: ProxyRuleConfig) {
        this.page = page;
        this.config = config;
    }

    async navigateToEndpoint() {
        try {
            await this.page.goto('https://app.beeceptor.com/console/internbeeceptor');
            await this.page.waitForSelector('.navbar-brand', { timeout: 10000 });
            console.log('✓ Navigated to endpoint');
        } catch (error) {
            console.error('Navigation failed:', error);
            throw error;
        }
    }

    async openMockingRules() {
        try {
            // Wait for and click the Mocking Rules button
            await this.page.waitForTimeout(1000);
            const mockingRulesButton = await this.page.locator('a:has-text("Mocking Rules")').first();
            await expect(mockingRulesButton).toBeVisible({ timeout: 5000 });
            await mockingRulesButton.click();
            
            // Wait for modal
            await this.page.waitForSelector('.modal.fade.allRules.in', { timeout: 5000 });
            console.log('✓ Opened mocking rules');
        } catch (error) {
            console.error('Failed to open mocking rules:', error);
            throw error;
        }
    }

    async clickCreateProxy() {
        try {
            // Click Additional Rule Types
            const additionalRulesButton = await this.page.locator('button:text("Additional Rule Types")');
            await expect(additionalRulesButton).toBeVisible({ timeout: 5000 });
            await additionalRulesButton.click();

            // Wait a bit for the dropdown
            await this.page.waitForTimeout(500);

            // Click Create Proxy or Callout
            const createProxyButton = await this.page.locator('a:text("Create Proxy or Callout")');
            await expect(createProxyButton).toBeVisible({ timeout: 5000 });
            await createProxyButton.click();

            // Wait for form
            await this.page.waitForSelector('#oneTransform', { timeout: 5000 });
            console.log('✓ Opened proxy creation form');
        } catch (error) {
            console.error('Failed to create proxy:', error);
            throw error;
        }
    }

    async configureRequestMatching() {
        try {
            const form = this.page.locator('#oneTransform');
            await this.page.waitForTimeout(500);

            // Set HTTP Method
            await form.locator('select[name="matchMethod"]').first().selectOption(this.config.method);
            
            // Set Path Operator
            await form.locator('#pathOperator').selectOption(this.config.pathOperator);
            
            // Set Path
            await form.locator('#matchPath').fill(this.config.path);

            // Verify selections
            await expect(form.locator('select[name="matchMethod"]').first()).toHaveValue(this.config.method);
            await expect(form.locator('#pathOperator')).toHaveValue(this.config.pathOperator);
            await expect(form.locator('#matchPath')).toHaveValue(this.config.path);
            
            console.log('✓ Configured request matching');
        } catch (error) {
            console.error('Failed to configure request matching:', error);
            throw error;
        }
    }

    async configureResponseBehavior() {
        try {
            const form = this.page.locator('#oneTransform');
            
            // Select wait for response
            await form.locator('select[name="behavior"]').selectOption('wait');
            
            // Wait for form update
            await this.page.waitForTimeout(500);

            // Verify selection
            await expect(form.locator('select[name="behavior"]')).toHaveValue('wait');
            console.log('✓ Configured response behavior');
        } catch (error) {
            console.error('Failed to configure response behavior:', error);
            throw error;
        }
    }

    async configureHttpCallout() {
        try {
            const form = this.page.locator('#oneTransform');
            
            // Set target method
            await form.locator('select[name="matchMethodProxy"]').selectOption(this.config.method);

            // Set target endpoint
            await form.locator('#targetEndpoint').fill(this.config.targetEndpoint);

            // Configure payload
            await form.locator('select[name="tranform"]').selectOption('no-transform');

            // Set delays
            await form.locator('#proxyMinDelay').fill('0');
            await form.locator('#proxyMaxDelay').fill('1');

            // Verify configurations
            await expect(form.locator('select[name="matchMethodProxy"]')).toHaveValue(this.config.method);
            await expect(form.locator('#targetEndpoint')).toHaveValue(this.config.targetEndpoint);
            await expect(form.locator('select[name="tranform"]')).toHaveValue('no-transform');
            
            console.log('✓ Configured HTTP callout');
        } catch (error) {
            console.error('Failed to configure HTTP callout:', error);
            throw error;
        }
    }

    async addDescription() {
        try {
            const form = this.page.locator('#oneTransform');
            await form.locator('#ruleDescription').fill(this.config.description);
            await expect(form.locator('#ruleDescription')).toHaveValue(this.config.description);
            console.log('✓ Added description');
        } catch (error) {
            console.error('Failed to add description:', error);
            throw error;
        }
    }

    async saveProxyRule() {
        try {
            // Wait for any previous animations
            await this.page.waitForTimeout(1000);

            // Find and click save button
            const saveButton = this.page.locator('#oneTransform button:has-text("Save Proxy")');
            await expect(saveButton).toBeEnabled();
            await saveButton.click();

            // Wait for save to complete
            await this.page.waitForTimeout(2000);

            // Wait for modal to close
            await this.page.waitForSelector('#oneTransform', { 
                state: 'hidden',
                timeout: 10000 
            });

            // Additional wait for stability
            await this.page.waitForTimeout(1000);
            console.log('✓ Saved proxy rule');
        } catch (error) {
            console.error('Failed to save proxy rule:', error);
            throw error;
        }
    }

    async verifyRuleCreation() {
        try {
            // Wait for UI to stabilize
            await this.page.waitForTimeout(2000);

            // Wait for any previous modal to be gone
            await this.page.waitForSelector('.modal.fade.allRules.in', { 
                state: 'detached', 
                timeout: 5000 
            }).catch(() => {}); // Ignore if element doesn't exist

            // Click mocking rules with force
            await this.page.click('a:has-text("Mocking Rules")', { 
                force: true,
                timeout: 5000 
            });

            // Wait for modal
            await this.page.waitForSelector('.modal.fade.allRules.in', { timeout: 5000 });
            await this.page.waitForTimeout(1000);

            // Find and verify rule
            const ruleRow = await this.page.locator(`.rule-row:has-text("${this.config.description}")`, {
                hasText: this.config.path
            });
            
            await expect(ruleRow).toBeVisible({ timeout: 5000 });
            await expect(ruleRow.locator(`:text("${this.config.method}")`)).toBeVisible();
            await expect(ruleRow.locator(`code:has-text("${this.config.path}")`)).toBeVisible();

            // Verify enabled state
            const ruleToggle = await ruleRow.locator('input[type="checkbox"]');
            await expect(ruleToggle).toBeChecked();

            console.log('✓ Verified rule creation');
        } catch (error) {
            console.error('Failed to verify rule creation:', error);
            throw error;
        }
    }

    async execute() {
        await this.navigateToEndpoint();
        await this.openMockingRules();
        await this.clickCreateProxy();
        await this.configureRequestMatching();
        await this.configureResponseBehavior();
        await this.configureHttpCallout();
        await this.addDescription();
        await this.saveProxyRule();
    }
}

test.describe('Beeceptor Proxy Rule Configuration', () => {
    test('Create proxy rule for Animechan API', async ({ page }) => {
        // Setup error handling
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('Page error:', msg.text());
            }
        });

        page.on('pageerror', exception => {
            console.error('Page exception:', exception);
        });

        // Create and execute automation
        const automation = new ProxyRuleAutomation(page, ANIMECHAN_CONFIG);
        await automation.execute();

        console.log('\nProxy Rule Created Successfully!');
        console.log('You can now access random anime quotes at:');
        console.log('https://internbeeceptor.free.beeceptor.com/quote');
        console.log('\nTest with:');
        console.log('curl https://internbeeceptor.free.beeceptor.com/quote');
    });
});