"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";

export function initLogRocket() {
    const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;

    if (typeof window !== "undefined" && appId) {
        LogRocket.init(appId);
    }
}

export default function LogRocketProvider() {
    useEffect(() => {
        initLogRocket();
    }, []);

    return null;
}
