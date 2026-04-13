import { Show, type JSX } from "solid-js"
import { useAuthForm } from "./auth-context"

export type AuthErrorMessageProps = {
  class?: string
  children?: JSX.Element
}

export const AuthErrorMessage = (props: AuthErrorMessageProps) => {
  const { error } = useAuthForm()

  return (
    <Show when={error()}>
      <div class={props.class}>
        {props.children}
      </div>
    </Show>
  )
}
