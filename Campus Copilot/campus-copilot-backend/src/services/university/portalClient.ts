import puppeteer, { Browser, Page } from 'puppeteer';

export class PortalClient {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await puppeteer.launch({
      headless: true, // run in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async authenticate(username?: string, password?: string): Promise<boolean> {
    if (!this.page) throw new Error("PortalClient not initialized");
    
    const user = username || process.env.UNIVERSITY_PORTAL_USERNAME;
    const pass = password || process.env.UNIVERSITY_PORTAL_PASSWORD;
    const baseUrl = process.env.UNIVERSITY_PORTAL_BASE_URL || 'https://dcs.gsfcuniversity.ac.in';

    if (!user || !pass) {
      throw new Error("Credentials not provided for portal authentication");
    }

    try {
      // Navigate to the portal login page
      await this.page.goto(`${baseUrl}/academic/Student-cp/Students_profile.aspx`, { waitUntil: 'networkidle2' });
      
      // Look for standard username/password selectors
      // Note: Actual selectors would be refined by manual inspection or browser_subagent
      // GSFC uses ASP.NET standard naming
      const userSelector = 'input[type="text"][name*="txtUser"], input[type="text"][id*="UserName"], input[type="text"]';
      const passSelector = 'input[type="password"][name*="txtPass"], input[type="password"][id*="Password"], input[type="password"]';
      const btnSelector = 'input[type="submit"][name*="btnLogin"], button[type="submit"], input[type="submit"]';

      // Ensure elements are available
      await this.page.waitForSelector(userSelector, { timeout: 5000 }).catch(() => null);
      
      const userFieldExists = await this.page.$(userSelector);
      if (userFieldExists) {
        await this.page.type(userSelector, user);
        await this.page.type(passSelector, pass);
        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
          this.page.click(btnSelector),
        ]);
        console.log("Authentication successful.");
        return true;
      } else {
        // If no login form found, maybe we are already logged in or page structure is different
        console.log("Login form not found. Assuming authenticated or requires manual check.");
        return false;
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  }

  async getPage(): Promise<Page> {
    if (!this.page) throw new Error("PortalClient not initialized");
    return this.page;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
