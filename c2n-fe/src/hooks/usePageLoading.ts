import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setLoading } from "@/redux/modules/global";
import PageLoader from "@/containers/PageLoader/PageLoader";

export const usePageLoading = () => {
    const dispatch = useAppDispatch();
    const pageLoading = useAppSelector((state) => state.global.pageLoading);

    const setPageLoading = (_loading?: boolean) => dispatch(setLoading(_loading ?? !pageLoading));

    const waitForEntireLoading = (data: any[]) => {
        const isEmpty = (val: any) => {
            if (val === undefined || val === null) {
                return false;
            }
            if (typeof val === "object" && JSON.stringify(val) === "{}") {
                return false;
            }

            return true;
        };

        data.every(isEmpty) && setPageLoading(false);
    };

    return {
        pageLoading,

        PageLoader,
        setPageLoading,
        waitForEntireLoading,
    };
};
