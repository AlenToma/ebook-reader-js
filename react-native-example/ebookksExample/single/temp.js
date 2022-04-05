const requestedData = new Map();

function get(type) {
    let data = undefined;
    if (requestedData.has(type)) {
        data = requestedData.get(type)
        requestedData.delete(type);
    }
    return data;
}

async function postMessage(msg, args) {
    try {
        if (args && (typeof args !== "string" && typeof args === "object"))
            args = JSON.stringify(args);
        await window.ReactNativeWebView.postMessage(JSON.stringify({ type: msg, data: args }));
    } catch (e) {
        postMessage("ERROR", e.toString());
    }
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms || 500);
    })
}

document.addEventListener("message", function(event) {
    try {
        var data = JSON.parse(event.data);
        switch (data.type) {
            case "NovelData":
                window.novel = data.data;
                renderEbookReader();
                break;
            case "Play":
                if (!window.ebook || window.ebook.isplaying())
                    return;
                window.ebook.player.play(data);
                break;
            case "Pause":
                if (!window.ebook || !window.ebook.isplaying())
                    return;
                window.ebook.player.pause();
                break
            case "PlayNext":
                if (!window.ebook)
                    return;
                window.ebook.player.next();
                break
            case "PlayPrev":
                if (!window.ebook)
                    return;
                window.ebook.player.prev();
                break
            case "RequestedChapter":
                requestedData.set(data.type, data.data);
                break;
            case "RequestCurrentText":
                if (!window.ebook)
                    postMessage("RequestCurrentText", "");
                else postMessage("RequestCurrentText", window.ebook.player.getCurrentText());
                break;
            case "RequestIsPlaying":
                if (!window.ebook)
                    postMessage("RequestIsPlaying", "");
                else postMessage("RequestIsPlaying", window.ebook.player.isplaying());
                break;
            default:
                postMessage("LOG", data);
        }
    } catch (e) {
        postMessage("ERROR", e.toString());
    }
}, false);

async function renderEbookReader() {
    try {

        if (!novel) {
            postMessage("NovelData");
            return;
        }
        novel.book.chapters = novel.book.chapters.map(x => {
            let fn = async(ch) => {
                await postMessage("onChapterRequest", ch);
                while (!requestedData.has("RequestedChapter"))
                    await sleep(100);
                return get("RequestedChapter");
            }

            return {...x, htmlContent: fn }
        });

        await postMessage("LOG", "Loading Novel" + chapters.length);
        window.ebook = new BookReader(novel)
        window.ebook.renderTo("#book")
        const event = window.ebook.on(async(eventName, event) => {
            var data = undefined;
            if (event)
                Object.keys(event).forEach(x => {
                    if (event[x] != undefined && event[x] !== null)
                        data = event[x];
                });
            postMessage(eventName, data);
        }, "onChapterChanged", "onFontsChanged", "onScroll");

        const playerEvent = window.ebook.on(async(eventName, event) => {
            postMessage(eventName, event && event.ChapterChangedEvent ? event.ChapterChangedEvent.chapter : undefined);
        }, "OnPause", "OnPlay", "onEnd", "onProgressChanged")
        postMessage("LOG", "NovelLoaded");
    } catch (e) {
        postMessage("ERROR", e.toString());
    }
}

renderEbookReader();