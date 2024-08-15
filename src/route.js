import {createRouter, createWebHistory} from "vue-router";
import {getToken, goAuthUrl} from "@/utils/auth";
import useMemberStore from "@/stores/member";


const routes = [
    {
        path: "/",
        name: "Home",
        meta: {
            title: '停车云',
        },
        component: () => import("@/views/home")
    },
    {
        path: "/register",
        name: "Register",
        meta: {
            title: "注册",
        },
        component: () => import("@/views/register")
    },
    {
        path: "/member",
        name: "Member",
        meta: {
            title: "会员中心",
            needPhone: true
        },
        component: () => import("@/views/member")
    },
    {
        path: "/cars",
        name: "Cars",
        meta: {
            title: "我的车辆",
        },
        component: () => import("@/views/cars")
    },
    {
        path: "/cars/add",
        name: "AddCar",
        meta: {
            title: "添加车辆",
        },
        component: () => import("@/views/cars/add")
    },
    {
        path: "/records",
        name: "Records",
        meta: {
            title: "停车记录",
        },
        component: () => import("@/views/records")
    },
    {
        path: "/invoices",
        name: "Invoices",
        meta: {
            title: "电子发票",
        },
        component: () => import("@/views/invoices")
    },
    {
        path: "/invoices/open",
        name: "OpenInvoice",
        meta: {
            title: "开电子发票",
            keepAlive: true,
        },
        component: () => import("@/views/invoices/open")
    },
    {
        path: "/invoices/head/add",
        name: "AddInvoiceHead",
        meta: {
            title: "开电子发票",
            keepAlive: true,
        },
        component: () => import("@/views/invoices/add-head")
    },
    {
        path: "/coupon/my",
        name: "CouponList",
        meta: {
            title: "我的卡券",
        },
        component: () => import("@/views/coupon/my")
    },
    {
        path: "/coupon/send",
        name: "SendCoupon",
        meta: {
            title: "赠送卡券",
            needPhone: true,
        },
        component: () => import("@/views/coupon/send")
    },
    {
        path: "/coupon/receive",
        name: "ReceiveCoupon",
        meta: {
            title: "领取优惠券",
        },
        component: () => import("@/views/coupon/receive")
    },
    {
        path: "/gift",
        name: "GiftReceive",
        meta: {
            title: "领取卡券",
            needPhone: true,
        },
        component: () => import("@/views/coupon/gift")
    },
    {
        path: "/activities",
        name: "Activities",
        meta: {
            title: "领券中心",
        },
        component: () => import("@/views/activity/list")
    },
    {
        path: "/activity",
        name: "ActivityDetail",
        meta: {
            title: "领券详情",
        },
        component: () => import("@/views/activity/detail")
    },
    {
        path: "/coupon/center",
        name: "Activity",
        meta: {
            title: "领券中心",
        },
        component: () => import("@/views/activity/list")
    },
    {
        path: "/pay/channel",
        name: "PayChannel",
        meta: {
            title: "停车缴费",
        },
        component: () => import("@/views/pay/channel")
    },
    {
        path: "/channel_pay",
        name: "PayChannel1",
        meta: {
            title: "停车缴费",
        },
        component: () => import("@/views/pay/channel")
    },
    {
        path: "/pay/confirm",
        name: "PayConfirm",
        meta: {
            title: "停车缴费",
        },
        component: () => import("@/views/pay/confirm")
    },
    {
        path: "/pay/success",
        name: "PaySuccess",
        meta: {
            title: "缴费成功",
            ignoreAuth: true
        },
        component: () => import("@/views/pay/success")
    },
    {
        path: "/in_park",
        name: "InPark",
        meta: {},
        component: () => import("@/views/inpark")
    },
    {
        path: "/member/rebind",
        name: "RebindMobile",
        meta: {
            needPhone: true,
            title: '换绑手机号'
        },
        component: () => import("@/views/member/rebind")
    },
    {
        path: "/member/integral",
        name: "IntegralExchange",
        meta: {
            needPhone: true,
            title: '积分兑换'
        },
        component: () => import("@/views/member/integral")
    },
    {
        path: "/member/goods",
        name: "GoodsDetail",
        meta: {
            needPhone: true,
            title: '兑换详情'
        },
        component: () => import("@/views/member/goods")
    },
    {
        path: "/member/integral-record",
        name: "IntegralRecord",
        meta: {
            needPhone: true,
            title: '积分记录'
        },
        component: () => import("@/views/member/integral-record")
    },
    {
        path: "/authing",
        name: "Authing",
        meta: {
            ignoreAuth: true
        },
        component: () => import("@/views/authing")
    },

];
const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach(async (to, from, next) => {
    const memberStore = useMemberStore();
    if (to.meta.ignoreAuth) {
        next();
    } else {
        if (!getToken()) {
            await goAuthUrl(to.query.mc, to.fullPath, false)
        } else {
            if (to.meta.title) {
                document.title = to.meta.title;
            }
            if (to.meta.needPhone) {
                const member = await memberStore.getMemberInfo();
                if (member) {
                    next();
                } else {
                    if (to.meta.needPhone) {
                        await goAuthUrl(to.query.mc, to.fullPath, true);
                    } else {
                        next();
                    }
                }
            } else {
                next()
            }

        }

    }

});


export default router;
