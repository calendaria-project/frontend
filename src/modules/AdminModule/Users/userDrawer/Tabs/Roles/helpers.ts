import _ from "lodash";
import { ITempRoleData } from "./tempData";

export const checkIsContainRole = (arrRoles: ITempRoleData[], role: ITempRoleData) =>
    arrRoles.some((roleEl) => _.isEqual(roleEl, role));

export const getFilteredRoles = (arrRoles: ITempRoleData[], role: ITempRoleData) =>
    arrRoles.filter((roleEl) => !_.isEqual(roleEl, role));
