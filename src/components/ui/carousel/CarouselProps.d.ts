import { GlobalProps } from "~/material"

export type CorouselProps = {
        autoplay?: boolean
        autoplaySpeed?: number
        dotPostion?:string
        leftArrow?: any//JSXElement 
        leftArrowModifier?: {}
        rightArrow?: any//JSXElement    
        rightArrowModifier?: {}
        showArrows?: boolean 
        showDots?:boolean
        showFade?:boolean
        infinite?: boolean
        speed?: number
        easing?: string
        effect?: "scrolls" | "fade"
        // eslint-disable-next-line no-unused-vars
        afterChange?: (current: number) => void
        // eslint-disable-next-line no-unused-vars
        beforeChange?: (current: number) => void
        waitForAnimate?: boolean
} & GlobalProps 
 

