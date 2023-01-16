const getLastNameWithInitials = (firstname?: string, lastname?: string, patronymic?: string) => {
    const firstNameInitial = firstname?.[0];
    const patronymicInitial = patronymic?.[0];

    return (
        (lastname ? lastname + " " : "") +
        (firstNameInitial ? firstNameInitial + "." : "") +
        (patronymicInitial || "")
    );
};
export default getLastNameWithInitials;
