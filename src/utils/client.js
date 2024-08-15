export const getAgent = () => {
    const agent = window.navigator.userAgent;
    if (/MicroMessenger/.test(agent)) {
        return "wx";
    } else if (/AlipayClient/.test(agent)) {
        return "alipay";
    } else {
        return "alipay";
    }
}
