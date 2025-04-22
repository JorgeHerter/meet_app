# Test info

- Name: User can expand event details
- Location: C:\Users\Jorge Herter\Desktop\jorge\OneDrive\Documents\meet_app\e2e-tests\EndTOEnd.test.js:25:3

# Error details

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.event') to be visible
    - waiting for" https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events.public.readonly&response_type=code&client_id=683370178402-r5vjqtn1l8el…" navigation to finish...
    - navigated to "https://accounts.google.com/v3/signin/identifier?opparams=%253F&dsh=S-1508050312%3A1745279455828314&access_type=offline&client_id=683370178402-r5vjqtn1l8el8q1q9uf7bip8b94ealt9.apps.googleusercontent.…"

    at C:\Users\Jorge Herter\Desktop\jorge\OneDrive\Documents\meet_app\e2e-tests\EndTOEnd.test.js:13:16
```

# Page snapshot

```yaml
- img "Google"
- text: Sign in with Google
- heading "Sign in" [level=1]
- paragraph:
  - text: to continue to
  - button "meet-app-psi.vercel.app"
- textbox "Email or phone"
- text: Email or phone
- paragraph:
  - link "Forgot email?":
    - /url: /signin/v2/usernamerecovery?access_type=offline&app_domain=https://meet-app-psi.vercel.app&client_id=683370178402-r5vjqtn1l8el8q1q9uf7bip8b94ealt9.apps.googleusercontent.com&continue=https://accounts.google.com/signin/oauth/legacy/consent?authuser%3Dunknown%26part%3DAJi8hAOY0Z4mUL4VnCTHD11OoNnzYnOe02WdQb0CoSVRkdgEq18K6GIPeR0AIBtMXDl2LCy3QS_CEZ3Opb94zeFdlsGnSK5s9RE5jmC91cEd_3ibpqersELaHI1_SBB5bby4q9r_px2-u4TLP6ZURkkHTnwBeyT8rjaZKNwenhH8M3ogS7X2uIP4WXPg2TJYMmDqXwRd6oySUgURjNt-vjogcb1ADenlyMt1x_bbOWCt9XKZbTgcy4XGXMks_XKzs2XxEoHEW46sQjjSpCocKYuH6yzHu52OxCTMIomyW9gWYO6IFINjADj8C1W4zdgSUO4FdODh9SQOJsBv2F5Vwidx2YODXd5hNP52yKM5vZBRVTeIZkKfyoz1zohQvsxwfCGEDHR_mYgjSlNKl0OhzuO3uaIyzu1GZy2PvWqknb0rIR09uOnWT87n3_Yj1NTzDpWODve5Lr6vORlQBS1uEQlMWMjmPmjFAQ%26flowName%3DGeneralOAuthFlow%26as%3DS-1508050312%253A1745279455828314%26client_id%3D683370178402-r5vjqtn1l8el8q1q9uf7bip8b94ealt9.apps.googleusercontent.com%23&dsh=S-1508050312:1745279455828314&flowName=GeneralOAuthLite&o2v=2&opparams=%253F&rart=ANgoxce-R7CR1RK_98fopHRMmAfqhvQckWXyl_tWl-s5TrPpbX5F_HZ5-dRcZF9JbpklC6P-gOtge_IwO3uoiScaMpOxgT0_An99nKBPsm9KF_0qWPBxsuw&redirect_uri=https://meet-app-psi.vercel.app/&response_type=code&scope=https://www.googleapis.com/auth/calendar.events.public.readonly&service=lso
