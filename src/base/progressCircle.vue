<template>
    <div class="progress-circle">
        <svg width="32" height="32" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
            <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" stroke-dasharray="100"></circle>
        </svg>
        <slot></slot>
    </div>
</template>

<script>
export default {
  
}
</script>
<style scoped>
.progress-circle{
    position: relative;
}
.progress-circle circle{
    stroke-width: 8px;
    -webkit-transform-origin: center;
    transform-origin: center;
}
.progress-circle circle.progress-background{
    -webkit-transform: scale(.9);
    transform: scale(.9);
    stroke: #31c27c77;
}
.progress-circle circle.progress-bar{
    -webkit-transform: scale(.9) rotate(-90deg);
    transform: scale(.9) rotate(-90deg);
    stroke: #31c27c;
}
</style>
