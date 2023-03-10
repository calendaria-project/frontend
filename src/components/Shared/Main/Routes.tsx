import React, { memo, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "context/AuthContextProvider";
import { BMS_HEAD, BMS_HR, BMS_SYS_ADMIN, BMS_USER } from "context/roles";

import HRDictionary from "components/Modules/HRModule/Dictionary";
import HRStaffing from "components/Modules/HRModule/Staffing";
import HRUsers from "components/Modules/HRModule/Users";
import HRUserItem from "components/Modules/HRModule/Users/userItem";
import HRMainMenu from "components/Modules/HRModule/MainMenu";
import HROrganizationStructure from "components/Modules/HRModule/OrganizationStructure";
import HRExternalUsers from "components/Modules/HRModule/ExternalUsers";

import UserUsers from "components/Modules/UserModule/Users";
import UserRequests from "components/Modules/UserModule/Requests";
import UserExternalServices from "components/Modules/UserModule/ExternalServices";
import UserInternalServices from "components/Modules/UserModule/InternalServices";
import UserInformation from "components/Modules/UserModule/Information";

import HeadUsers from "components/Modules/HeadModule/Users";
import HeadRequests from "components/Modules/HeadModule/Requests";

import ManagerRequests from "components/Modules/ManagerModule/Requests";
import ManagerUsers from "components/Modules/ManagerModule/Users";

import AdminUsers from "components/Modules/AdminModule/Users";
import AdminAudit from "components/Modules/AdminModule/Audit";

import { defineIsManagerRole } from "utils/defineRole";

const RoutesComponent = () => {
    const authContext = useContext(AuthContext);

    const GET_HR_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<HRMainMenu />} />
            <Route key="dictionary-route" path="/dictionary" element={<HRDictionary />} />
            <Route key="staffing-route" path="/staffing" element={<HRStaffing />} />
            <Route key="users-route" path="/users" element={<HRUsers />} />
            <Route key="users-item-route" path="/users/:usersId" element={<HRUserItem />} />
            <Route
                key="organizationStructure-route"
                path="/organizationStructure"
                element={<HROrganizationStructure />}
            />
            <Route key="externalUsers-route" path="/externalUsers" element={<HRExternalUsers />} />
        </>
    );

    const GET_HEAD_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<>head mainMenu</>} />
            <Route key="users-route" path="/users" element={<HeadUsers />} />
            {/*<Route key="internal-route" path="/internal" element={<>head internal services</>} />*/}
            {/*<Route key="external-route" path="/external" element={<>head external services</>} />*/}
            <Route key="requests-route" path="/requests" element={<HeadRequests />} />
            {/*<Route key="information-route" path="/information" element={<>head information</>} />*/}
        </>
    );

    const GET_ADMIN_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<>admin main menu</>} />
            <Route key="users-route" path="/users" element={<AdminUsers />} />
            <Route key="audit-route" path="/auditMenu" element={<AdminAudit />} />
        </>
    );

    const GET_MANAGER_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<>manager main menu</>} />
            <Route key="users-route" path="/users" element={<ManagerUsers />} />
        </>
    );

    const SHARED_MANAGER_AND_ADMIN_ROUTES = () => (
        <Route key="requests-route" path="/requests" element={<ManagerRequests />} />
    );

    const GET_USER_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<>user mainMenu</>} />
            <Route key="users-route" path="/users" element={<UserUsers />} />
            <Route key="internal-route" path="/internal" element={<UserInternalServices />} />
            <Route key="external-route" path="/external" element={<UserExternalServices />} />
            <Route key="requests-route" path="/requests" element={<UserRequests />} />
            <Route key="information-route" path="/information" element={<UserInformation />} />
        </>
    );

    const roles = authContext.roles;
    const getRoutes = () => {
        const routes = [];
        //from highest priority to lowest (that way it overwrites)
        if (roles.includes(BMS_HR)) {
            routes.push(GET_HR_ROUTES());
        }

        if (roles.includes(BMS_HEAD)) {
            routes.push(GET_HEAD_ROUTES());
        }

        if (roles.includes(BMS_SYS_ADMIN)) {
            routes.push(GET_ADMIN_ROUTES());
        }

        if (defineIsManagerRole(roles)) {
            routes.push(GET_MANAGER_ROUTES());
        }

        if (defineIsManagerRole(roles) || roles.includes(BMS_SYS_ADMIN)) {
            routes.push(SHARED_MANAGER_AND_ADMIN_ROUTES());
        }

        if (roles.includes(BMS_USER)) {
            routes.push(GET_USER_ROUTES());
        }

        return routes.map((route, index) => {
            return <React.Fragment key={index}>{route}</React.Fragment>;
        });
    };

    return <Routes>{getRoutes()}</Routes>;
};

export default memo(RoutesComponent);
