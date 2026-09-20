(function () {
    "use strict";


    /* =====================================================
       LOADER
    ====================================================== */

    function hideLoader() {

        const loader =
            document.querySelector(".page-loader, #page-loader");

        if (!loader) return;

        loader.classList.add("is-hidden");
        loader.classList.add("hidden");

        setTimeout(function () {
            loader.style.display = "none";
        }, 600);
    }


    function setupLoader() {

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                function () {

                    setTimeout(
                        hideLoader,
                        500
                    );

                }
            );

        } else {

            setTimeout(
                hideLoader,
                500
            );

        }


        window.addEventListener(
            "load",
            function () {

                setTimeout(
                    hideLoader,
                    300
                );

            }
        );
    }


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    function setupScrollReveal() {

        const elements =
            document.querySelectorAll(
                ".reveal-on-scroll, .reveal"
            );

        if (!elements.length) return;


        if (!("IntersectionObserver" in window)) {

            elements.forEach(function (element) {

                element.classList.add("visible");
                element.classList.add("is-visible");

            });

            return;
        }


        const observer =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },

                {
                    threshold: 0.12
                }
            );


        elements.forEach(function (element) {

            observer.observe(element);

        });
    }


    /* =====================================================
       SMOOTH LINKS
    ====================================================== */

    function setupSmoothLinks() {

        document.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest(
                        'a[href^="#"]'
                    );

                if (!link) return;


                const id =
                    link.getAttribute("href");

                if (!id || id === "#") return;


                const target =
                    document.querySelector(id);

                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );
    }


    /* =====================================================
       BUTTON FEEDBACK
    ====================================================== */

    function setupButtons() {

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".primary-button, .secondary-button, .nav-check, .btn, .header-cta"
                    );

                if (!button) return;


                button.style.transform =
                    "translateY(0)";


                setTimeout(function () {

                    button.style.transform = "";

                }, 120);

            }
        );
    }


    /* =====================================================
       RADAR INTERACTION
    ====================================================== */

    function setupRadarInteraction() {

        const visual =
            document.querySelector(
                ".hero-visual"
            );

        if (!visual) return;


        visual.addEventListener(
            "mousemove",
            function (event) {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }


                const rect =
                    visual.getBoundingClientRect();


                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;


                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;


                visual.style.transform =
                    "perspective(900px) rotateX(" +
                    (-y * 3) +
                    "deg) rotateY(" +
                    (x * 3) +
                    "deg)";
            }
        );


        visual.addEventListener(
            "mouseleave",
            function () {

                visual.style.transform = "";

            }
        );
    }


    /* =====================================================
       HELPERS
    ====================================================== */

    function showElement(element) {

        if (!element) return;

        /*
         * IMPORTANT:
         * hidden attribute was preventing the result
         * dashboard from appearing.
         */
        element.hidden = false;

        element.removeAttribute("hidden");

        element.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function hideElement(element) {

        if (!element) return;

        element.classList.remove("active");

        element.hidden = true;

        element.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    /* =====================================================
       SHOW LOADING
    ====================================================== */

    function showLoading() {

        const loading =
            document.querySelector(
                ".check-loading, #loading-state"
            );


        const results =
            document.querySelector(
                ".results-container, .results-dashboard, #results"
            );


        const error =
            document.querySelector(
                ".check-error, #error-state"
            );


        if (loading) {

            showElement(loading);

            loading.classList.add("active");

        }


        hideElement(results);

        hideElement(error);
    }


    /* =====================================================
       SHOW RESULTS
    ====================================================== */

    function showResults(resultsData) {

        const loading =
            document.querySelector(
                ".check-loading, #loading-state"
            );


        const resultsContainer =
            document.querySelector(
                ".results-container, .results-dashboard, #results"
            );


        const error =
            document.querySelector(
                ".check-error, #error-state"
            );


        hideElement(loading);

        hideElement(error);


        if (!resultsContainer) {

            console.error(
                "BPRIS: Results container not found."
            );

            return;
        }


        /*
         * This is the important fix.
         */

        showElement(resultsContainer);

        resultsContainer.classList.add("active");


        /*
         * Render actual scan results.
         */

        if (
            typeof window.renderPrivacyResults ===
            "function"
        ) {

            window.renderPrivacyResults(
                resultsData
            );

        } else {

            console.error(
                "BPRIS: renderPrivacyResults() not found."
            );

        }


        /*
         * Bring result into view.
         */

        setTimeout(function () {

            resultsContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);
    }


    /* =====================================================
       SHOW ERROR
    ====================================================== */

    function showError() {

        const loading =
            document.querySelector(
                ".check-loading, #loading-state"
            );


        const results =
            document.querySelector(
                ".results-container, .results-dashboard, #results"
            );


        const error =
            document.querySelector(
                ".check-error, #error-state"
            );


        hideElement(loading);

        hideElement(results);


        if (!error) return;


        showElement(error);

        error.classList.add("active");
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    window.PrivacyUI = {

        hideLoader:
            hideLoader,

        showLoading:
            showLoading,

        showResults:
            showResults,

        showError:
            showError
    };


    /* =====================================================
       INIT
    ====================================================== */

    setupLoader();
    setupScrollReveal();
    setupSmoothLinks();
    setupButtons();
    setupRadarInteraction();

})();