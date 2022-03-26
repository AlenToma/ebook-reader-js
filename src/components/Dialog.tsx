import * as React from 'react';
import { Fragment } from "react"
import { useEffect, useRef } from 'react';
import { scaleUp, scaleDown } from '../Methods'
import '../index.css';


export default ({ title, onclose, children }: { title?: string, onclose: () => void, children: any }) => {
    const element = useRef<HTMLElement>();

    const centerScreen = () => {
        if (element.current) {
            var size = element.current.getBoundingClientRect();
            element.current.style.marginTop = -size.height / 2 + "px";
            element.current.style.marginLeft = -size.width / 2 + "px";
        }
    }


    useEffect(() => {
        scaleUp(element.current, () => centerScreen());
    }, [element.current])

    const close = () => {
        scaleDown(element.current, () => {
            onclose();
        })
    }

    return (
        <Fragment>
            <div className='blur' onClick={close}></div>
            <div ref={(c) => {
                if (c)
                    element.current = c;
            }} className='popup'>
                <h1>{title || ""}
                    <a className="close" onClick={close}></a>
                </h1>
                <div>
                    {children}
                </div>
            </div>
        </Fragment>
    )

}
