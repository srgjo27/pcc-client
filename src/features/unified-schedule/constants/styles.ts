import { BriefcaseBusiness, Dumbbell, GraduationCap, MonitorCloud, User } from "lucide-react";

export const CONTEXT_STYLES: Record<string, { badge: string; accent: string }> = {
    lecture: {
        badge: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
        accent: 'border-l-4 border-l-teal-500',
    },
    work: {
        badge: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
        accent: 'border-l-4 border-l-blue-500',
    },
    business: {
        badge: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
        accent: 'border-l-4 border-l-amber-500',
    },
    personal: {
        badge: 'bg-gold-50 text-gold-800 border-gold-200 hover:bg-gold-100',
        accent: 'border-l-4 border-l-gold-500',
    },
    gym: {
        badge: 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100',
        accent: 'border-l-4 border-l-pink-500',
    },
};

export const CONTEXT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
    lecture: GraduationCap,
    work: BriefcaseBusiness,
    business: MonitorCloud,
    personal: User,
    gym: Dumbbell,
};