import * as React from 'react';
import { Fragment } from "react"
import { useEffect, useRef } from 'react';
import Icons from './Icons'
import '../index.css';
import Body from './Body';
import {joinStyles} from '../Methods'


export default ({ title, onclose, children, style, className }: {className?: string, style?: React.CSSProperties, title?: string, onclose: () => void, children: any }) => {
    const element = useRef<HTMLElement>();
    const scrollPosition = useRef(0)
    const [zIndex, setZindex] = React.useState((document.querySelectorAll(".popup.show").length + 1) * 200)
    const centerScreen = () => {
        if (element.current) {
            var size = element.current.getBoundingClientRect();
            element.current.style.marginTop = -size.height / 2 + "px";
            element.current.style.marginLeft = -size.width / 2 + "px";
        }
    }

    const onScroll = () => {
        if (element.current) {
            scrollPosition.current = (element.current.children[1] as HTMLDivElement).scrollTop;
        }
    }
    useEffect(() => {
        setTimeout(() => {
            element.current?.classList.add("show")
        }, 500);

        if (element.current) {
            (element.current.children[1] as HTMLDivElement).addEventListener("scroll", onScroll);
        }

        return () => {
            if (element.current)
                (element.current.children[1] as HTMLDivElement).removeEventListener("scroll", onScroll)
        }

    }, [element.current])


    const close = () => {
        if (element.current)
            element.current.classList.remove("show");
        setTimeout(() => {
            onclose();

        }, 600);
    }

    useEffect(() => {
        if (element.current)
            (element.current.children[1] as HTMLDivElement).scrollTop = scrollPosition.current;
    })

    return (
        <Body>
            <div className='blur' style={{zIndex: zIndex -1}} onClick={close}></div>
            <div style={joinStyles(style,{zIndex: zIndex})} ref={(c) => {
                if (c)
                    element.current = c;
            }} className={"popup "}>
                <h1 className={className}>{title || ""}
                    <a className="close" onClick={close}>
                        <Icons color='red' svgName='Close' />
                    </a>
                </h1>
                <div className={className}>
                    {children}
                </div>
            </div>
        </Body>
    )

}
