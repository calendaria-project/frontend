import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import Dictionary from "components/Dictionary";
import Staffing from "components/Staffing";
import StaffingItem from "components/Staffing/staffingItem";
import Users from "components/Users";
import UserItem from "components/Users/userItem";
import MainMenu from "components/MainMenu";
import OrganizationStructure from "components/OrganizationStructure";
import ExternalUsers from "components/ExternalUsers";

const RoutesComponent = () => {
    return (
        <Routes>
            <Route key="mainMenu-route" path="/" element={<MainMenu />} />
            <Route key="dictionary-route" path="/dictionary" element={<Dictionary />} />
            <Route key="staffing-route" path="/staffing" element={<Staffing />} />
            <Route
                key="staffing-item-route"
                path="/staffing/:staffingId"
                element={<StaffingItem />}
            />
            <Route key="users-route" path="/users" element={<Users />} />
            <Route key="users-item-route" path="/users/:usersId" element={<UserItem />} />
            <Route
                key="organizationStructure-route"
                path="/organizationStructure"
                element={<OrganizationStructure />}
            />
            <Route key="externalUsers-route" path="/externalUsers" element={<ExternalUsers />} />
        </Routes>
    );
};
export default memo(RoutesComponent);
