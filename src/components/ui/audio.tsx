import { splitProps, type JSX } from "solid-js"
import { cn } from "~/lib/utils"

type AudioProps = JSX.HTMLAttributes<HTMLAudioElement> & {
  src?: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
}

const Audio = (props: AudioProps) => {
  const [local, others] = splitProps(props, [
    "src", "class", "autoplay", "controls", "loop", "muted"
  ])
  
  return (
    <audio
      src={local.src}
      autoplay={local.autoplay}
      controls={local.controls ?? true}
      loop={local.loop}
      muted={local.muted}
      class={cn("w-full", local.class)}
      {...others}
    />
  )
}

export { Audio }
export type { AudioProps }
