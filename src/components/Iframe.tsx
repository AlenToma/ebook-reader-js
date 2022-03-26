import * as React from 'react';
import '../iframe.css'
import { cleanHtml, clearFonts } from '../Methods'
import { IframeSettings } from '../typings';

export default ({ html, iframeSettings, onloaded }: { onloaded?: () => void, html: string, iframeSettings?: IframeSettings }) => {
    const [innerD, setInnerD] = React.useState(undefined as { width?: number, height: number } | undefined);
    const [content, setContent] = React.useState(undefined as string | undefined);
    const iframeRef = React.useRef(null as HTMLIFrameElement | null);
    const onLoad = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        getInfo()
    }

    const getInfo = () => {
        if (iframeRef.current && iframeRef.current.contentWindow && iframeRef.current.contentWindow.document && iframeRef.current.contentWindow.document.body) {
            setInnerD({ width: undefined, height: iframeRef.current.contentWindow.document.body.scrollHeight });
            document.head.querySelectorAll("[data-temp='true']").forEach(x => x.remove()); // remove all adedd data
            if (!iframeSettings || iframeSettings.mantainScriptsAfterRendering != true) {
                iframeRef.current.contentWindow.document.head.querySelectorAll("script").forEach(x => x.remove()); // remove all executed script
                iframeRef.current.contentWindow.document.body.querySelectorAll("script").forEach(x => x.remove()); // remove all executed script
            }

            if (!iframeSettings || iframeSettings.maintaineStyleAfterRendering != true) {
                iframeRef.current.contentWindow.document.head.querySelectorAll("style").forEach(x => x.remove()); // remove all executed style
                iframeRef.current.contentWindow.document.body.querySelectorAll("style").forEach(x => x.remove()); // remove all executed style
            }
            const cn = clearFonts(iframeRef.current.contentWindow.document.body).innerHTML;
            Array.from(iframeRef.current.contentWindow.document.head.children).forEach(x => {
                x.setAttribute("data-temp", "true");
            });

            setContent(iframeSettings && iframeSettings.cleanHtml ? cleanHtml(cn) : cn);
        }
    }

    React.useEffect(() => {
        if (onloaded)
            onloaded();
    }, [content])

    if (content)
        return (<div dangerouslySetInnerHTML={{ __html: content }} />)

    return (
        <iframe ref={iframeRef} scrolling={innerD && innerD.height > 0 ? "no" : undefined} style={innerD && innerD.height > 0 ? { height: innerD.height, overflowY: "hidden" } : undefined} height={innerD?.height} width={innerD?.width} onLoad={(e) => onLoad(e)} srcDoc={html} ></iframe>
    )
}