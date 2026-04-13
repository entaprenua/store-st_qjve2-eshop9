import { Show, type JSX } from "solid-js"
import { useMpesa } from "./mpesa-context"

export type MpesaStatusMessageProps = {
  class?: string
  children?: JSX.Element
}

export const MpesaStatusMessage = (props: MpesaStatusMessageProps) => {
  const { status, error } = useMpesa()

  return (
    <Show when={status() !== "idle"}>
      <div class={props.class}>
        {props.children}
      </div>
    </Show>
  )
}

export const MpesaStatusWaiting = (props: { class?: string; children?: JSX.Element }) => {
  const { status } = useMpesa()

  return (
    <Show when={status() === "waiting"}>
      <div class={props.class}>
        {props.children ?? "Enter PIN on your phone to complete payment"}
      </div>
    </Show>
  )
}

export const MpesaStatusProcessing = (props: { class?: string; children?: JSX.Element }) => {
  const { status } = useMpesa()

  return (
    <Show when={status() === "processing"}>
      <div class={props.class}>
        {props.children ?? "Processing payment..."}
      </div>
    </Show>
  )
}

export const MpesaStatusSuccess = (props: { class?: string; children?: JSX.Element }) => {
  const { status } = useMpesa()

  return (
    <Show when={status() === "success"}>
      <div class={props.class}>
        {props.children ?? "Payment successful!"}
      </div>
    </Show>
  )
}

export const MpesaStatusFailed = (props: { class?: string; children?: JSX.Element }) => {
  const { status, error } = useMpesa()

  return (
    <Show when={status() === "failed"}>
      <div class={props.class}>
        {props.children ?? error() ?? "Payment failed"}
      </div>
    </Show>
  )
}
