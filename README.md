# StaticPortfolio
Static art portfolio page for artist

## Overview
A modern, responsive static portfolio website designed for visual and digital artists. Features a beautiful landing page with a circular profile photo, art gallery, and a dedicated commissions page.

## Features

### Main Page (index.html)
- **Landing Section**: Large circular profile photo with blurry mosaic background
- **About Section**: Artist biography and description
- **Links Section**: Social media and contact links in card format
- **Gallery Section**: Showcase of artwork with hover effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Commissions Page (commissions.html)
- Commission status indicator
- Four pricing tiers with detailed features
- Step-by-step commission process
- Terms and conditions
- Contact button for inquiries

### Admin Panel (admin.html)
- **Microsoft Entra ID Authentication**: Secure server-side authentication
- **Content Management**: Edit all portfolio content without touching code
- **Profile Settings**: Update artist name, tagline, and profile image
- **About Section**: Edit biography paragraphs
- **Social Links**: Manage all social media links and icons
- **Gallery Management**: Update artwork titles, categories, and image URLs
- **Commission Control**: Toggle commission status (Open/Closed) and update messages
- **Persistent Storage**: Changes saved to browser localStorage
- **Secure Access**: Admin link only visible when authenticated via Microsoft Entra ID

## File Structure
```
StaticPortfolio/
├── index.html              # Main landing page
├── commissions.html        # Commissions information page
├── admin.html              # Admin panel for content management
├── styles.css              # All styling and responsive design
├── script.js               # Dynamic effects and animations
├── admin.js                # Admin panel functionality
├── staticwebapp.config.json # Azure Static Web Apps configuration
├── images/                 # Image assets
│   ├── profile.jpg         # Profile photo
│   └── art1-6.jpg          # Artwork samples
└── README.md               # This file
```

## Deployment

### Azure Static Web Apps with Microsoft Entra ID (Recommended)

This portfolio is deployed on Azure Static Web Apps with secure Microsoft Entra ID authentication protecting the admin panel.

