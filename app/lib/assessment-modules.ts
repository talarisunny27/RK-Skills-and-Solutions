export const ASSESSMENT_MODULES = {
    "VERBAL ABILITY": ["Basic Level", "Level 1", "Level 2", "Level 3"],
    "QUANTITATIVE APTITUDE": ["Basic Level", "Level 1", "Level 2", "Level 3"],
    "LOGICAL REASONING": ["Basic Level", "Level 1", "Level 2", "Level 3"],
} as const;

export type AssessmentModule = keyof typeof ASSESSMENT_MODULES;

export const DEFAULT_ASSESSMENT_MODULE: AssessmentModule = "VERBAL ABILITY";

export function normalizeAssessmentModule(moduleName: string): AssessmentModule {
    return moduleName in ASSESSMENT_MODULES
        ? (moduleName as AssessmentModule)
        : DEFAULT_ASSESSMENT_MODULE;
}

export function getSubmodulesForModule(moduleName: string): string[] {
    return [...ASSESSMENT_MODULES[normalizeAssessmentModule(moduleName)]];
}
