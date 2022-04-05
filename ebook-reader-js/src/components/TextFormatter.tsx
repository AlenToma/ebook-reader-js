import React from 'react'
import { BookOptions, CSSStyle, IState } from '../typings'
import { joinStyles } from '../Methods'
import Dialog from './Dialog';
import Icons from './Icons';
import Context from '../Context'
import { useRanger } from "react-ranger";

export default ({ saveFontSettings }: { saveFontSettings: (item: CSSStyle) => void }) => {
    var context = React.useContext(Context)
    const { getTrackProps, handles } = useRanger({
        min: context.state.fonts.textFormatter?.minTextCounter || 100,
        max: context.state.fonts.textFormatter?.maxTextCounter || 800,
        stepSize: 20,
        values: [context.state.fonts.textFormatter?.value || 100],
        onChange: (values) => {
            if (context.state.fonts.textFormatter)
                saveFontSettings({ textFormatter: { ...context.state.fonts.textFormatter, value: values[0] } });
        }
    });

    return (
        <div>
            <label>{context.state.language.fontsSettings.textFormaterValueLabel}</label>
            <div
                {...getTrackProps({
                    style: {
                        height: "4px",
                        background: "#0aa8ff",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
                        borderRadius: "2px",
                        width: "100%",
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
                            context.state.fonts.textFormatter?.value
                        }</span>
                    </button>
                ))}
            </div>
        </div>
    )
}