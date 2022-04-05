import * as React from 'react';
import '../iframe.css'
import { cleanHtml, clearFonts, getTextArray, formatText, isEmptyOrSpaces } from '../Methods'
import Context from '../Context'

export default ({ html, onloaded }: { onloaded?: () => void, html: string }) => {
    const context = React.useContext(Context);
    const [innerD, setInnerD] = React.useState(undefined as { width?: number, height: number } | undefined);
    const [content, setContent] = React.useState(undefined as string | undefined);
    const iframeRef = React.useRef(null as HTMLIFrameElement | null);
    const onloadTimer = React.useRef<any>();
    const onLoad = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        getInfo()
    }
    const getInfo = () => {
        try {
            if (iframeRef.current && iframeRef.current.contentWindow && iframeRef.current.contentWindow.document && iframeRef.current.contentWindow.document.body) {
                setInnerD({ width: undefined, height: iframeRef.current.contentWindow.document.body.scrollHeight });
                document.head.querySelectorAll("[data-temp='true']").forEach(x => x.remove()); // remove all adedd data
                if (!context.props.iframeSettings || context.props.iframeSettings.mantainScriptsAfterRendering != true) {
                    iframeRef.current.contentWindow.document.head.querySelectorAll("script").forEach(x => x.remove()); // remove all executed script
                    iframeRef.current.contentWindow.document.body.querySelectorAll("script").forEach(x => x.remove()); // remove all executed script
                }

                if (!context.props.iframeSettings || context.props.iframeSettings.maintaineStyleAfterRendering != true) {
                    iframeRef.current.contentWindow.document.head.querySelectorAll("style").forEach(x => x.remove()); // remove all executed style
                    iframeRef.current.contentWindow.document.body.querySelectorAll("style").forEach(x => x.remove()); // remove all executed style
                }
                const cn = clearFonts(iframeRef.current.contentWindow.document.body).innerHTML;
                Array.from(iframeRef.current.contentWindow.document.head.children).forEach(x => {
                    x.setAttribute("data-temp", "true");
                });
                let text = context.props.iframeSettings && context.props.iframeSettings.cleanHtml ? cleanHtml(cn, context.props.iframeSettings.indentSplitterCount || 1) : cn;
                if (context.state.fonts.textFormatter?.enabled) {
                    var txtArray = formatText(text, context.state.fonts.textFormatter.value).filter(x => !isEmptyOrSpaces(x));
                    context.state.playableText = txtArray;
                    text = txtArray.map(x => `<p style='padding-bottom:${(context.props.iframeSettings?.indentSplitterCount || 1) * 5}px'>${x}</p>`).join("\n");
                } else context.state.playableText = getTextArray(text);
                setContent(text);
            }
        } catch (e) {
            console.log(e);
        }
    }


    React.useEffect(()=> {
       setContent(undefined);
    },[context.state.fonts.textFormatter, context.state.navigationChapterController])

    React.useEffect(() => {
        clearTimeout(onloadTimer.current)
        onloadTimer.current = setTimeout(() => {
            if (onloaded) {
                onloaded();
            }
        }, 10);
        return () => clearTimeout(onloadTimer.current)
    }, [content])

    if (content) {
        if (context.state.viewPlayer) {
            return (
                <p>{context.state.textToSpeechProgress < context.state.playableText.length ? context.state.playableText[context.state.textToSpeechProgress] : ""}</p>
            )
        } else
            return (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            )
    }

    return (
        <iframe ref={iframeRef} scrolling={innerD && innerD.height > 0 ? "no" : undefined} style={innerD && innerD.height > 0 ? { height: innerD.height, overflowY: "hidden" } : undefined} height={innerD?.height} width={innerD?.width} onLoad={(e) => onLoad(e)} srcDoc={html} ></iframe>
    )
}