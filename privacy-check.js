/* =========================================================
   BPRIS — PRIVACY CHECK ENGINE
   Step 1.5 — Localhost / HTTPS-aware scoring
========================================================= */

(function () {
    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    function safeGet(callback, fallback) {

        try {
            return callback();

        } catch (error) {

            return fallback;
        }
    }


    function isLocalDevelopment() {

        const protocol =
            window.location.protocol;

        const hostname =
            window.location.hostname;

        return (
            protocol === "file:" ||
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "::1"
        );
    }


    function getStatusLabel(status) {

        switch (status) {

            case "good":
                return "Protected";

            case "warning":
                return "Review";

            case "unknown":
                return "Unknown";

            default:
                return "Signal";
        }
    }


    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       CHECK 1 — SECURE CONNECTION
    ===================================================== */

    function checkHTTPS() {

        const protocol =
            window.location.protocol;

        if (protocol === "https:") {

            return {
                id: "https",
                title: "Secure Connection",
                status: "good",
                value: "HTTPS",
                description:
                    "Your connection uses HTTPS encryption."
            };
        }


        if (isLocalDevelopment()) {

            return {
                id: "https",
                title: "Secure Connection",
                status: "info",
                value: "Local Testing",
                description:
                    "BPRIS is running locally. HTTPS will be evaluated when deployed."
            };
        }


        return {
            id: "https",
            title: "Secure Connection",
            status: "warning",
            value: "Not HTTPS",
            description:
                "This page is not using HTTPS."
        };
    }


    /* =====================================================
       CHECK 2 — COOKIES
    ===================================================== */

    function checkCookies() {

        const enabled =
            navigator.cookieEnabled;

        if (enabled) {

            return {
                id: "cookies",
                title: "Cookies",
                status: "info",
                value: "Enabled",
                description:
                    "Your browser allows websites to use cookies."
            };
        }

        return {
            id: "cookies",
            title: "Cookies",
            status: "good",
            value: "Disabled",
            description:
                "Your browser is blocking cookies."
        };
    }


    /* =====================================================
       CHECK 3 — LOCATION PERMISSION
    ===================================================== */

    async function checkLocation() {

        if (!navigator.permissions) {

            return {
                id: "location",
                title: "Location Permission",
                status: "unknown",
                value: "Unavailable",
                description:
                    "Your browser does not expose permission status for location access."
            };
        }


        try {

            const permission =
                await navigator.permissions.query({
                    name: "geolocation"
                });


            if (permission.state === "granted") {

                return {
                    id: "location",
                    title: "Location Permission",
                    status: "warning",
                    value: "Granted",
                    description:
                        "Websites may access your location when permitted by the browser."
                };
            }


            if (permission.state === "denied") {

                return {
                    id: "location",
                    title: "Location Permission",
                    status: "good",
                    value: "Denied",
                    description:
                        "Websites cannot access your location through the browser permission."
                };
            }


            return {
                id: "location",
                title: "Location Permission",
                status: "good",
                value: "Prompt",
                description:
                    "Websites must ask before accessing your location."
            };

        } catch (error) {

            return {
                id: "location",
                title: "Location Permission",
                status: "unknown",
                value: "Unknown",
                description:
                    "The browser did not provide a readable location permission state."
            };
        }
    }


    /* =====================================================
       CHECK 4 — DO NOT TRACK
    ===================================================== */

    function checkDNT() {

        const dnt =
            navigator.doNotTrack;

        if (dnt === "1") {

            return {
                id: "dnt",
                title: "Do Not Track",
                status: "good",
                value: "Enabled",
                description:
                    "Your browser is sending a Do Not Track preference."
            };
        }


        if (dnt === "0") {

            return {
                id: "dnt",
                title: "Do Not Track",
                status: "warning",
                value: "Disabled",
                description:
                    "Your browser is explicitly indicating that Do Not Track is disabled."
            };
        }


        return {
            id: "dnt",
            title: "Do Not Track",
            status: "unknown",
            value: "Not Set",
            description:
                "Your browser is not sending a clear Do Not Track preference."
        };
    }


    /* =====================================================
       CHECK 5 — GLOBAL PRIVACY CONTROL
    ===================================================== */

    function checkGPC() {

        const gpc =
            navigator.globalPrivacyControl;

        if (gpc === true) {

            return {
                id: "gpc",
                title: "Global Privacy Control",
                status: "good",
                value: "Enabled",
                description:
                    "Your browser is sending a Global Privacy Control signal."
            };
        }


        return {
            id: "gpc",
            title: "Global Privacy Control",
            status: "info",
            value: "Not Detected",
            description:
                "No Global Privacy Control signal was detected."
        };
    }


    /* =====================================================
       CHECK 6 — WEBRTC
    ===================================================== */

    function checkWebRTC() {

        const available =
            typeof window.RTCPeerConnection ===
            "function";


        if (available) {

            return {
                id: "webrtc",
                title: "WebRTC",
                status: "info",
                value: "Available",
                description:
                    "WebRTC APIs are available and may expose network-related characteristics."
            };
        }


        return {
            id: "webrtc",
            title: "WebRTC",
            status: "good",
            value: "Unavailable",
            description:
                "WebRTC APIs are not available to websites."
        };
    }


    /* =====================================================
       CHECK 7 — CANVAS
    ===================================================== */

    function checkCanvas() {

        try {

            const canvas =
                document.createElement("canvas");

            const context =
                canvas.getContext("2d");

            if (context) {

                return {
                    id: "canvas",
                    title: "Canvas Fingerprinting",
                    status: "info",
                    value: "Available",
                    description:
                        "Canvas rendering characteristics can contribute to browser fingerprinting."
                };
            }

        } catch (error) {
            /* Continue to blocked state */
        }


        return {
            id: "canvas",
            title: "Canvas Fingerprinting",
            status: "good",
            value: "Blocked",
            description:
                "Canvas rendering is not available to websites."
        };
    }


    /* =====================================================
       CHECK 8 — WEBGL
    ===================================================== */

    function checkWebGL() {

        try {

            const canvas =
                document.createElement("canvas");

            const gl =
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");


            if (gl) {

                return {
                    id: "webgl",
                    title: "WebGL Fingerprinting",
                    status: "info",
                    value: "Available",
                    description:
                        "WebGL renderer characteristics can contribute to browser fingerprinting."
                };
            }

        } catch (error) {
            /* Continue to blocked state */
        }


        return {
            id: "webgl",
            title: "WebGL Fingerprinting",
            status: "good",
            value: "Blocked",
            description:
                "WebGL is not available to websites."
        };
    }


    /* =====================================================
       CHECK 9 — SCREEN
    ===================================================== */

    function checkScreen() {

        const width =
            window.screen &&
            window.screen.width;

        const height =
            window.screen &&
            window.screen.height;


        if (
            typeof width === "number" &&
            typeof height === "number"
        ) {

            return {
                id: "screen",
                title: "Screen Information",
                status: "info",
                value:
                    width + " × " + height,
                description:
                    "Your browser exposes screen dimensions that may contribute to fingerprinting."
            };
        }


        return {
            id: "screen",
            title: "Screen Information",
            status: "unknown",
            value: "Unavailable",
            description:
                "Screen dimensions could not be determined."
        };
    }


    /* =====================================================
       CHECK 10 — BROWSER
    ===================================================== */

    function checkBrowser() {

        const userAgent =
            navigator.userAgent || "";

        let browser =
            "Unknown Browser";


        if (
            userAgent.includes("Edg/")
        ) {

            browser = "Microsoft Edge";

        } else if (
            userAgent.includes("OPR/") ||
            userAgent.includes("Opera")
        ) {

            browser = "Opera";

        } else if (
            userAgent.includes("Chrome/")
        ) {

            browser = "Google Chrome";

        } else if (
            userAgent.includes("Firefox/")
        ) {

            browser = "Mozilla Firefox";

        } else if (
            userAgent.includes("Safari/")
        ) {

            browser = "Safari";
        }


        if (browser === "Unknown Browser") {

            return {
                id: "browser",
                title: "Browser Information",
                status: "unknown",
                value: browser,
                description:
                    "Browser identity information could not be confidently determined."
            };
        }


        return {
            id: "browser",
            title: "Browser Information",
            status: "info",
            value: browser,
            description:
                "Browser identity and user-agent information are visible to websites."
        };
    }


    /* =====================================================
       CHECK 11 — TIMEZONE
    ===================================================== */

    function checkTimezone() {

        const timezone =
            safeGet(
                function () {

                    return Intl.DateTimeFormat()
                        .resolvedOptions()
                        .timeZone;

                },
                null
            );


        if (timezone) {

            return {
                id: "timezone",
                title: "Timezone",
                status: "info",
                value: timezone,
                description:
                    "Your browser exposes its configured timezone."
            };
        }


        return {
            id: "timezone",
            title: "Timezone",
            status: "unknown",
            value: "Unavailable",
            description:
                "Your browser did not expose a timezone."
        };
    }


    /* =====================================================
       CHECK 12 — HARDWARE
    ===================================================== */

    function checkHardware() {

        const cores =
            navigator.hardwareConcurrency;

        const memory =
            navigator.deviceMemory;


        let value =
            "Unavailable";


        if (
            typeof cores === "number" &&
            typeof memory === "number"
        ) {

            value =
                cores +
                " CPU cores • " +
                memory +
                " GB RAM estimate";

        } else if (
            typeof cores === "number"
        ) {

            value =
                cores +
                " CPU cores";

        } else if (
            typeof memory === "number"
        ) {

            value =
                memory +
                " GB RAM estimate";
        }


        if (value === "Unavailable") {

            return {
                id: "hardware",
                title: "Hardware Information",
                status: "unknown",
                value: value,
                description:
                    "Hardware characteristics could not be determined."
            };
        }


        return {
            id: "hardware",
            title: "Hardware Information",
            status: "info",
            value: value,
            description:
                "Hardware-related characteristics are exposed through browser APIs."
        };
    }


    /* =====================================================
       CHECK 13 — COLOR DEPTH
    ===================================================== */

    function checkColorDepth() {

        const depth =
            window.screen &&
            window.screen.colorDepth;


        if (typeof depth === "number") {

            return {
                id: "color-depth",
                title: "Color Depth",
                status: "info",
                value:
                    depth + "-bit",
                description:
                    "Your display color depth is visible to websites."
            };
        }


        return {
            id: "color-depth",
            title: "Color Depth",
            status: "unknown",
            value: "Unavailable",
            description:
                "Display color depth could not be determined."
        };
    }


    /* =====================================================
       CHECK 14 — BROWSER LANGUAGES
    ===================================================== */

    function checkLanguages() {

        const languages =
            Array.isArray(
                navigator.languages
            )
                ? navigator.languages
                : [];


        if (languages.length) {

            return {
                id: "languages",
                title: "Browser Languages",
                status: "info",
                value:
                    languages.join(", "),
                description:
                    "Your preferred browser languages are visible to websites."
            };
        }


        if (navigator.language) {

            return {
                id: "languages",
                title: "Browser Languages",
                status: "info",
                value:
                    navigator.language,
                description:
                    "Your preferred browser language is visible to websites."
            };
        }


        return {
            id: "languages",
            title: "Browser Languages",
            status: "unknown",
            value: "Unavailable",
            description:
                "Browser language information could not be determined."
        };
    }


    /* =====================================================
       CHECK 15 — BROWSER STORAGE
    ===================================================== */

    function checkStorage() {

        try {

            const storage =
                window.localStorage;

            if (storage) {

                return {
                    id: "storage",
                    title: "Browser Storage",
                    status: "info",
                    value: "Available",
                    description:
                        "Browser storage APIs are available to websites."
                };
            }

        } catch (error) {
            /* Continue to restricted state */
        }


        return {
            id: "storage",
            title: "Browser Storage",
            status: "good",
            value: "Restricted",
            description:
                "Browser storage access is restricted."
        };
    }


    /* =====================================================
       FINGERPRINT SURFACE
    ===================================================== */

    function calculateFingerprintSurface(results) {

        const fingerprintIds = [
            "webrtc",
            "canvas",
            "webgl",
            "screen",
            "browser",
            "timezone",
            "hardware",
            "color-depth",
            "languages"
        ];


        const observable =
            results.filter(function (result) {

                return (
                    fingerprintIds.includes(result.id) &&
                    (
                        result.status === "info" ||
                        result.status === "warning"
                    )
                );

            });


        const count =
            observable.length;


        let level =
            "Limited";


        if (count >= 8) {

            level = "Broad";

        } else if (count >= 5) {

            level = "Moderate";

        } else if (count >= 3) {

            level = "Some";
        }


        return {
            level: level,
            count: count
        };
    }


    /* =====================================================
       PRIVACY SCORE
    ===================================================== */

    function calculatePrivacyScore(results) {

        let score = 100;


        results.forEach(function (result) {

            /*
             * Secure connection:
             * Only penalize real deployed HTTP.
             * Local development is not penalized.
             */

            if (
                result.id === "https" &&
                result.status === "warning"
            ) {

                score -= 35;
            }


            /*
             * Location permission.
             */

            if (
                result.id === "location" &&
                result.value === "Granted"
            ) {

                score -= 20;
            }


            if (
                result.id === "location" &&
                result.status === "unknown"
            ) {

                score -= 5;
            }


            /*
             * Do Not Track explicitly disabled.
             */

            if (
                result.id === "dnt" &&
                result.status === "warning"
            ) {

                score -= 8;
            }

        });


        return Math.max(
            0,
            Math.min(
                100,
                score
            )
        );
    }


    /* =====================================================
       SCORE DESCRIPTION
    ===================================================== */

    function getScoreDescription(
        score,
        results
    ) {

        const warningCount =
            results.filter(function (result) {

                return result.status === "warning";

            }).length;


        const unknownCount =
            results.filter(function (result) {

                return result.status === "unknown";

            }).length;


        const localDevelopment =
            isLocalDevelopment();


        if (
            localDevelopment &&
            warningCount === 0
        ) {

            return {
                title: "Local scan complete",
                description:
                    "No major privacy-control concerns were detected. HTTPS will be evaluated after deployment."
            };
        }


        if (warningCount > 0) {

            return {
                title: "Some settings need attention",
                description:
                    "Some privacy-related settings may need attention."
            };
        }


        if (unknownCount > 0) {

            return {
                title: "Scan mostly clear",
                description:
                    "Most checked privacy controls appear available; some signals could not be determined."
            };
        }


        if (score >= 90) {

            return {
                title: "Strong privacy controls",
                description:
                    "No major privacy-control concerns were detected."
            };
        }


        if (score >= 75) {

            return {
                title: "Some settings worth reviewing",
                description:
                    "A few privacy-related settings may be worth reviewing."
            };
        }


        if (score >= 50) {

            return {
                title: "Some settings need attention",
                description:
                    "Some privacy-related settings may need attention."
            };
        }


        return {
            title: "Several settings need attention",
            description:
                "Several privacy-related settings may need attention."
        };
    }


    /* =====================================================
       RUN ALL CHECKS
    ===================================================== */

    async function runPrivacyChecks() {

        const results = [];


        results.push(
            checkHTTPS()
        );


        results.push(
            checkCookies()
        );


        results.push(
            await checkLocation()
        );


        results.push(
            checkDNT()
        );


        results.push(
            checkGPC()
        );


        results.push(
            checkWebRTC()
        );


        results.push(
            checkCanvas()
        );


        results.push(
            checkWebGL()
        );


        results.push(
            checkScreen()
        );


        results.push(
            checkBrowser()
        );


        results.push(
            checkTimezone()
        );


        results.push(
            checkHardware()
        );


        results.push(
            checkColorDepth()
        );


        results.push(
            checkLanguages()
        );


        results.push(
            checkStorage()
        );


        return results;
    }


    /* =====================================================
       RENDER RESULTS
    ===================================================== */

    function renderPrivacyResults(results) {

        if (!Array.isArray(results)) {

            console.error(
                "BPRIS: Invalid results data."
            );

            return;
        }


        const score =
            calculatePrivacyScore(results);


        const scoreCopy =
            getScoreDescription(
                score,
                results
            );


        const fingerprint =
            calculateFingerprintSurface(
                results
            );


        /* -------------------------------------------------
           COUNTS
        ------------------------------------------------- */

        const total =
            results.length;


        const goodCount =
            results.filter(function (result) {

                return result.status === "good";

            }).length;


        const infoCount =
            results.filter(function (result) {

                return result.status === "info";

            }).length;


        const warningCount =
            results.filter(function (result) {

                return result.status === "warning";

            }).length;


        const unknownCount =
            results.filter(function (result) {

                return result.status === "unknown";

            }).length;


        /* -------------------------------------------------
           OVERVIEW
        ------------------------------------------------- */

        const overviewScore =
            document.querySelector(
                "#overview-score"
            );


        const overviewTitle =
            document.querySelector(
                "#overview-title"
            );


        const overviewDescription =
            document.querySelector(
                "#overview-description"
            );


        const totalSignals =
            document.querySelector(
                "#total-signals"
            );


        const goodSignals =
            document.querySelector(
                "#good-count"
            );


        const infoSignals =
            document.querySelector(
                "#info-count"
            );


        const warningSignals =
            document.querySelector(
                "#warning-count"
            );


        /*
         * NEW:
         * Unknown count display element.
         */

        const unknownSignals =
            document.querySelector(
                "#unknown-count"
            );


        if (overviewScore) {

            overviewScore.textContent =
                score;
        }


        if (overviewTitle) {

            overviewTitle.textContent =
                scoreCopy.title;
        }


        if (overviewDescription) {

            overviewDescription.textContent =
                scoreCopy.description;
        }


        if (totalSignals) {

            totalSignals.textContent =
                total;
        }


        if (goodSignals) {

            goodSignals.textContent =
                goodCount;
        }


        if (infoSignals) {

            infoSignals.textContent =
                infoCount;
        }


        if (warningSignals) {

            warningSignals.textContent =
                warningCount;
        }


        /*
         * NEW:
         * Render the actual unknown count.
         */

        if (unknownSignals) {

            unknownSignals.textContent =
                unknownCount;
        }


        /* -------------------------------------------------
           RESULT CARDS
        ------------------------------------------------- */

        const sections =
            document.querySelector(
                "#result-sections"
            );


        if (!sections) {

            console.error(
                "BPRIS: #result-sections not found."
            );

            return;
        }


        sections.innerHTML = "";


        results.forEach(function (result) {

            const card =
                document.createElement("article");


            card.className =
                "result-card " +
                result.status;


            const statusLabel =
                getStatusLabel(
                    result.status
                );


            card.innerHTML =
                `
                <div class="result-card-header">

                    <h3>
                        ${escapeHTML(result.title)}
                    </h3>

                    <span class="result-status">
                        ${escapeHTML(statusLabel)}
                    </span>

                </div>

                <div class="result-card-value">
                    ${escapeHTML(result.value)}
                </div>

                <p class="result-card-description">
                    ${escapeHTML(result.description)}
                </p>
                `;


            sections.appendChild(
                card
            );
        });


        /* -------------------------------------------------
           FINGERPRINT SURFACE CARD
        ------------------------------------------------- */

        const fingerprintCard =
            document.createElement("article");


        fingerprintCard.className =
            "result-card fingerprint-surface info";


        fingerprintCard.innerHTML =
            `
            <div class="result-card-header">

                <h3>
                    Fingerprint Surface
                </h3>

                <span class="result-status">
                    ${escapeHTML(fingerprint.level)}
                </span>

            </div>

            <div class="result-card-value">
                ${fingerprint.count} observable signals
            </div>

            <p class="result-card-description">
                These browser-visible characteristics can contribute to fingerprinting.
                This does not mean your browser is uniquely identifiable.
            </p>
            `;


        sections.appendChild(
            fingerprintCard
        );


        /* -------------------------------------------------
           DEBUG INFO
        ------------------------------------------------- */

        console.info(
            "BPRIS Scan Complete",
            {
                score: score,
                total: total,
                protected: goodCount,
                signals: infoCount,
                review: warningCount,
                unknown: unknownCount,
                fingerprintSurface:
                    fingerprint.level,
                localDevelopment:
                    isLocalDevelopment()
            }
        );
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.PrivacyCheck = {

        run:
            runPrivacyChecks
    };


    window.renderPrivacyResults =
        renderPrivacyResults;


    window.BPRIS = {

        run:
            runPrivacyChecks,

        calculateFingerprintSurface:
            calculateFingerprintSurface,

        calculatePrivacyScore:
            calculatePrivacyScore,

        getScoreDescription:
            getScoreDescription
    };


})();