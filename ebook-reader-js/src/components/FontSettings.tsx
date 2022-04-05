import React from 'react'
import { CSSStyle, IState } from '../typings'
import { joinStyles } from '../Methods'
import Dialog from './Dialog';
import Icons from './Icons';
import Context from '../Context';
import DropDown from './DropDown';
import objectUseState from '@alentoma/usestate'
import TextFormatter from './TextFormatter';

export default ({ saveFontSettings }: { saveFontSettings: (item: CSSStyle) => void }) => {
    const context = React.useContext(Context);
    const state = objectUseState({
        viewFonts: false,
        viewFontLineHeight: false,
        viewFontSize: false,
        ViewFontsMargin: false,
    })
    return (
        <React.Fragment>
            <a onClick={() => context.state.viewFontSettings = true} title={context.state.language?.fontsSettings?.fontsIconTitle}>
                <Icons svgName="FontSettings" color={context.state.fonts.background?.bookMenuStyle.color || "gray"} />
            </a>
            {
                context.state.viewFontSettings ? (
                    <Dialog className={context.state.fonts.className} style={context.state.fonts.background?.bookMenuStyle} onclose={() => context.state.viewFontSettings = false} title={context.state.language?.fontsSettings?.fontsHeaderText}>
                        <div className='form fontSettings'>
                            <div>
                                <label>{context.state.language?.fontsSettings.chooseFontLabel}:</label>
                                <DropDown selectedValue={context.state.fonts.title} items={context.state.fontSettings?.fonts || []} onRender={(x) => x.title} onselect={(x) => saveFontSettings({ className: x.className })} />
                            </div>


                            <div>
                                <label>{context.state.language?.fontsSettings.fontLineHeightLabel}:</label>
                                <DropDown selectedValue={((context.state.fonts.lineHeight || 1) * 100) + "%"} items={context.state.fontSettings?.lineHeights || []} onRender={(x) => (((x || 1) * 100) + "%")} onselect={(x) => saveFontSettings({ lineHeight: x })} />

                            </div>

                            <div>
                                <label>{context.state.language?.fontsSettings.fontSizeLabel}:</label>
                                <DropDown selectedValue={context.state.fonts.fontSize} items={context.state.fontSettings?.fontSizes || []} onselect={(x) => saveFontSettings({ fontSize: x })} />
                            </div>
                            <div>
                                <label>{context.state.language?.fontsSettings.marginLeftRightLabel}:</label>
                                <DropDown selectedValue={context.state.fonts.paddingLeft} items={context.state.fontSettings?.marginLeftRight || []} onselect={(x) => saveFontSettings({ paddingLeft: x })} />
                            </div>
                            {
                                context.state.fonts.textFormatter ? (
                                    <div>
                                        <label>{context.state.language.fontsSettings.textFormaterEnabledLabel}</label>
                                        <input type="checkbox" checked={context.state.fonts.textFormatter.enabled || false} onChange={() => {
                                            if (context.state.fonts.textFormatter)
                                                saveFontSettings({ textFormatter: { ...context.state.fonts.textFormatter, enabled: !context.state.fonts.textFormatter.enabled } });
                                        }} />

                                    </div>
                                ) : null
                            }

                            {
                                context.state.fonts.textFormatter?.enabled ? (
                                    <TextFormatter saveFontSettings={saveFontSettings} />
                                ) : null
                            }

                            {
                                !context.state.fontSettings.lockNavigationChapterController ? (
                                    <div>
                                        <label>{context.state.language?.fontsSettings.navigationChapterControllerLabel}:</label>
                                        <div>
                                            <a onClick={() => context.state.navigationChapterController = "Scroll"}><Icons color="gray" svgName="Scroll" className={context.state.navigationChapterController === "Scroll" ? "selected" : ""} /></a>
                                            <a onClick={() => context.state.navigationChapterController = "Swaper"}><Icons color="gray" className={"rotateRight " + (context.state.navigationChapterController === "Swaper" ? "selected" : "")} svgName="Scroll" /></a>
                                        </div>
                                    </div>
                                ) : null
                            }
                            <div>
                                <label>{context.state.language?.fontsSettings.backgroundStyleLabel}:</label>
                                <div className='fontBackground'>
                                    {
                                        context.state.fontSettings?.background?.map((x, index) => (
                                            <a key={index} className={(context.state.fonts.background?.name === x.name ? "selected" : "")} onClick={() => saveFontSettings({ background: x })} style={{ background: x.chapterStyle.background, backgroundColor: x.chapterStyle.backgroundColor, color: x.chapterStyle.color }}> {x.name} </a>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </Dialog>
                ) : null
            }
        </React.Fragment>
    )
}