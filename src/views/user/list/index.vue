<template>
  <div class="user_list con">
    <x-table :req="userList" :filterDict="searchDict">
      <template v-slot:myTable="table">
        <a-table
          :data-source="table.data"
          :pagination="false"
          :columns="coloumns"
          :scroll="{
            x: `1200px`,
            y: `calc(${table.tableH}px - 100px)`,
          }"
        >
        </a-table>
      </template>
    </x-table>
  </div>
</template>
<script setup lang="ts">
import { userList } from "@/api";
import { coloumns, searchDict } from "./dict";
</script>
<style lang="less" scoped>
.box {
  color: #60d659;
}
</style>
