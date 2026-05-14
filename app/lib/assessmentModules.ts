import { Assessment } from "@/app/lib/types";

const DEFAULT_MODULES = ["English", "Aptitude", "Mathematics", "Technical", "Other"];

function normalizeModuleName(value: string | null | undefined): string {
    const normalized = value?.trim();
    return normalized && normalized.length > 0 ? normalized : "Other";
}

function inferModuleName(test: Assessment): string {
    const text = `${test.title} ${test.description}`.toLowerCase();

    if (
        text.includes("english") ||
        text.includes("grammar") ||
        text.includes("verbal") ||
        text.includes("reading") ||
        text.includes("comprehension") ||
        text.includes("vocabulary")
    ) {
        return "English";
    }

    if (
        text.includes("aptitude") ||
        text.includes("quant") ||
        text.includes("reasoning") ||
        text.includes("logical") ||
        text.includes("numerical") ||
        text.includes("arithmetic")
    ) {
        return "Aptitude";
    }

    if (
        text.includes("math") ||
        text.includes("mathematics") ||
        text.includes("calculus") ||
        text.includes("algebra") ||
        text.includes("geometry") ||
        text.includes("trigonometry")
    ) {
        return "Mathematics";
    }

    if (
        text.includes("coding") ||
        text.includes("programming") ||
        text.includes("java") ||
        text.includes("react") ||
        text.includes("next") ||
        text.includes("spring") ||
        text.includes("technical")
    ) {
        return "Technical";
    }

    return "Other";
}

export function resolveAssessmentModule(test: Assessment): string {
    return normalizeModuleName(test.module || inferModuleName(test));
}

export function withResolvedModules(tests: Assessment[]): Assessment[] {
    return tests.map((test) => ({
        ...test,
        module: resolveAssessmentModule(test),
    }));
}

export function getModuleOptions(tests: Assessment[]): string[] {
    const resolved = withResolvedModules(tests).map((test) => normalizeModuleName(test.module));
    return Array.from(new Set([...DEFAULT_MODULES, ...resolved]));
}
