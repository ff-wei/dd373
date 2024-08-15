import {defineStore} from 'pinia'
import request from "@/utils/request";

const useMemberStore = defineStore('member', {
    state: () => {
        return {
            member: null,
        }
    },
    actions: {
        async getMemberInfo() {
            try {
                if (!this.member) {
                    await this.refreshMemberInfo();
                }
                return this.member;
            } catch (error) {
                console.log(error)
            }
        },
        async refreshMemberInfo() {
            try {
                const res = await request.get('/account/member');
                if (res.data) {
                    const {member, account} = res.data;
                    this.member = {
                        ...member,
                        balance: account.balance,
                        integral: account.integral,
                        growth: account.growth,
                        levelId: account.levelId,
                    };
                }
            } catch (e) {
                console.log(e);
            }
        },
    },
})
export default useMemberStore;