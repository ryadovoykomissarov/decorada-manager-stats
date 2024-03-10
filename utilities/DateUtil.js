import moment from "moment";

export const getDate = async () => {
    const now = new Date();
    const localizedDate = now.toLocaleString();
    let date = localizedDate.split(' ')[0];
    date = date.substring(0, date.length - 1);
    return date;
}

export const substractFromCurrent = async (value) => {
    let datetime = moment().subtract(value, 'days');
    let date = datetime.format('yyyy-MM-DD')
    return date;
}

export const addToCurrent = async (value) => {
    let datetime = moment().subtract(value, 'days');
    let date = datetime.format('yyyy-MM-DD')
    return date;
}

export const shortenUtc = async (utcDateTime) => {
    let utcDate = utcDateTime.split('T')[0];
    let day = utcDate.split('-')[2];
    let month = utcDate.split('-')[1];
    let year = utcDate.split('-')[0];
    if (day[0] == '0') day.substring(1);
    if (month[0] == '0') month.substring(1);
    let orderDate = day + '.' + month + '.' + year;
    return orderDate;
}

export const validateRange = async (rangeStart, rangeEnd) => {
    let rangeStartDate = new Date(rangeStart);
    let rangeEndDate = new Date(rangeEnd);

    let startValid = await validateDate(rangeStart);
    let endValid = await validateDate(rangeEnd);

    if(startValid && endValid) {
        if (rangeEndDate > rangeStartDate) return true;
        else return "Дата начала периода должна быть раньше, чем дата конца периода. Попробуйте запустить команду снова"
    } else if (!startValid && typeof startValid === "string") {
        if (startValid == "date_in_future") return "Невозможно отобразить статистику на период, включающий дату из будущего. Попробуйте запустить команду снова";
        else if(startValid == "bad_format") return "Неверный формат даты. Попробуйте запустить команду снова и ввести дату в формате 'день.месяц.год', например '01.01.2024'";
        else return "Неизвестная ошибка. Попробуйте запустить команду снова"
    } else if(!endValid && typeof startValid === "string") {
        if (endValid == "date_in_future") return "Невозможно отобразить статистику на период, включающий дату из будущего. Попробуйте запустить команду снова";
        else if(endValid == "bad_format") return "Неверный формат даты. Попробуйте запустить команду снова и ввести дату в формате 'день.месяц.год', например '01.01.2024'";
        else return "Неизвестная ошибка. Попробуйте запустить команду снова"
    }
}

export const validateDate = async (input) => {
    let dateObj = new Date(input);
    if(!isNaN(dateObj)) {
        let day = dateObj.getDate();
        day = day < 10 ? "0" + day : day;
        let month = dateObj.getMonth();
        month = month < 10 ? "0" + month : month;
        const year = dateObj.getFullYear();

        const resultDate = `${day}.${month}.${year}`;

        let currentDate = await getDate()
        if(currentDate < dateObj) {
            return "date_in_future";
            // return "Невозможно отобразить статистику на период, включающий дату из будущего. Попробуйте запустить команду снова";
        } else {
            return true;
        } 
    } else return "bad_format"
    // } else return "Неверный формат даты. Попробуйте запустить команду снова и ввести дату в формате 'день.месяц.год', например '01.01.2024'"
}