import { MouseEventHandler } from "react";
import { Spin } from "antd";
import { noop } from "antd/es/_util/warning";

import { ComponentBaseProps } from "@/types/i-base";
import { mergeClassName } from "@/utils/shared";

export interface BasicButtonProps extends ComponentBaseProps {
    loading?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function BasicButton(props: BasicButtonProps) {
    return (
        <button
            className={mergeClassName([
                "w-[254px] h-[54px] rounded-lg border-0 bg-[#ffb852] text-white text-center leading-[54px] cursor-pointer hover:bg-[#3eeb7a] hover:brightness-105",
                props.loading && "cursor-not-allowed",
                props.disabled && "cursor-not-allowed bg-[#666] hover:bg-[#666]",
                props.className,
            ])}
            style={props.style}
            onClick={(!props.loading && !props.disabled && props.onClick) || noop}
        >
            {props.loading ? (
                <>
                    <Spin></Spin>
                    <span className="ml-[10px]">{props.children}</span>
                </>
            ) : (
                <span>{props.children}</span>
            )}
        </button>
    );
};
