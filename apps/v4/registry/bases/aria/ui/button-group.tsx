import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Separator } from "@/registry/bases/aria/ui/separator"

const buttonGroupVariants = cva(
  "cn-button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "cn-button-group-orientation-horizontal [&>*:not(:first-child)_[data-slot]]:rounded-l-none [&>*:not(:first-child)_[data-slot]]:border-l-0 [&>*:not(:last-child)_[data-slot]]:rounded-r-none [&>[data-slot]:not(:first-child)]:rounded-l-none [&>[data-slot]:not(:first-child)]:border-l-0 [&>[data-slot]:not(:last-child)]:rounded-r-none",
        vertical:
          "cn-button-group-orientation-vertical flex-col [&>*:not(:first-child)_[data-slot]]:rounded-t-none [&>*:not(:first-child)_[data-slot]]:border-t-0 [&>*:not(:last-child)_[data-slot]]:rounded-b-none [&>[data-slot]:not(:first-child)]:rounded-t-none [&>[data-slot]:not(:first-child)]:border-t-0 [&>[data-slot]:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & {
  render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
}) {
  if (render) {
    const renderProps = {
      "data-slot": "button-group-text",
      className: cn(
        "cn-button-group-text flex items-center [&_svg]:pointer-events-none",
        className
      ),
      ...props,
    }

    return render(renderProps)
  }

  return (
    <div
      data-slot="button-group-text"
      className={cn(
        "cn-button-group-text flex items-center [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "cn-button-group-separator relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
