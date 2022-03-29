import React, { useEffect } from 'react'
import { CSSStyle, IState } from '../typings'
import { joinStyles } from '../Methods'
import Dialog from './Dialog';
import Icons from './Icons';
import Context from '../Context';
import FontsSettingsComponent from './FontSettings';
import ChapterComponents from './Chapters'

export default ({ saveFontSettings }: { saveFontSettings: (item: CSSStyle) => void }) => {
    const context = React.useContext(Context);
    return (
        <div style={context.state.fonts.background?.bookMenuStyle} className={"options " + (context.props.bookMenu && context.props.bookMenu.position ? context.props.bookMenu.position : "Right")}>
            <div style={context.props.bookMenu && context.props.bookMenu.position == "Top" ? {
                minWidth: (context.props.bookMenu.chapterButtonDisabled !== true ? 35 : 0) + (context.props.bookMenu.fontsButtonDisabled !== true ? 35 : 0) + ((context.props.bookMenu.buttons || [])?.length * 35)
            } : undefined}>
                <div className={context.state.fonts.className}>
                    {
                        context.props.bookMenu?.playerButtonDisabled !== true ? (
                            <a onClick={() => context.state.viewPlayer = !context.state.viewPlayer} title={context.state.language?.player.playerIconTitle} >
                                <Icons svgName="Player" color={context.state.fonts.background?.bookMenuStyle.color || "gray"} />
                            </a>
                        ) : null
                    }
                    {
                        !context.props.bookMenu || context.props.bookMenu.chapterButtonDisabled !== true ? (
                            <ChapterComponents />
                        ) : null
                    }
                    {
                        !context.props.bookMenu || context.props.bookMenu.fontsButtonDisabled !== true ? (
                            <FontsSettingsComponent saveFontSettings={saveFontSettings} />
                        ) : null
                    }
                    {
                        context.props.bookMenu && context.props.bookMenu.buttons ? (
                            context.props.bookMenu.buttons.map((x, index) => (
                            <a className={x.className} onClick={x.action} title={x.title} key={index}> {
                                typeof x.icon === "string" ? <img src={x.icon} /> : x.icon
                            } </a>
                            ))
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}