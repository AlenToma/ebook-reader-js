import React from "react";
import '../fonts.css'
import * as SVG from "../images/Svgs";

export default ({ svgName, color, className }: { svgName: "Scroll" | "Bars" | "FontSettings" | "Close" | "Next" | "Pause" | "Play" | "PlayNext" | "PlayPrev" | "Player", color: string, className?: string }) => {
    return (
        SVG[svgName]({color: color, className: className})
    )
}