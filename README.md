# Dylan Silver — Personal Website

A multipage website presenting Dylan Silver's work as an Austin REALTOR® and software engineer. It includes services, a biography, technical projects, podcast and media appearances, consultation booking, a contact form, and a newsletter signup.

## Technology

- HTML, CSS, and browser JavaScript, with no frontend build step.
- Google Calendar appointment scheduling for consultation booking.
- Node.js ES module API handlers and Nodemailer for IONOS SMTP email.
- Airtable's REST API for storing newsletter subscriptions.

## Preview locally

Clone the repository and serve its root directory with Python 3:

```sh
git clone https://github.com/dylan-tex/dylansilver.org.git
cd dylansilver.org
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://localhost:8000). Browse the pages and use the navigation, project skill buttons, and booking links. Booking links open Google Calendar and require an internet connection.

This static preview serves the pages and assets. Contact and subscription submissions require the API runtime described below.

## Contact and newsletter APIs

Install the Node.js dependency before running the API handlers:

```sh
npm install
```

The handlers export the `handler(req, res)` interface used by Vercel Node.js functions. Run them through a compatible platform, with the website and `/api` endpoints on the same origin. There is no `npm start`, `dev`, or `build` script in [package.json](package.json).

Configure these environment variables in the API host:

| Variable | Purpose |
| --- | --- |
| `EMAIL_USER` | IONOS SMTP username and sending address. |
| `EMAIL_PASSWORD` | SMTP password. |
| `AIRTABLE_API_KEY` | Airtable token with access to create subscriber records. |
| `AIRTABLE_BASE_ID` | Base containing the subscriber table. |
| `AIRTABLE_TABLE` | Optional table name; defaults to `Subscribers`. |
| `SUBSCRIBE_NOTIFY_TO` | Optional subscription notification recipient; defaults to `EMAIL_USER`. |

The Airtable table needs `name`, `email`, and `submittedAt` fields matching [api/subscribe.js](api/subscribe.js). Keep credentials in the host's environment settings rather than in committed files.

- `POST /api/send-email` accepts `name`, `email`, `phone`, `subject`, `message`, and `consent`. All except phone are required. It emails the recipient configured in the source and sends the visitor a confirmation.
- `POST /api/subscribe` accepts `name` and `email`, saves the subscription to Airtable, and attempts a notification email when SMTP credentials are configured. It does not send the subscriber a welcome email.

Use test addresses and a test Airtable base when checking submissions; these endpoints send real messages and create records when configured.

## Project structure

| Path | Contents |
| --- | --- |
| [index.html](index.html) | Home page and newsletter signup. |
| [about.html](about.html) | Biography and credentials. |
| [services.html](services.html) | Real estate and relocation services. |
| [projects.html](projects.html) | Technical portfolio. |
| [media.html](media.html) | Podcasts and media. |
| [contact.html](contact.html) | Booking links and contact form. |
| [css/style.css](css/style.css) | Shared styles and responsive layouts. |
| [js/script.js](js/script.js) | Navigation, interactions, and form submissions. |
| [api/](api/) | Contact and subscription handlers. |
| [images/](images/), [videos/](videos/), [documents/](documents/) | Page assets and disclosure document. |

## Deployment

The pages can be served directly by a static host. [railpack.json](railpack.json) selects the `staticfile` provider; that configuration alone does not execute the Node.js API handlers. For working forms, use hosting that runs both handlers at their `/api` routes and configure the environment variables above.

No automated test command is configured. After changes, preview the affected pages, check navigation and mobile layout, and verify any form changes in an environment with the API handlers enabled.
