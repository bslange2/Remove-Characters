// ==UserScript==
// @name         Remove < and > from Textboxes in Self Service
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes < and > from all text inputs and textareas
// @author       Brandon Lange (with help from ChatGPT)
// @match        https://selfservice.eicc.edu/Student/Planning/Advisors*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/bslange2/Remove-Characters/master/Desktop/remove_characters.js
// @updateURL    https://raw.githubusercontent.com/bslange2/Remove-Characters/master/Desktop/remove_characters.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to sanitize input by removing < and >
    function sanitizeInput(event) {
        const original = event.target.value;
        const cleaned = original.replace(/[<>]/g, '');
        if (original !== cleaned) {
            event.target.value = cleaned;
        }
    }

    // Attach listeners to all existing and future inputs/textareas
    function addSanitizer(element) {
        if (!element.dataset.sanitized) {
            element.addEventListener('input', sanitizeInput);
            element.dataset.sanitized = 'true';
        }
    }

    // Apply to current elements
    document.querySelectorAll('input[type="text"], textarea').forEach(addSanitizer);

    // Observe DOM for new elements
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.matches('input[type="text"], textarea')) {
                        addSanitizer(node);
                    }
                    node.querySelectorAll?.('input[type="text"], textarea').forEach(addSanitizer);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
