# Deploying Book My VIP

This guide is for the owner after content, policies, pricing and the production domain have been approved. Preparing or previewing the site locally does not require a Cloudflare account.

## Run on Windows

Use PowerShell and a compatible Node.js LTS with npm. The installed Astro version requires Node 22.23.4 or newer. Use the same supported Node version locally and in Workers Builds. From the project directory, run:

```powershell
Set-Location -LiteralPath 'C:\Users\iamsu\Downloads\Websites\Book-My-VIP'
npm ci
npm run dev
```

Open the local URL printed by Astro. Stop the server with Ctrl+C. For a production build, use an HTTPS origin you control and plan to publish to. Enter just the origin, without a page path, query or fragment.

```powershell
$env:PUBLIC_SITE_URL = Read-Host 'Approved production origin including https://'
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
npx wrangler dev --local
```

The dry run validates deployment preparation locally. Wrangler’s local server then previews `dist/` using the Worker configuration. Test one real package route and one unknown URL. The latter should return HTTP 404 with the custom error page. Stop Wrangler with Ctrl+C. With the origin unset, you can work locally before a domain has been chosen. Production indexing and absolute SEO URLs require the origin at build time.

## Create and push the repository after approval

The repository contains internal business notes in `docs/`. Use a private repository if those notes should stay within the business. The Worker publishes only `dist/`. Review `git status` and the staged filenames before committing. Include `package-lock.json`. Keep credentials, local environment files, build output, caches and dependencies out of version control.

In a fresh local project, use Git and the authenticated [GitHub CLI](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github):

```powershell
git init -b main
git add -- .
git status --short
git diff --cached --stat
git commit -m "Build Pattaya VIP booking website"
gh auth login
gh repo create book-my-vip --private --source=. --remote=origin --push
```

If the project already has a local commit on `main`, start at `gh auth login`. If you already created an empty GitHub repository in the dashboard, add it as the remote in place of `gh repo create`:

```powershell
$repositoryUrl = Read-Host 'HTTPS URL of the empty GitHub repository'
git remote add origin $repositoryUrl
git push -u origin main
```

## Connect Cloudflare Workers Builds

1. Open **Workers & Pages**, create a **Worker**, and select the option to import a Git repository. For an existing Worker, open its **Settings → Builds** and connect the repository there.
2. Authorize the Cloudflare GitHub app for the selected repository. Choose `book-my-vip` and set the Worker name to `bookmyvip-pattaya`, matching `wrangler.jsonc`. [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
3. Use `main` as the production branch. Use the repository root as the project directory, where `package.json` and `wrangler.jsonc` live. Leave the optional root-directory override empty for this layout.
4. Set the build command to `npm run build` and the deploy command to `npx wrangler deploy`. Workers installs dependencies using the committed npm lockfile. The static asset path is `./dist` in Wrangler configuration. [Workers Builds settings](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
5. In **build variables**, set `PUBLIC_SITE_URL` to the approved public HTTPS origin and `NODE_VERSION` to the version used for local checks. Leave `PUBLIC_GA_MEASUREMENT_ID` blank unless the owner has approved the GA4 property and consent wording. The build embeds public settings into static files. Keep credentials out of these values.
6. Start the first deployment once authorized. Confirm the build and deploy logs succeeded and that the deployment references the intended commit. Each subsequent push to the connected production branch triggers another build and deployment.

## Attach the approved domain

After the owner authorizes the DNS change, select the Worker, then **Settings → Domains & Routes → Add → Custom Domain**. Enter the approved hostname from an active Cloudflare zone you control and complete the setup. Cloudflare creates the DNS record and certificate. Review existing records first. If the chosen hostname differs from the build variable, correct `PUBLIC_SITE_URL` and rebuild. [Cloudflare custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

## Verify the release

- Check the homepage, three package pages, contact form, menu, logo, favicon, Instagram link and WhatsApp destination on mobile and desktop. Opening WhatsApp should prepare a draft that the guest can review and send.
- View the HTML source. Check the page title, description, canonical URL, Open Graph and structured data against the actual production hostname.
- Open `/robots.txt` and follow its sitemap link. Confirm that the sitemap contains the intended public pages and that its URLs use the production origin. Check that internal documents and build files return 404.
- Request an invented URL and check the HTTP status as well as the page body. Wrangler’s `404-page` setting should return the nearest `404.html` with status 404. [Workers static site routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- Verify the final public build contains only approved summaries. Test any analytics opt-in and opt-out and examine event parameters for personal information before approving measurement.
- When verified former URLs become available, add each confirmed source and relevant target as a line with status `301` in `public/_redirects`. Rebuild, then verify each response and destination. [Cloudflare static asset redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)

Useful PowerShell checks after setting `PUBLIC_SITE_URL`:

```powershell
$publicOrigin = $env:PUBLIC_SITE_URL.TrimEnd('/')
curl.exe -I "$publicOrigin/vip-packages/vip-premium/"
curl.exe -I "$publicOrigin/path-missing-for-release-check/"
curl.exe -sS "$publicOrigin/robots.txt"
curl.exe -sS "$publicOrigin/sitemap-index.xml"
```

## Publish a later approved update

```powershell
npm run check
npm test
npm run build
git status --short
git add -- .
git diff --cached --stat
git commit -m "Update approved Pattaya booking content"
git push origin main
```

Check the Workers Builds result and repeat the release checks for the pages you changed.
