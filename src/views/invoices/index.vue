<template>
    <van-tabs v-model:active="currentIdx" :items="tabs" color="#2462EF">
        <van-tab v-for="tab in tabs" :name="tab.name" :title="tab.label"/>
    </van-tabs>
    <van-pull-refresh v-model="refreshing" @refresh="loadData(true)" class="list-wrapper">
        <van-list :loading="loading" :finished="pageInfo.finished" @load="loadData" v-if="loading||dataSource.length"
                  finished-text="没有更多了">
            <div class="record" v-for="order in dataSource" :key="order.id">
                <div class="header">
                    <span>{{ order.orderNo }}</span>
                    <span style="color: #F21646" v-if="order.invoiceStatus===1">待开票</span>
                    <span style="color: #5ED8B1" v-if="order.invoiceStatus===2">开票中</span>
                    <span style="color: #2462EF" v-if="order.invoiceStatus===3">已开票</span>
                    <span style="color: #F21646" v-if="order.invoiceStatus===4">开票失败</span>
                </div>
                <div class=" divider"/>
                <div class="body">
                    <div class="body-left">
                        <div class="car-no">{{
                            formatCarNo(order.carNo)
                            }}
                        </div>
                        <div class="time">{{ dayjs(order.startTime).format('YYYY-MM-DD HH:mm') }}</div>
                        <div class="price">￥{{ Number(order.actualFee / 100).toFixed(2) }}</div>
                    </div>
                    <div class="body-right">
                        <button class="btn" @click="open(order)" v-if="[1,4].includes(order.invoiceStatus)">{{
                            order.invoiceStatus === 1 ? '去开票' : '重新开票'
                            }}
                        </button>
                        <button class="ghost-btn" @click="view(order)" v-if="order.invoiceStatus===3">发票详情</button>
                    </div>
                </div>
            </div>
        </van-list>
        <empty :img="emptyImg" tip="暂无开票记录～" hasTab v-if="!loading&&!dataSource.length"/>
    </van-pull-refresh>

</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import Empty from "@/components/empty";
import request from "@/utils/request";
import emptyImg from "@/assets/imgs/no-record.png";
import {useRouter} from "vue-router";
import {formatCarNo} from "@/utils/common";
import dayjs from "dayjs";
import {closeToast, showLoadingToast, showToast} from "vant";

const tabs = [
    {name: 0, label: '全部'},
    {name: 1, label: '待开票'},
    {name: 2, label: '开票中'},
    {name: 3, label: '已开票'}
];
const router = useRouter();
const currentIdx = ref(0);
const dataSource = ref([]);
const loading = ref(false);
const refreshing = ref(false);

const pageInfo = reactive({
    size: 5,
    current: 0,
    finished: false
});

onMounted(() => {
    loadData(true);
})

watch(currentIdx, () => {
    pageInfo.current = 0;
    pageInfo.finished = false;
    dataSource.value = [];
    loadData(true);
});

const loadData = async (isRefresh) => {
    try {
        let invoiceStatus = currentIdx.value;
        if (invoiceStatus === 0) {
            invoiceStatus = null;
        }
        if (isRefresh) {
            refreshing.value = true;
        } else {
            loading.value = true
        }
        const res = await request.post('/order/my', {
            size: pageInfo.size,
            current: isRefresh ? 1 : (pageInfo.current + 1),
            orderStatus: 2,
            invoiceStatus
        });
        const {records, pages, current} = res.data;
        if (isRefresh) {
            dataSource.value = records;
        } else {
            dataSource.value.push(...records)
        }
        pageInfo.finished = current >= pages
        pageInfo.current = current
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false;
        refreshing.value = false;
    }
}
const open = (order) => {
    router.push({
        name: 'OpenInvoice',
        query: {
            orderId: order.id,
            fee: order.actualFee
        }
    })
}

const view = async order => {
    try {
        showLoadingToast('正在打开');
        const res = await request.get(`/order/${order.id}/invoice`);
        if (typeof res.data === 'string' && res.data.startsWith("http")) {
            window.location.href = res.data;
        }
    } catch (e) {
        showToast(e.msg);
    } finally {
        closeToast()
    }
}

</script>

<style lang="scss" scoped>
.list-wrapper {
  min-height: calc(100vh - 100px);
}

.record {
  margin-top: 30px;
  width: 690px;
  background: #FFFFFF;
  border-radius: 10px;
  margin-left: 30px;
  padding: 0 30px 25px;

  .header {
    padding: 23px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      &:first-of-type {
        font-size: 28px;
        font-weight: bold;
        color: #000000;
      }

      &:last-of-type {
        font-size: 24px;
        font-weight: 500;
      }
    }
  }

  .divider {
    width: 630px;
    height: 1px;
    background: #E8E8E8;
  }

  .body {
    padding-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: end;

    &-left {
      .car-no {
        font-size: 28px;
        font-weight: bold;
        color: #333333;
      }

      .time {
        font-size: 20px;
        font-weight: bold;
        color: #999999;
        margin-top: 25px;
      }

      .price {
        font-size: 28px;
        font-weight: bold;
        color: #F24545;
        margin-top: 25px;
      }
    }

    &-right {
      .btn {
        height: 60px;
        line-height: 60px;
        padding: 0 40px;
        background: $primary-color;
        border-radius: 30px;
        font-size: 28px;
        font-weight: bold;
        color: #FFFEFE;
      }

      .ghost-btn {
        @extend .btn;
        background: #FFFFFF;
        border: 1px solid $primary-color;
        color: $primary-color;
      }
    }
  }


}
</style>