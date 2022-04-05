import React, { useEffect, useState } from 'react'
import { CSSStyle, IState } from '../typings'
import { joinStyles } from '../Methods'
import Dialog from './Dialog';
import Icons from './Icons';
import Context from '../Context';


export default ({ items, selectedValue, onRender, onselect}: {onselect: (item: any, index: number) => void, selectedValue: any, items: any[], onRender?: (item: any, index: number) => any }) => {
    const context = React.useContext(Context)
    const [viewDialog, setViewDialog] = useState(false);
    const [sValue, setSValue] = useState(selectedValue);
    useEffect(() => {
        if (viewDialog && selectedValue != sValue)
            setViewDialog(false)
    }, [selectedValue])

    const getItem = (x: any, index: number) => {
        var item = onRender?.(x, index) || x;
        return (
            <a style={{ fontSize: 20 }} onClick={() => onselect(x, index)} key={index}>{item}</a>
        )
    }
    return (
        <React.Fragment>
            <div className='select-css' onClick={() => setViewDialog(true)}>
                {
                    <span> {selectedValue}</span>
                }
            </div>
            {
                viewDialog ? (
                    <Dialog onclose={() => setViewDialog(false)} className={context.state.fonts.className} style={context.state.fonts.background?.bookMenuStyle} >
                        <div className='list'>
                            {
                                items.map((x, i) => getItem(x, i))
                            }
                        </div>
                    </Dialog>
                ) : null
            }
        </React.Fragment>
    )

}