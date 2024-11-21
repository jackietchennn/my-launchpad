import { Spin } from "antd";

import { ComponentBaseProps } from "@/types/i-base";
import { useAppSelector } from "@/redux/store";

export interface PageLoaderProps extends ComponentBaseProps {}

const PageLoader = (props: PageLoaderProps) => {
    const pageLoading = useAppSelector((state) => state.global.pageLoading);

    return <Spin spinning={pageLoading}>{props.children}</Spin>;
};

export default PageLoader;