- button "Next"
- link "Create account":
  - /url: /lifecycle/flows/signup?access_type=offline&app_domain=https://meet-app-psi.vercel.app&client_id=683370178402-r5vjqtn1l8el8q1q9uf7bip8b94ealt9.apps.googleusercontent.com&continue=https://accounts.google.com/signin/oauth/legacy/consent?authuser%3Dunknown%26part%3DAJi8hAOY0Z4mUL4VnCTHD11OoNnzYnOe02WdQb0CoSVRkdgEq18K6GIPeR0AIBtMXDl2LCy3QS_CEZ3Opb94zeFdlsGnSK5s9RE5jmC91cEd_3ibpqersELaHI1_SBB5bby4q9r_px2-u4TLP6ZURkkHTnwBeyT8rjaZKNwenhH8M3ogS7X2uIP4WXPg2TJYMmDqXwRd6oySUgURjNt-vjogcb1ADenlyMt1x_bbOWCt9XKZbTgcy4XGXMks_XKzs2XxEoHEW46sQjjSpCocKYuH6yzHu52OxCTMIomyW9gWYO6IFINjADj8C1W4zdgSUO4FdODh9SQOJsBv2F5Vwidx2YODXd5hNP52yKM5vZBRVTeIZkKfyoz1zohQvsxwfCGEDHR_mYgjSlNKl0OhzuO3uaIyzu1GZy2PvWqknb0rIR09uOnWT87n3_Yj1NTzDpWODve5Lr6vORlQBS1uEQlMWMjmPmjFAQ%26flowName%3DGeneralOAuthFlow%26as%3DS-1508050312%253A1745279455828314%26client_id%3D683370178402-r5vjqtn1l8el8q1q9uf7bip8b94ealt9.apps.googleusercontent.com%23&dsh=S-1508050312:1745279455828314&flowEntry=SignUp&flowName=GlifWebSignIn&o2v=2&opparams=%253F&rart=ANgoxce-R7CR1RK_98fopHRMmAfqhvQckWXyl_tWl-s5TrPpbX5F_HZ5-dRcZF9JbpklC6P-gOtge_IwO3uoiScaMpOxgT0_An99nKBPsm9KF_0qWPBxsuw&redirect_uri=https://meet-app-psi.vercel.app/&response_type=code&scope=https://www.googleapis.com/auth/calendar.events.public.readonly&service=lso&signInUrl=https://accounts.google.com/signin/oauth?access_type%3Doffline%26app_domain%3Dhttps://meet-app-psi.vercel.app%26client_id%3D683370178402-r5vjqtn1l8el8q1q9uf7bip8b94ealt9.apps.googleusercontent.com%26continue%3Dhttps://accounts.google.com/signin/oauth/legacy/consent?authuser%253Dunknown%2526part%253DAJi8hAOY0Z4mUL4VnCTHD11OoNnzYnOe02WdQb0CoSVRkdgEq18K6GIPeR0AIBtMXDl2LCy3QS_CEZ3Opb94zeFdlsGnSK5s9RE5jmC91cEd_3ibpqersELaHI1_SBB5bby4q9r_px2-u4TLP6ZURkkHTnwBeyT8rjaZKNwenhH8M3ogS7X2uIP4WXPg2TJYMmDqXwRd6oySUgURjNt-vjogcb1ADenlyMt1x_bbOWCt9XKZbTgcy4XGXMks_XKzs2XxEoHEW46sQjjSpCocKYuH6yzHu52OxCTMIomyW9gWYO6IFINjADj8C1W4zdgSUO4FdODh9SQOJsBv2F5Vwidx2YODXd5hNP52yKM5vZBRVTeIZkKfyoz1zohQvsxwfCGEDHR_mYgjSlNKl0OhzuO3uaIyzu1GZy2PvWqknb0rIR09uOnWT87n3_Yj1NTzDpWODve5Lr6vORlQBS1uEQlMWMjmPmjFAQ%2526flowName%253DGeneralOAuthFlow%2526as%253DS-1508050312%25253A1745279455828314%2526client_id%253D683370178402-r5vjqtn1l8el8q1q9uf7bip8b94ealt9.apps.googleusercontent.com%2523%26ddm%3D1%26dsh%3DS-1508050312:1745279455828314%26flowName%3DGeneralOAuthLite%26o2v%3D2%26opparams%3D%25253F%26rart%3DANgoxce-R7CR1RK_98fopHRMmAfqhvQckWXyl_tWl-s5TrPpbX5F_HZ5-dRcZF9JbpklC6P-gOtge_IwO3uoiScaMpOxgT0_An99nKBPsm9KF_0qWPBxsuw%26redirect_uri%3Dhttps://meet-app-psi.vercel.app/%26response_type%3Dcode%26scope%3Dhttps://www.googleapis.com/auth/calendar.events.public.readonly%26service%3Dlso
