import {
    ALL_ROLES,
    BMS_1C_MANAGER,
    BMS_HEAD,
    BMS_OFFICE_MANAGER,
    BMS_SYS_ADMIN
} from "context/roles";

export const defineIsHeadRole = (roles: typeof ALL_ROLES) => roles.includes(BMS_HEAD);

export const defineIsManagerRole = (roles: typeof ALL_ROLES) =>
    roles.includes(BMS_OFFICE_MANAGER) ||
    roles.includes(BMS_1C_MANAGER) ||
    roles.includes(BMS_SYS_ADMIN);
