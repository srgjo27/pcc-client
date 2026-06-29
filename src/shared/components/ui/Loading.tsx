import React from 'react';
import { useLanguage } from "@/shared/hooks/useLanguage"
import { LoaderCircle } from "lucide-react";

export const Loading: React.FC = () => {
    const { lang } = useLanguage();

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#26A69A]" />
                <span className="text-sm text-slate-500">{lang === 'id' ? 'Mohon tunggu...' : 'Please wait...'}</span>
            </div>
        </div>
    );
}