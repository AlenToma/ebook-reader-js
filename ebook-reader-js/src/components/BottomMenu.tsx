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
        max: context.props.book.chapters.length - 1,
        stepSize: 1,
        values: [context.state.currentindex],
        onChange: (values) => {
            context.goTo(values[0], true);
        }
    });

    return (
        <div style={context.state.fonts.background?.bookMenuStyle} className={"options Bottom "}>
            <div className={context.state.fonts.className}>
                <p className='title center' style={{ color: context.state.fonts.background?.bookMenuStyle.color || "gray" }}>
                    {context.props.book.title}
                    <span className='subtitle'>
                        {context.state.currentChapter?.title}
                    </span>
                </p>
                <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <a className={!context.hasPrev() ? "disabled" : ""} style={{ marginRight: 20 }} onClick={() => context.goTo(context.state.currentindex - 1)}>
                        <Icons svgName="Next" className={"flip " + (!context.hasPrev() ? "disabled" : "")} color={context.state.fonts.background?.bookMenuStyle.color || "gray"} />
                    </a>
                    <div
                        {...getTrackProps({
                            style: {
                                height: "4px",
                                background: "#0aa8ff",
                                boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
                                borderRadius: "2px",
                                width: "80%"
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
                                })}

                            >
                                <span style={{ color: "white" }}>{
                                    ((context.state.currentindex / (context.props.book.chapters.length -1)) * 100).toFixed(0)
                                }%</span>
                            </button>
                        ))}
                    </div>
                    <a style={{ marginLeft: 20 }} className={!context.hasNext() ? "disabled" : ""} onClick={() => context.goTo(context.state.currentindex + 1, true)}>
                        <Icons svgName="Next" className={!context.hasNext() ? "disabled" : ""} color={context.state.fonts.background?.bookMenuStyle.color || "gray"} />
                    </a>
                </div>
            </div>
        </div>
    )
}