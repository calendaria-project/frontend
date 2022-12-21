import React, { memo, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Dictionary from "components/Modules/HRModule/Dictionary";
import Staffing from "components/Modules/HRModule/Staffing";
import HRUsers from "components/Modules/HRModule/Users";
import UserItem from "components/Modules/HRModule/Users/userItem";
import MainMenu from "components/Modules/HRModule/MainMenu";
import OrganizationStructure from "components/Modules/HRModule/OrganizationStructure";
import ExternalUsers from "components/Modules/HRModule/ExternalUsers";
import { AuthContext } from "context/AuthContextProvider";
import { BMS_ADMIN, BMS_HEAD, BMS_HR, BMS_USER } from "context/roles";
import UserUsers from "components/Modules/UserModule/Users";
import HeadUsers from "components/Modules/HeadModule/Users";

const RoutesComponent = () => {
    const authContext = useContext(AuthContext);

    const GET_USER_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<>user mainMenu</>} />
            <Route key="users-route" path="/users" element={<UserUsers />} />
            <Route key="incoming-route" path="/incoming" element={<>user incoming</>} />
            <Route key="outgoing-route" path="/outgoing" element={<>user outgoing</>} />
            <Route key="requests-route" path="/requests" element={<>user requests</>} />
            <Route key="information-route" path="/information" element={<>user information</>} />
        </>
    );

    const GET_HEAD_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<>head mainMenu</>} />
            <Route key="users-route" path="/users" element={<HeadUsers />} />
            <Route key="incoming-route" path="/incoming" element={<>head incoming</>} />
            <Route key="outgoing-route" path="/outgoing" element={<>head outgoing</>} />
            <Route key="requests-route" path="/requests" element={<>head requests</>} />
            <Route key="information-route" path="/information" element={<>head information</>} />
        </>
    );

    const GET_HR_ROUTES = () => (
        <>
            <Route key="mainMenu-route" path="/" element={<MainMenu />} />
            <Route key="dictionary-route" path="/dictionary" element={<Dictionary />} />
            <Route key="staffing-route" path="/staffing" element={<Staffing />} />
            <Route key="users-route" path="/users" element={<HRUsers />} />
            <Route key="users-item-route" path="/users/:usersId" element={<UserItem />} />
            <Route
                key="organizationStructure-route"
                path="/organizationStructure"
                element={<OrganizationStructure />}
            />
            <Route key="externalUsers-route" path="/externalUsers" element={<ExternalUsers />} />
        </>
    );

    const roles = authContext.roles;
    const getRoutes = () => {
        if (roles.includes(BMS_ADMIN)) {
            return <></>;
        } else {
            const routes = [];
            //from highest priority to lowest (that way it overwrites)
            if (roles.includes(BMS_HR)) {
                routes.push(GET_HR_ROUTES());
            }
            if (roles.includes(BMS_HEAD)) {
                routes.push(GET_HEAD_ROUTES());
            }
            if (roles.includes(BMS_USER)) {
                routes.push(GET_USER_ROUTES());
            }

            return routes.map((route, index) => {
                return <React.Fragment key={index}>{route}</React.Fragment>;
            });
        }
    };

    return <Routes>{getRoutes()}</Routes>;
};
export default memo(RoutesComponent);
