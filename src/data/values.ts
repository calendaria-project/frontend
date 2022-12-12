export const ALL = "ALL";
export const ARCHIVE = "ARCHIVE";
export const ACTIVE = "ACTIVE";

export const SALARY_VARIABLE_PART = "salaryVariablePart";
export const SALARY_CONSTANT_PART = "salaryConstantPart";
export const SALARY_VARIABLE_PERCENT = "salaryVariablePercent";
export const SALARY_CONSTANT_PERCENT = "salaryConstantPercent";
export const SALARY = "salary";

export const CONTRACT = "CONTRACT";
export const SUB_CONTRACT = "SUB_CONTRACT";
export type TContracts = typeof CONTRACT | typeof SUB_CONTRACT;

export const SHORTENED_CONTRACT_ARRAY = [CONTRACT, SUB_CONTRACT];
