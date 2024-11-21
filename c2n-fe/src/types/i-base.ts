import { CSSProperties, PropsWithChildren } from "react";

export interface ComponentBaseProps extends PropsWithChildren {
    className?: string;
    style?: CSSProperties;
}

export type Action<T = any> = (arg: T) => void