#### Prerequisites
- Azure account ([Create free account](https://azure.microsoft.com/free/))
- Azure CLI installed ([Download here](https://docs.microsoft.com/cli/azure/install-azure-cli))
- GitHub account with this repository

#### Step 1: Create Azure Static Web App

1. **Login to Azure CLI**:
```bash
az login
```

2. **Create a resource group** (if you don't have one):
```bash
az group create \
  --name portfolio-rg \
  --location eastus2
```

3. **Create the Static Web App**:
```bash
az staticwebapp create \
  --name my-portfolio \
  --resource-group portfolio-rg \
  --source https://github.com/JoJoisGud/StaticPortfolio \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --login-with-github
```

4. **Note the deployment token** - you'll need this for GitHub Actions.

#### Step 2: Register App in Microsoft Entra ID

1. **Go to Azure Portal** → [Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)

2. **Register new application**:
   - Click **App registrations** → **New registration**
   - Name: `Portfolio Admin Auth`
   - Supported account types: **Accounts in this organizational directory only** (or choose based on your needs)
   - Redirect URI: Select **Web** and enter:
     - `https://YOUR-STATIC-WEB-APP-URL/.auth/login/aad/callback`
     - Example: `https://my-portfolio.azurestaticapps.net/.auth/login/aad/callback`
   - Click **Register**

3. **Copy the Application (client) ID** - you'll need this later

4. **Copy the Directory (tenant) ID** from the Overview page

5. **Create a client secret**:
   - Click **Certificates & secrets** → **New client secret**
   - Description: `Portfolio Auth Secret`
   - Expires: Choose expiration (recommended: 24 months)
   - Click **Add**
   - **IMPORTANT**: Copy the secret **Value** immediately (you won't see it again!)

#### Step 3: Configure Custom Domain (Optional)

1. **In Azure Portal**, navigate to your Static Web App

2. **Click Custom domains** → **Add**

3. **Enter your custom domain**: `portfolio.sirleafy.com`

4. **Configure DNS** at your domain provider:
   - Add CNAME record:
     - Name: `portfolio` (or `@` for root domain)
     - Value: Your Azure Static Web App URL (e.g., `my-portfolio.azurestaticapps.net`)

5. **Validate and add** the domain in Azure

6. **Update Entra ID Redirect URI**:
   - Go back to your App Registration
   - Update redirect URI to use your custom domain:
     - `https://portfolio.sirleafy.com/.auth/login/aad/callback`

#### Step 4: Configure Static Web App Settings

1. **In Azure Portal**, go to your Static Web App → **Configuration**

2. **Add Application Settings**:

| Name | Value |
|------|-------|
| `AZURE_CLIENT_ID` | Your Application (client) ID from Step 2 |
| `AZURE_CLIENT_SECRET` | Your client secret value from Step 2 |
| `AZURE_TENANT_ID` | Your Directory (tenant) ID from Step 2 |

3. **Click Save**

#### Step 5: Create staticwebapp.config.json

Create a file named `staticwebapp.config.json` in your repository root:

```json
{
  "routes": [
    {
      "route": "/admin.html",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/admin.js",
      "allowedRoles": ["authenticated"]
    }
  ],
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET"
        },
        "login": {
          "loginParameters": ["scope=openid profile email"]
        }
      }
    }
  },
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/aad",
      "statusCode": 302
    }
  },
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*", "/*.{css,js,json,jpg,png,gif,svg,ico}"]
  }
}
```

**Replace `YOUR_TENANT_ID`** with your actual tenant ID from Step 2.

#### Step 6: Commit and Deploy

1. **Commit the configuration file**:
```bash
git add staticwebapp.config.json
git commit -m "Add Azure Static Web Apps configuration with Entra ID auth"
git push origin main
```

2. **GitHub Actions will automatically deploy** your site to Azure

3. **Monitor deployment**:
   - Go to your repository → **Actions** tab
   - Watch the deployment workflow

#### Step 7: Test Authentication

1. **Visit your site**: `https://your-site.azurestaticapps.net` (or your custom domain)

2. **Test public pages**: `index.html` and `commissions.html` should work without login

3. **Test admin access**: 
   - Navigate to `/admin.html`
   - You should be redirected to Microsoft login
   - After successful login, you'll be redirected back to the admin panel

4. **Verify authentication**:
   - Only authenticated users can access admin pages
   - Logout link: `https://your-site.azurestaticapps.net/.auth/logout`

#### Step 8: Make Repository Private

1. **Go to GitHub** → Your repository → **Settings**

2. **Scroll down** to "Danger Zone"

3. **Click "Change visibility"** → **Make private**

4. **Confirm** by typing the repository name

✅ Your repository is now private, but Azure Static Web Apps can still deploy it!

### Alternative: GitHub Pages Deployment (Not Recommended - No Auth)

⚠️ **Warning**: GitHub Pages deployment does not support server-side authentication. The admin panel will NOT be secure.

<details>
<summary>Click to expand GitHub Pages instructions (legacy)</summary>

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Source", select the branch you want to deploy (e.g., `main`)
   - Select "/ (root)" as the folder
   - Click Save

2. **Access Your Site**:
   - Your portfolio will be available at: `https://[username].github.io/[repository-name]/`

**Note**: With GitHub Pages, your admin panel has no real security. Anyone who finds the URL can access it.

</details>

### Local Development

You can run the site locally for testing:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080

# Using Azure Static Web Apps CLI (recommended for testing auth)
npm install -g @azure/static-web-apps-cli
swa start . --port 8080
```

Then navigate to `http://localhost:8080` in your browser.

**Note**: Microsoft Entra ID authentication will not work locally unless you configure the Azure Static Web Apps CLI with your auth settings.

### Customization

#### Using the Admin Panel (Recommended)

The easiest way to customize your portfolio is through the admin panel:

1. Navigate to `admin.html` in your browser
2. **Login with your Microsoft account** (the one used in Azure)
3. Edit any content directly in the admin interface:
   - Artist name and tagline
   - About section text
   - Social media links
   - Gallery artwork details
   - Commission status
4. Click "Save All Changes" to apply updates
5. Changes will immediately appear on the main pages

**Note**: Changes are stored in your browser's localStorage. Clearing browser data will reset all customizations.

#### Manual Customization

##### Replace Images
1. Replace `images/profile.jpg` with your profile photo (recommended: 800x800px)
2. Replace `images/art1.jpg` through `images/art6.jpg` with your artwork (recommended: square format)

##### Update Content Manually
- **Artist Name**: Edit the `<h1 class="artist-name">` in `index.html`
- **About Text**: Modify the paragraphs in the `about-section`
- **Social Links**: Update the href attributes in the `links-card` section
- **Commission Prices**: Edit the pricing in `commissions.html`
- **Contact Email**: Update the mailto link in the contact section

##### Customize Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;      /* Main brand color */
    --secondary-color: #8b5cf6;    /* Accent color */
    --text-color: #1f2937;         /* Text color */
}
```

## Security Features

### Microsoft Entra ID Authentication
- **Server-side authentication**: Authentication happens on Azure's servers, not in the browser
- **Industry-standard OAuth 2.0**: Uses Microsoft's secure authentication protocol
- **Protected routes**: Admin pages are completely inaccessible without authentication
- **Automatic token refresh**: Session management handled by Azure
- **Single Sign-On**: Use your Microsoft account credentials

### Repository Privacy
- **Private repository**: Source code is not publicly accessible
- **Secure deployment**: Only Azure has access to deploy your code
- **Environment variables**: Sensitive credentials stored securely in Azure

## Troubleshooting

### Authentication Issues

**Problem**: Redirected to login but keeps looping
- **Solution**: Check that redirect URI in Entra ID matches your actual site URL exactly
- Verify `staticwebapp.config.json` has correct tenant ID

**Problem**: "AADSTS50011: The reply URL does not match"
- **Solution**: Add the exact callback URL to Entra ID app registration:
  - `https://your-domain.com/.auth/login/aad/callback`

**Problem**: Admin page returns 404
- **Solution**: Ensure `admin.html` is in the repository root
- Check GitHub Actions deployment logs

### Deployment Issues

**Problem**: GitHub Actions failing
- **Solution**: Check deployment token is correct in repository secrets
- Verify Azure Static Web App name matches in workflow

**Problem**: Site not updating after push
- **Solution**: Check GitHub Actions tab for deployment status
- Clear browser cache and hard refresh (Ctrl+Shift+R)

## Costs

### Azure Static Web Apps
- **Free tier includes**:
  - 100 GB bandwidth per month
  - Custom domains
  - SSL certificates
  - Microsoft Entra ID authentication
  - GitHub integration  

- **Sufficient for**: Personal portfolios and small business sites

[View Azure Static Web Apps pricing](https://azure.microsoft.com/pricing/details/app-service/static/)

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
All rights reserved.