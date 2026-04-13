import { Show, type JSX } from "solid-js"
import { useMpesa } from "./mpesa-context"
import { Spinner } from "../spinner"

export type MpesaLoadingProps = {
  class?: string
  children?: JSX.Element
}

export const MpesaLoading = (props: MpesaLoadingProps) => {
  const { isLoading, status } = useMpesa()

  return (
    <Show when={isLoading() || status() === "waiting" || status() === "processing"}>
      <div class={props.class}>
        {props.children ?? (
          <div class="flex items-center gap-2">
            <Spinner class="size-4" />
            <span>
              {status() === "waiting" ? "Waiting for confirmation..." : "Processing..."}
            </span>
          </div>
        )}
      </div>
    </Show>
  )
}