- contentinfo:
  - combobox:
    - option "Afrikaans"
    - option "azərbaycan"
    - option "bosanski"
    - option "català"
    - option "Čeština"
    - option "Cymraeg"
    - option "Dansk"
    - option "Deutsch"
    - option "eesti"
    - option "English (United Kingdom)"
    - option "English (United States)" [selected]
    - option "Español (España)"
    - option "Español (Latinoamérica)"
    - option "euskara"
    - option "Filipino"
    - option "Français (Canada)"
    - option "Français (France)"
    - option "Gaeilge"
    - option "galego"
    - option "Hrvatski"
    - option "Indonesia"
    - option "isiZulu"
    - option "íslenska"
    - option "Italiano"
    - option "Kiswahili"
    - option "latviešu"
    - option "lietuvių"
    - option "magyar"
    - option "Melayu"
    - option "Nederlands"
    - option "norsk"
    - option "o‘zbek"
    - option "polski"
    - option "Português (Brasil)"
    - option "Português (Portugal)"
    - option "română"
    - option "shqip"
    - option "Slovenčina"
    - option "slovenščina"
    - option "srpski (latinica)"
    - option "Suomi"
    - option "Svenska"
    - option "Tiếng Việt"
    - option "Türkçe"
    - option "Ελληνικά"
    - option "беларуская"
    - option "български"
    - option "кыргызча"
    - option "қазақ тілі"
    - option "македонски"
    - option "монгол"
    - option "Русский"
    - option "српски (ћирилица)"
    - option "Українська"
    - option "ქართული"
    - option "հայերեն"
    - option "‫עברית‬‎"
    - option "‫اردو‬‎"
    - option "‫العربية‬‎"
    - option "‫فارسی‬‎"
    - option "አማርኛ"
    - option "नेपाली"
    - option "मराठी"
    - option "हिन्दी"
    - option "অসমীয়া"
    - option "বাংলা"
    - option "ਪੰਜਾਬੀ"
    - option "ગુજરાતી"
    - option "ଓଡ଼ିଆ"
    - option "தமிழ்"
    - option "తెలుగు"
    - option "ಕನ್ನಡ"
    - option "മലയാളം"
    - option "සිංහල"
    - option "ไทย"
    - option "ລາວ"
    - option "မြန်မာ"
    - option "ខ្មែរ"
    - option "한국어"
    - option "中文（香港）"
    - option "日本語"
    - option "简体中文"
    - option "繁體中文"
  - list:
    - listitem:
      - link "Help":
        - /url: https://support.google.com/accounts?hl=en-US&p=account_iph
    - listitem:
      - link "Privacy":
        - /url: https://accounts.google.com/TOS?loc=MX&hl=en-US&privacy=true
    - listitem:
      - link "Terms":
        - /url: https://accounts.google.com/TOS?loc=MX&hl=en-US
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.beforeEach(async ({ page }) => {
   4 |     await page.goto('https://meet-app-psi.vercel.app/?mock=true');
   5 |   
   6 |     // Fake login state (if your app checks localStorage or cookies)
   7 |     await page.evaluate(() => {
   8 |       localStorage.setItem('access_token', 'test');
   9 |     });
  10 |   
  11 |     await page.reload(); // Reload to trigger app logic with token
  12 |   
> 13 |     await page.waitForSelector('.event', { timeout: 60000 });
     |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  14 |   });
  15 |   
  16 |   test('Event is collapsed by default', async () => {
  17 |     // Select the first event on the page
  18 |     const event = page.locator('.event').first();
  19 |
  20 |     // Check that the event details are collapsed by default (not visible)
  21 |     const details = event.locator('.details');
  22 |     await expect(details).toHaveCount(0); // Ensure there are no details by default
  23 |   });
  24 |
  25 |   test('User can expand event details', async () => {
  26 |     const event = page.locator('.event').first();
  27 |     const button = event.locator('.details-btn');
  28 |
  29 |     // Click the expand button
  30 |     await button.click();
  31 |
  32 |     // Wait for the details to be visible
  33 |     await expect(event.locator('.details')).toBeVisible();
  34 |   });
  35 |
  36 |   test('User can collapse event details', async () => {
  37 |     const event = page.locator('.event').first();
  38 |     const button = event.locator('.details-btn');
  39 |
  40 |     // Click the expand button to show details
  41 |     await button.click();
  42 |     await expect(event.locator('.details')).toBeVisible();
  43 |
  44 |     // Now click the collapse button to hide the details
  45 |     await button.click();
  46 |     await expect(event.locator('.details')).toHaveCount(0); // Ensure details are collapsed
  47 |   });
  48 |
  49 |
  50 |
```