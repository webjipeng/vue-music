<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper">
                <div class="progress-btn" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd"></div>
            </div>
        </div>
    </div>
</template>

<script>
const progressBtnWidth=16

export default {
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    created(){
        this.touch={}
    },
    methods:{
        progressTouchStart(e){
            this.touch.initiated=true
            this.touch.startX=e.touches[0].pageX
            this.touch.left=this.$refs.progress.clientWidth
        },
        progressTouchMove(e){
            if(!this.touch.initiated) return
            const deltaX=e.touches[0].pageX-this.touch.startX
            const offsetWidth=Math.min(this.$refs.progressBar.clientWidth-progressBtnWidth,Math.max(0,this.touch.left+deltaX))
            this.$refs.progress.style.width=offsetWidth+'px'
            this.$refs.progressBtn.style.transform=`translate3d(${offsetWidth}px,0,0)`
        },
        progressTouchEnd(){
            this.touch.initiated=false
            this._togglePercent()
        },
        progressClick(e){
            const rect=this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth=e.pageX-rect.left
            this.$refs.progress.style.width=offsetWidth+'px'
            this.$refs.progressBtn.style.transform=`translate3d(${offsetWidth}px,0,0)`
            this._togglePercent()
        },
        _togglePercent(){
            
            const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
            const percent=this.$refs.progress.clientWidth/barWidth
            this.$emit('percentChange',percent)
        }
    },
    watch:{
        percent(newPercent){
            if(newPercent>=0 && !this.touch.initiated){
                const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
                const offsetWidth=newPercent*barWidth
                this.$refs.progress.style.width=offsetWidth+'px'
                this.$refs.progressBtn.style.transform=`translate3d(${offsetWidth}px,0,0)`
            }
        }
    }
}
</script>

<style scoped>
.progress-bar{
    height: 30px;
}
.bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0,0,0,.3);
}
.progress{
    position: absolute;
    height: 100%;
    background: #31c27c;
}
.progress-btn-wrapper{
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;
}
.progress-btn{
    position: relative;
    top: 7px;
    left: 7px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 3px solid #fff;
    border-radius: 50%;
    background: #31c27c;
}
</style>


