/* =========================================================
   PRIVACY CHECK — APPLICATION CONTROLLER
========================================================= */

(function () {
    "use strict";


    /* =====================================================
       MAIN PRIVACY CHECK
    ===================================================== */

    async function startPrivacyCheck() {

        const checkArea =
            document.querySelector("#check-area");

        if (!checkArea) {
            return;
        }


        try {

            /*
             * Move user to the analysis section.
             */
            checkArea.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            /*
             * Show premium loading state.
             */
            PrivacyUI.showLoading();


            /*
             * Small delay so the loading state is
             * actually visible to the user.
             */
            await wait(850);


            /*
             * Run the real browser privacy checks.
             */
            const results =
                await PrivacyCheck.run();


            /*
             * Display results.
             */
            PrivacyUI.showResults(results);


        } catch (error) {

            console.error(
                "Privacy Check Error:",
                error
            );

            PrivacyUI.showError();
        }
    }


    /* =====================================================
       DELAY HELPER
    ===================================================== */

    function wait(milliseconds) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    milliseconds
                );
            }
        );
    }


    /* =====================================================
       BUTTON HANDLER
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "#start-check, #run-check, #run-again, #retry-check"
                );


            if (!button) {
                return;
            }


            /*
             * Prevent accidental double-clicks
             * while a check is already running.
             */
            if (
                button.dataset.busy === "true"
            ) {
                return;
            }


            button.dataset.busy = "true";


            startPrivacyCheck()
                .finally(function () {

                    /*
                     * The result screen creates
                     * a new Run Again button, so the
                     * old button can safely be released.
                     */
                    if (button.isConnected) {
                        button.dataset.busy = "false";
                    }
                });
        }
    );


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            /*
             * Enter / Space naturally activate
             * real <button> elements, so no custom
             * keyboard handling is required.
             *
             * This listener only prevents accidental
             * page scrolling when Space is pressed
             * on one of our action buttons.
             */

            const active =
                document.activeElement;


            if (
                !active ||
                !active.matches(
                    "#start-check, #run-check, #run-again, #retry-check"
                )
            ) {
                return;
            }


            if (
                event.key === " " ||
                event.key === "Spacebar"
            ) {
                event.preventDefault();
            }
        }
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.startPrivacyCheck =
        startPrivacyCheck;

})();