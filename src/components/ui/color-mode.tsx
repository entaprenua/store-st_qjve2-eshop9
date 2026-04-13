import { isServer } from "solid-js/web"
import { ColorModeProvider, ColorModeScript, createCookieStorageManager, useColorMode } from "@kobalte/core/color-mode"
import type { ParentComponent } from "solid-js"

function getServerCookies() {
  "use server"
  try {
    const { getCookie } = require("vinxi/http")
    const colorMode = getCookie("kb-color-mode")
    return colorMode ? `kb-color-mode=${colorMode}` : ""
  } catch {
    return ""
  }
}

export const ColorMode: ParentComponent = (props) => {
  const storageManager = createCookieStorageManager(isServer ? getServerCookies() : document.cookie)

  return (
    <>
      <ColorModeScript storageType="cookie" storageKey="kb-color-mode" />
      <ColorModeProvider storageManager={storageManager}>
        {props.children}
      </ColorModeProvider>
    </>
  )
}

export { useColorMode }
