import React, { useEffect, useState } from "react"
import "keen-slider/keen-slider.min.css"
import "../index.css"

export default () => {
    const [length, setLength] = useState(50);

    const onScroll =()=> {
        setLength(document.documentElement.scrollTop);
    }

    useEffect(() => {
        setLength(document.documentElement.scrollTop);
        window.addEventListener("scroll", onScroll)

        return ()=>  window.removeEventListener("scroll", onScroll)

    }, [])
    return (
        <div style={{ top: length }} className="textEmulator">
            {
                [...Array(Math.max(50, 100))].map((_, i) => (<p key={i}></p>))
            }
        </div>
    )
}