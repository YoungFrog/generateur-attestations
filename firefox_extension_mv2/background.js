chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        const {responseHeaders} = details;
        let originAllowed = false

        responseHeaders.forEach((h) => {
            const name = h.name.toLowerCase();
            if (name === "access-control-allow-headers" && !h.value.includes('authorization')) {
                h.value += ",authorization"; // must be explicitly added, see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Allow-Headers#sect
            }
            if (name === "access-control-allow-origin") {
                originAllowed = true // sometimes it is included by gesetu (with OPTIONS), sometimes not (with POST)
            }
        });

        if (!originAllowed) // allow our origin for this request
            responseHeaders.push({
                name: "access-control-allow-origin",
                value: new URL(details.originUrl).origin 
            })

        return { responseHeaders } // beware : the modifications here will not be seen in the dev tools.
    },
    {
        urls: ["http://gesetu.intranet.he2b.be/jsonrpc.php"]
    },
    ["blocking", "responseHeaders"]
);
