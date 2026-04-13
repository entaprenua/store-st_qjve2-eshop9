import { JSX, Show } from "solid-js"
import { A, useNavigate } from "@solidjs/router"
import { routes } from "~/lib/utils/routes"
import { Button } from "~/components/ui/button"
import { Flex } from "~/components/ui/flex"
import { Box } from "~/components/ui/box"
import { Text } from "~/components/ui/text"
import ArrowLeftIcon from "lucide-solid/icons/arrow-left"
import HomeIcon from "lucide-solid/icons/home"

type AdminHeaderProps = {
  title: string
  description?: string
  backLink?: string
  onBack?: () => void
  showHome?: boolean
  actions?: JSX.Element
}

export function AdminHeader(props: AdminHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (props.onBack) {
      props.onBack()
    } else if (props.backLink) {
      navigate(props.backLink)
    }
  }

  return (
    <Flex class="items-center justify-between mb-6">
      <Flex class="items-center gap-2">
        <Show when={props.backLink !== undefined || props.onBack !== undefined}>
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft />
          </Button>
        </Show>
        <Show when={props.showHome}>
          <A href={routes.home} class="flex items-center">
            <Button variant="ghost" size="icon">
              <Home />
            </Button>
          </A>
        </Show>
        <Box>
          <Text class="text-2xl font-semibold">{props.title}</Text>
          <Show when={props.description}>
            <Text class="text-muted-foreground text-sm">{props.description}</Text>
          </Show>
        </Box>
      </Flex>
      <Show when={props.actions}>
        {props.actions}
      </Show>
    </Flex>
  )
}
