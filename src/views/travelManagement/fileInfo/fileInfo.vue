<template>
    <div class="upload-file">
        <div>
            <p>旅行合同上传：</p>
            <Upload>
                <img src="@/assets/svg/upload.svg" alt="" />
                <div class="tips">点击或将文件拖拽到这里上传</div>
                <div class="extension">支持扩展名：.doc .docx .pdf .jpg</div>
            </Upload>
        </div>
        <a-button type="primary">签署合同</a-button>
    </div>
    <div class="upload-file">
        <div>
            <p>旅行合同上传：</p>
            <Upload>
                <img src="@/assets/svg/upload.svg" alt="" />
                <div class="tips">点击或将文件拖拽到这里上传</div>
                <div class="extension">支持扩展名：.doc .docx .pdf .jpg</div>
            </Upload>
        </div>
    </div>
    <div class="upload-file">
        <div>
            <p>旅行合同上传：</p>
            <Upload>
                <img src="@/assets/svg/upload.svg" alt="" />
                <div class="tips">点击或将文件拖拽到这里上传</div>
                <div class="extension">支持扩展名：.doc .docx .pdf .jpg</div>
            </Upload>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import Upload from '@/components/common/Upload.vue'
    const props = defineProps({
        onCheck: {
            type: Boolean
        }
    })
</script>
<style lang="less" scoped>
    
    .upload-file {
        display: flex;
        align-items: flex-end;
        margin: 0 20px;
        border-bottom: 1px solid #F1F2F5;
        padding-bottom: 16px;
        &:last-of-type {
            border-bottom: none;
            margin-bottom: 100px;
        }
        button {
            margin-left: 56px;
        }
        p {
            color: #9DA0A4;
            font-size: 16px;
        }
        .tips {
            color: #1E2226;
            font-size: 12px;
            margin: 20px 0 8px;
        }
        .extension {
            color: #C8C9CC;
            font-size: 12px;
        }
        ::v-deep(.ant-upload-drag) {
            border: 1px dashed #D3D4D6;
            background-color: #F9FAFC;
        }
    }
</style>