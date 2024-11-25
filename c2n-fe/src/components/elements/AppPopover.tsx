import type { TooltipPlacement } from "antd/es/tooltip";
import type { ComponentBaseProps } from "@/types/i-base";

import { Popover } from "antd";

export interface AppPopoverProps extends ComponentBaseProps {
    content: string;
    wrap?: boolean;
    placement?: TooltipPlacement;
}

export default function AppPopover(props: AppPopoverProps) {
    const content = <div className="text-white cursor-pointer">{props.content}</div>;

    return (
        <Popover content={content} placement={props.wrap ? props.placement || "top" : undefined} color="#000">
            {props.wrap ? <div className="inline-block w-full">{props.children}</div> : props.children}
        </Popover>
    );
}
