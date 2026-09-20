# BPRIS — Browser Privacy Risk Information Scanner

> **See What Your Browser Reveals.**

BPRIS is a browser-based privacy scanner designed to help users understand what information their web browser exposes during normal browsing.

It performs a collection of local browser checks and presents the results through a clear privacy dashboard — without requiring an account or sending the scan results to a remote server.

---

## 🔍 What BPRIS Checks

BPRIS currently evaluates **15 browser privacy signals**:

* Secure Connection
* Cookies
* Location Permission
* Do Not Track
* Global Privacy Control
* WebRTC
* Canvas Fingerprinting
* WebGL Fingerprinting
* Screen Information
* Browser Information
* Timezone
* Hardware Information
* Color Depth
* Browser Languages
* Browser Storage

It also calculates a **Fingerprint Surface** based on observable browser signals.

---

## 🛡️ Privacy by Design

BPRIS is designed around a simple principle:

> **The privacy scanner should not become another source of tracking.**

The current version performs its checks locally in the user's browser.

BPRIS does not require:

* Account creation
* Login
* Email address
* Personal information
* Third-party analytics
* Advertising trackers
* Remote scan submission

The goal is to help users understand their browser privacy without unnecessarily collecting information about them.

---

## 📊 Privacy Score

BPRIS generates a privacy-oriented score based on the results of selected privacy controls.

The score is intended as an **informational indicator**, not a definitive measurement of overall online privacy.

A higher score does not mean that a browser is completely anonymous or impossible to fingerprint.

---

## 🧬 Fingerprint Surface

Modern browsers can expose multiple characteristics that may contribute to browser fingerprinting.

BPRIS identifies observable browser characteristics and groups them into a **Fingerprint Surface**.

Examples include:

* Screen dimensions
* Browser information
* Timezone
* Hardware information
* Color depth
* Browser languages
* Canvas availability
* WebGL availability
* WebRTC availability

A broad fingerprint surface does **not automatically mean that a user has a unique fingerprint**. Actual fingerprint uniqueness depends on the wider browser population and the combination of available signals.

---

## ⚙️ How It Works

BPRIS runs directly in the browser using standard web technologies.

```text
User opens BPRIS
        ↓
Browser exposes available signals
        ↓
BPRIS performs local checks
        ↓
Privacy results are analyzed
        ↓
Results are displayed in the dashboard
```

No server-side scan processing is required for the current version.

---

## 🧪 Current Version

**BPRIS v1.0**

Current capabilities include:

* Local browser privacy scanning
* 15 privacy signal checks
* Privacy score
* Protected / Signal / Review / Unknown states
* Fingerprint Surface analysis
* Responsive interface
* Desktop and mobile support
* Privacy-focused design
* No unnecessary analytics

---

## ⚠️ Limitations

BPRIS is an educational and informational privacy tool.

Browser APIs have limitations, and different browsers may expose different information.

The results should not be interpreted as:

* A complete security audit
* A guarantee of anonymity
* A guarantee against fingerprinting
* A replacement for security software
* A complete assessment of a user's online privacy

Some browser capabilities may also be restricted by browser settings, permissions, extensions, operating systems, or security policies.

---

## 🔐 Security & Privacy Philosophy

BPRIS follows a minimal-data approach.

The project aims to:

1. Collect as little information as possible.
2. Perform checks locally whenever practical.
3. Explain browser-exposed signals clearly.
4. Avoid unnecessary tracking.
5. Give users visibility into their own browser environment.

---

## 🛠️ Technology

BPRIS is built with standard frontend technologies:

* HTML5
* CSS3
* JavaScript
* Browser APIs

No framework is required for the current version.

---

## 📁 Project Structure

```text
BPRIS/
├── index.html
├── style.css
├── responsive.css
├── ui.js
├── privacy-check.js
├── app.js
├── bpris-logo.svg.png
└── README.md
```

---

## 🚀 Running BPRIS Locally

Because BPRIS is a static web application, it can be run locally with a simple static web server.

For example, with VS Code and Live Server:

```text
1. Clone or download the repository.
2. Open the project in VS Code.
3. Start a local static server.
4. Open BPRIS in your browser.
5. Run the privacy scan.
```

Some browser privacy signals may behave differently depending on whether the site is running locally or over HTTPS.

---

## 🌐 Live Demo

**BPRIS:**
https://ismanwarrior.github.io/BPRIS/

---

## 🗺️ Roadmap

### v1.0 — Foundation

* [x] Browser privacy scanner
* [x] Local privacy checks
* [x] Privacy score
* [x] Fingerprint surface
* [x] Responsive interface
* [x] Privacy-focused architecture

### v1.1 — Extended Analysis

Planned improvements may include:

* Additional browser privacy signals
* More detailed explanations
* Improved fingerprint analysis
* Better result interpretation
* Additional browser compatibility checks

### v2.0 — Advanced Privacy Insights

Future possibilities include:

* Privacy report export
* Scan comparison
* Historical results
* More advanced fingerprint analysis
* Expanded browser environment analysis

---

## 🤝 Contributing

BPRIS is currently focused on building a reliable privacy-analysis foundation.

Ideas, bug reports, improvements, and security-related feedback are welcome.

If you discover a potential privacy or security issue, please report it responsibly.

---

## 📜 License

License information will be added as the project moves toward its formal public release.

---

## 💡 Project Vision

BPRIS aims to make browser privacy easier to understand.

Instead of presenting users with complicated technical information, the project focuses on showing:

**What your browser reveals.
Why it matters.
And what you can understand from it.**

> **BPRIS — See What Your Browser Reveals.**
