import { splitProps, type JSX } from "solid-js"
import { cn } from "~/lib/utils"

type VideoProps = JSX.HTMLAttributes<HTMLVideoElement> & {
  src?: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
}

const Video = (props: VideoProps) => {
  const [local, others] = splitProps(props, [
    "src", "class", "autoplay", "controls", "loop", "muted", "poster"
  ])
  
  return (
    <video
      src={local.src}
      poster={local.poster}
      autoplay={local.autoplay}
      controls={local.controls ?? true}
      loop={local.loop}
      muted={local.muted ?? local.autoplay}
      class={cn("size-full object-cover", local.class)}
      {...others}
    />
  )
}

export { Video }
export type { VideoProps }
