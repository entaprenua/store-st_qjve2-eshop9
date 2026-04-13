import { clientOnly } from "@solidjs/start"
import { Suspense } from "solid-js";
import { ColorMode } from "~/components/ui/color-mode"

// TODO: SSR support is temporarily disabled.
// SSR fix is in progress.
export default clientOnly(async () => ({ default: Home }), { lazy: true })


function Home(props) {
  return (
    <ColorMode>
      <Suspense fallback={
        <div class="flex items-center justify-center h-[calc(100vh-5rem)]">
          <div class="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }>
        {props.children}
      </Suspense>
    </ColorMode>
  )
}

