/* Link targets for /ai-workflows.
   Change a booking or payment URL here only — the page reads these constants.
   An empty pay constant falls back to BOOKING_URL. */

const BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3uXJZrPYF_3dViTN9tx16TXyWYH-ObJyL3y3urOELSSCyWYCT_kkL1LYED-DLO1pSZ7kA8HRE6";

const PAY_LINK_INDIVIDUAL = "https://buy.stripe.com/8x29AT5HF1Ki27dboodby02";

const PAY_LINK_TEAM = "https://buy.stripe.com/bJe4gzda74Wu27ddwwdby03";

function resolvePayLink(payLink) {
  const value = typeof payLink === "string" ? payLink.trim() : "";
  return value || BOOKING_URL;
}

function configureExternalLink(el, url) {
  el.setAttribute("href", url);
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener noreferrer");
}

function applyAiWorkflowLinks() {
  document.querySelectorAll("[data-booking-cta]").forEach((el) => {
    configureExternalLink(el, BOOKING_URL);
  });

  const payLinks = {
    individual: PAY_LINK_INDIVIDUAL,
    team: PAY_LINK_TEAM,
  };

  document.querySelectorAll("[data-pay-plan]").forEach((el) => {
    const plan = el.getAttribute("data-pay-plan");
    const configured = Object.prototype.hasOwnProperty.call(payLinks, plan)
      ? payLinks[plan]
      : "";
    configureExternalLink(el, resolvePayLink(configured));
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAiWorkflowLinks);
  } else {
    applyAiWorkflowLinks();
  }
}
