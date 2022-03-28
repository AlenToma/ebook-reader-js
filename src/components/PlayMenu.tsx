import React from 'react'
import { BookOptions, CSSStyle, IState } from '../typings'
import { joinStyles } from '../Methods'
import Dialog from './Dialog';
import Icons from './Icons';
import Context from '../Context'
import { useRanger } from "react-ranger";

export default () => {
    var context = React.useContext(Context)
    const { getTrackProps, handles } = useRanger({
        min: 0,
        max: context.state.playableText.length - 1,
        stepSize: 1,
        values: [context.state.textToSpeechProgress || 0],
        onChange: (values) => {
            context.play(values[0], true);
        }
    });

    if (!context.state.viewPlayer)
        return null;
    const hasNext = context.state.textToSpeechProgress + 1 < context.state.playableText.length;
    const hasPrev = context.state.textToSpeechProgress - 1 >= 0;
    return (
        <div style={context.state.fonts.background?.bookMenuStyle} className={"options PlayTop animate " +( context.state.viewBookMenu ? "" : " alone")}>
            <div className={context.state.fonts.className}>
                <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div
                        {...getTrackProps({
                            style: {
                                height: "4px",
                                background: "#0aa8ff",
                                boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
                                borderRadius: "2px",
                                width: "80%",
                                marginLeft:22,
                            }
                        })}
                    >
                        {handles.map(({ getHandleProps }) => (
                            <button
                                {...getHandleProps({
                                    style: {
                                        width: "40px",
                                        height: "23px",
                                        outline: "none",
                                        background: "red",
                                        border: "0",
                                        display: "grid",
                                        padding: "0.5em 0px 0.6em 0px",
                                        justifyContent: "center",
                                        fontSize: 11
                                    }
                                })}>
                                <span style={{ color: "white" }}>{
                                    ((context.state.textToSpeechProgress / (context.state.playableText.length -1)) * 100).toFixed(0)
                                }%</span>
                            </button>
                        ))}
                    </div>

                    <a style={{ marginLeft: 20 }} className={!hasPrev ? "disabled" : ""} onClick={() => context.playPrev()}>
                        <Icons svgName="PlayPrev" className={!hasPrev ? "disabled" : ""} color={context.state.fonts.background?.playerStyle.color || "gray"} />
                    </a>

                    <a style={{ marginLeft: 20 }} onClick={() => context.state.playing ? context.pause() : context.play(context.state.textToSpeechProgress)}>
                        <Icons svgName={!context.state.playing ? "Play" : "Pause"} color={context.state.fonts.background?.playerStyle.color || "gray"} />
                    </a>

                    <a style={{ marginLeft: 20 }} className={!hasNext ? "disabled" : ""} onClick={() => context.playNext()}>
                        <Icons svgName="PlayPrev" className={(!hasNext ? "disabled" : "") + " flip"} color={context.state.fonts.background?.playerStyle.color || "gray"} />
                    </a>


                </div>
            </div>
        </div>
    )
}