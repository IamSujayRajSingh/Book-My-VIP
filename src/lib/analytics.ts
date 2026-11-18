declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(event: string, slug?: string) {
  window.gtag?.("event", event, slug ? { package_slug: slug } : {});
}
export function setupAnalytics() {
  const panel = document.querySelector<HTMLElement>("#privacy-choice");
  if (!panel?.dataset.id) return;
  const id = panel.dataset.id;
  const key = "bookmyvip-analytics";
  let prior = "";
  try {
    prior = localStorage.getItem(key) || "";
  } catch {
    /* Storage is optional. */
  }
  function enable() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: false,
      page_location: location.origin + location.pathname,
      page_referrer: "",
      allow_google_signals: false,
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.append(tag);
    track("page_view");
    const pkg = document.querySelector<HTMLElement>("[data-package-page]");
    if (pkg) track("package_view", pkg.dataset.packagePage);
  }
  if (prior === "yes") enable();
  panel.hidden = Boolean(prior);
  document.querySelector(".privacy-settings")?.addEventListener("click", () => {
    panel.hidden = false;
    panel.querySelector("button")?.focus();
  });
  panel.querySelectorAll<HTMLButtonElement>("[data-choice]").forEach((button) =>
    button.addEventListener("click", () => {
      const value = button.dataset.choice!;
      try {
        localStorage.setItem(key, value);
      } catch {
        /* Keep current-page choice. */
      }
      panel.hidden = true;
      if (value === "yes") enable();
      else if (window.gtag) {
        window.gtag("consent", "update", { analytics_storage: "denied" });
        for (const cookie of document.cookie.split(";")) {
          const name = cookie.trim().split("=")[0];
          if (/^_ga($|_)/.test(name))
            document.cookie = name + "=; Max-Age=0; Path=/";
        }
        location.reload();
      }
    }),
  );
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLElement>("[data-event]");
    if (link?.dataset.event) track(link.dataset.event, link.dataset.slug);
  });
}
