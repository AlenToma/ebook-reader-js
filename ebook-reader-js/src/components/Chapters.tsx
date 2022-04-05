import React from 'react'
import { BookOptions, CSSStyle, IState } from '../typings'
import { joinStyles } from '../Methods'
import Dialog from './Dialog';
import Icons from './Icons';
import Context from '../Context'

export default () => {
    var context = React.useContext(Context)

    return (
        <React.Fragment>
            <a onClick={() => context.state.viewChapters = true} title={context.state.language?.chaptersSettings?.tableOfContentIconTitle} >
                <Icons svgName="Bars" color={context.state.fonts.background?.bookMenuStyle.color || "gray"} />
            </a>
            {
                context.state.viewChapters ? (
                    <Dialog style={context.state.fonts.background?.bookMenuStyle} className={context.state.fonts.className} onclose={() => context.state.viewChapters = false} title={context.state.language?.chaptersSettings?.tableOfContentHeaderText}>
                        <div className='list chapterList'>
                            {context.props.book.chapters.map((x, i) => (
                                <a key={i} className={context.state.currentindex == i ? "selected" : ""} onClick={() => {
                                    if (context.state.currentindex === i)
                                        return;
                                    context.goTo(context.state.currentindex = i, true)
                                }}>{x.title}</a>
                            ))}
                        </div>
                    </Dialog>
                ) : null
            }
        </React.Fragment>
    )

}