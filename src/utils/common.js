import dayjs from "dayjs";

export const formatCarNo = carNo => {
    return carNo.slice(0, 2) + '·' + carNo.slice(2)
}
const fillZero = (num, n) => {
    return (Array(n).join(0) + num).slice(-n);
}
export const formatTimeFromNow = (d, containSeconds = true) => {
    return formatTimeFrom(dayjs(), d, containSeconds);
};
export const formatTimeFrom = (d1, d2, containSeconds = true) => {
    if (!d1) {
        return '-';
    }
    const du = dayjs.duration(dayjs(d1) - dayjs(d2), 'milliseconds'),
        days = parseInt(du.asDays('days')),
        hours =du.get('hours'),
        mins = du.get('minutes'),
        ss = du.get('seconds');
    if (hours <= 0 && mins <= 0 && ss <= 0) {
        return `00时00分${containSeconds ? '00秒' : ''}`
    } else {
        let base = `${fillZero(days,(days+"").length)}天${fillZero(hours, 2)}时${fillZero(mins, 2)}分`;
        if (containSeconds) {
            base += `${fillZero(ss, 2)}秒`;
        }
        return base;
    }
};
