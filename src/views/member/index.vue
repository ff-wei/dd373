<template>
  <div class="page" v-if="member">
    <div class="card">
      <div class="info">
        <div class="info-header">
          <img class="info-header-avatar" :src="member.headImg"/>
          <div class="info-header-info">
            <div>{{ member.name }}</div>
            <div class="level">{{ currentLevel?.levelName }}</div>
          </div>
        </div>
        <div class="info-desc">已拥有{{ member.growth }} | 再拥有{{ upgradeGrowth - currentGrowth }}成长值可升级</div>
        <div class="info-progress">
          <span>{{ currentLevel?.levelCode }}</span>
          <van-progress class="progress" :show-pivot="false" stroke-width="5" :percentage="growthPercent"
                        track-color="#E0B57A"
                        color="#C29251"/>
          <span>{{ nextLevel?.levelCode }}</span>
        </div>
      </div>
      <div class="rows">
        <div class="row" v-for="level in vipLevels" :key="level.id">{{ level.levelCode }}{{
            level.levelName
          }}，消费可享受{{ level.discount * 10 }}折；
        </div>
      </div>
    </div>
    <div class="wallet">
      <div class="wallet-card">
        <img src="@/assets/imgs/balance.png"/>
        <div>
          <div class="price">
            <span style="font-size: 12px">¥</span>
            <span>{{ Number(member.balance / 100).toFixed(2) }}</span>
          </div>
          <div>停车余额</div>
        </div>
      </div>
      <div class="wallet-card" @click="goIntegral">
        <img src="@/assets/imgs/integral.png"/>
        <div>
          <div class="price">{{ member.integral }}</div>
          <div>我的积分</div>
        </div>
      </div>
    </div>
    <div class="change-mobile" @click="goRebind">
      <img src="@/assets/imgs/change-mobile.png"/>
      <span>换绑手机号</span>
      <img src="@/assets/imgs/arrow-right.png"/>
    </div>
  </div>
</template>

<script setup>
import useMemberStore from "@/stores/member";
import {computed, onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";
import request from "@/utils/request";

const router = useRouter();

const memberStore = useMemberStore();
const {member} = storeToRefs(memberStore);

const vipLevels = ref([]);

const loadLevels = async () => {
  const res = await request.get('/vip/levels');
  vipLevels.value = res.data || [];
}

const currentLevel = computed(() => {
  if (member.value && vipLevels.value.length) {
    return vipLevels.value.find(it => it.id === member.value.levelId);
  }
  return null;
});
const nextLevel = computed(() => {
  if (currentLevel.value) {
    return vipLevels.value.find(it => it.levelRank === currentLevel.value.levelRank + 1);
  }
  return null;
});

const upgradeGrowth = computed(() => {
  if (currentLevel.value && nextLevel.value) {
    return nextLevel.value.levelGrowth - currentLevel.value.levelGrowth;
  }
  return 0;
});
const currentGrowth = computed(() => {
  if (member.value && currentLevel.value) {
    return member.value.growth - currentLevel.value.levelGrowth;
  }
  return 0;
})
const growthPercent = computed(() => {
  console.log(currentGrowth.value, upgradeGrowth.value)
  const percent = currentGrowth.value / upgradeGrowth.value * 100;
  return percent > 100 ? 100 : percent;
});

onMounted(() => {
  memberStore.refreshMemberInfo();
  loadLevels();
})
const goRebind = () => {
  router.push({
    name: 'RebindMobile',
  })
}
const goIntegral = () => {
  router.push({
    name: 'IntegralExchange',
  })
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px 30px;
}


.card {
  width: 690px;
  border-radius: 0 0 10px 10px;
  background: #FFFFFF;
  font-size: 24px;
  font-weight: 500;
  color: #333333;

  .info {
    width: 690px;
    height: 260px;
    border-radius: 10px;
    background-image: url("@/assets/imgs/member-bg.png");
    background-size: 100%;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    padding: 30px;

    &-header {
      display: flex;

      &-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 5px solid #FFFFFF;
      }

      &-info {
        margin-left: 20px;
        font-size: 36px;
        font-weight: bold;
        color: #664630;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .level {
          min-width: 150px;
          width: auto;
          height: 32px;
          background-image: url("@/assets/imgs/vip.png");
          background-size: auto 100%;
          background-repeat: no-repeat;
          font-size: 20px;
          font-weight: 500;
          color: #664630;
          padding-left: 40px;
          padding-top: 6px;
        }
      }

    }

    &-desc {
      font-size: 20px;
      font-weight: 500;
      color: #A97835;
      margin-top: 30px;
    }

    &-progress {
      font-size: 20px;
      font-weight: 500;
      color: #A97835;
      margin-top: 10px;
      display: flex;
      align-items: center;

      .progress {
        width: 286px;
        height: 10px;
        border-radius: 5px;
        display: inline-block;
        margin: 0 10px;
      }
    }
  }

  .rows {
    padding: 35px 30px;

    .row {
      position: relative;
      padding-left: 20px;
      line-height: 50px;

      &:before {
        content: ' ';
        position: absolute;
        width: 10px;
        height: 10px;
        left: 0;
        top: 20px;
        background: #CCCCCC;
        border-radius: 5px;

      }
    }
  }
}

.wallet {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  &-card {
    width: 330px;
    height: 160px;
    background: #FFFFFF;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333333;

    img {
      width: 130px;
      height: 130px;
      margin-right: 10px;
    }

    .price {
      font-family: DIN-Bold;
      font-size: 36px;
      margin-bottom: 10px;
    }
  }
}

.change-mobile {
  width: 690px;
  height: 100px;
  margin-top: 30px;
  padding: 0 25px;
  border-radius: 10px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 500;
  color: #333333;

  img:first-of-type {
    width: 36px;
    height: 36px;
    margin-right: 15px;
  }

  img:last-of-type {
    margin-left: auto;
    width: 12px;
  }
}
</style>