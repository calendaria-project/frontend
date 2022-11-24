export const phonePattern = new RegExp(/^\+7\(\d{3}\)\d{3}(-\d{2})(-\d{2})$/);
export const mailPattern = new RegExp(
    /^(([^<>()\[\]\\.,;:ЁёА-я\s@"]+(\.[^<>()\[\]\\.,;:ЁёА-я\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([A-Za-z\-0-9]+\.)+[A-Za-z]{2,}))$/
);
export const mailMessage = "Введите почту в формате example@google.com";
export const phoneMessage = "Введите номер в формате +7(xxx)xxx-xx-xx";
