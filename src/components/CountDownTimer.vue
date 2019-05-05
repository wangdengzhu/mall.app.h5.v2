<template>
    <span>{{timeText}}</span>
</template>

<script>
    export default{
        props: {
            seconds: [String, Number]
        },
        data(){
            return{
                timeNum : this.seconds,
                timerId : null
            }
        },
        computed: {
            timeText(){
                return this.timeChange(this.timeNum);
            }
        },
        methods: {
            timeFormat(str){
		    	return str >= 10 ? str : '0' + str;
            },
            timeChange(seconds){
		    	let min = Math.floor(seconds / 60);
		    	let sec = Math.floor(seconds % 60);
		    	return this.timeFormat(min) + ':' + this.timeFormat(sec);
            },
            countDown(){
                if(this.timeNum <= 0){
                    this.$emit('timeend');
                    return;
                }
                this.timerId = setInterval( () => {
                    this.timeNum--;
                    if(this.timeNum == 0){
                        clearInterval(this.timerId);
                        this.$emit('timeend');
                    }
                }, 1000)
            }
        },
        mounted(){
            this.countDown();           
        }
    }
</script>

<style lang="postcss" scoped>

</style>


