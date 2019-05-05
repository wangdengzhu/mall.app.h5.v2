<template>
	<div class="evaluate-wrapper">		
        <div class="start-evaluate">
            <div class="goods-wrap">
                <div class="goods-pic tb1px">
                    <img :src="goodsinfo.goodslistpicurl.replace('^^', '.')" alt="">
                </div>
                <div class="goods-info">
                    <div class="goods-top">
                        <p class="goods-name">{{goodsinfo.title}}</p>
                        <p class="goods-spec">{{goodsinfo.spec}}</p>
                    </div>
                    <div class="goods-bot">
                        <div class="left">
                            <p class="price">￥{{goodsinfo.salesprice}}</p>
                            <p class="num">x{{goodsinfo.qty}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="evaluate">
                <div class="score-wrap tb1px">
                    <span class="name">评分</span>
                    <div class="star-wrap" @touchstart="touchstart" @touchmove="touchmove">
                        <span v-for="(star, index) in 5" :data-idx="index" :key="star.id" :class="{'active': index < starNum}" @click="mark"></span>
                    </div>
                    <span class="level">{{level[starNum - 1]}}</span>
                </div>
                <div class="edit-region">
                    <div class="text-wrap">
                        <textarea v-model="text" @input="limitTextNum" placeholder="您的评价是对我们最大的肯定~"></textarea>
                        <div class="limit-tips" :class="{'limit-over': text.length >= 500}">({{text.length}}/500)</div>
                    </div>
                    <div class="imgs-list" @click="showImgView">
                        <div class="img-wrap" v-for="(item, index) in imageUrls" :key="item.id" :class="{'isLoading' : imgIsLoading && (index == imageUrls.length-1)}">
                            <img :src="item" alt="">
                            <span class="close" v-show="(!!imageUrls[index])" @click.stop="removeImage(index)"></span>
                        </div>
                        <div class="add-img-btn" v-if="imageUrls.length < 9" @click.stop="uploadImageMethod">
                            <img src="../../../assets/images/evaluation/camera.png" alt="">
                            <p>添加图片</p>
                            <!-- <input type="file" class="file-inp" accept="image/*" @change="changeImage($event)"> -->
                        </div>
                    </div>
                </div>
                <div class="anonymity">
                    <div>
                        <input type="checkbox" id="check_box" :checked="anonymity == 1 ? !0 : !1">
                        <label for="check_box" @click="isAnonymity"><i></i>匿名评价</label>
                    </div>
                    <p class="tips">勾选后评价将以匿名方式展现</p>
                </div>
                <div class="btn" @click="submitForm">提交</div>
            </div>
        </div>
	</div>	
</template>
<script>
    import { getAppType, InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
	import { Evaluate } from '@/apis/';
	import Swiper from 'swiper/dist/js/swiper.min';
	import '@/assets/styles/swiper.css';
	import Indicator from '@/components/common/indicator';
	import Toast from '@/components/common/toast';
	import EXIF from 'exif-js';
    import { compressImg, dataURLtoBlob } from '@/utils/imageManage';
    
    const MAX_NUM = 10;
	const MAX_IMG_SIZE = MAX_NUM * 1024 * 1024;   //10MB
	const UPLOAD_SIZE = 0.2 * 1024 * 1024  //   200KB， 如果小于200KB，直接上传不压缩
    const VALID_TYPE = /jpeg|jpg|png|gif/;   //支持的图片格式

    const PAGE_SIZE = 10;
    const STAR_NUM = 5;
    
	export default {
		data(){
			return {
                anonymity: !1,
                goodsinfo: {},
                level: ['差', '一般', '满意', '很满意', '非常满意'],
                text: '',
                imageUrls : [],
				imagePlaceUrl : '',
                imgIsLoading : false,
                starNum: STAR_NUM,
				showBigImg : false,
                mySwiper : null,
                pendingComment: [],
                paramObj : {
                    'pageIndex' : 1,
                    'pageSize' : PAGE_SIZE
				},
				dataIsLoading: false, 
				pageIsLoading : true,
                dataIsLoadend : false,
                appVersion: null,
                isshow: 0,
                isUpLoading: false,
                initFlag: false,
                starParams: {}
			}
        },
		methods:{
            touchstart(e) {
                if(e.target.classList[0] !== 'active') {
                    console.log('不滑动')
                    return false;
                }else {
                    console.log('滑动开始')
                }
            },
            touchmove(e) {
                let endX = e.changedTouches[0].pageX;
                let endY = e.changedTouches[0].pageY;
                if(endY > this.starParams.bottomBorder || endY < this.starParams.topBorder) {
                    console.log('Y方向出边界')
                }else if(endX > this.starParams.rightBorder || endX < this.starParams.leftBorder) {
                    console.log('X方向出边界')
                }else {
                    // 判断move之后距离左边界的位置
                    let leftDistance = endX - this.starParams.leftBorder
                    // 判断所在区域即星星的个数
                    let num = Math.ceil(leftDistance / this.starParams.perWidth);
                    this.starNum = num > 1 ? num : 1;
                }
            },
            getStarWrapBorders() {
                let starWrap = document.querySelector('.star-wrap');
                this.starParams = Object.assign({}, {
                    topBorder: starWrap.offsetTop,
                    rightBorder: starWrap.offsetLeft + starWrap.offsetWidth,
                    bottomBorder: starWrap.offsetTop + starWrap.offsetHeight,
                    leftBorder: starWrap.offsetLeft,
                    perWidth: starWrap.offsetWidth / STAR_NUM
                })
            },
            init() {
                this.appVersion = getAppType();
                this.getGoodsInfo();
                this.showAlertNativeMethod();
                this.$nextTick(() => {
                    this.getStarWrapBorders();
                });
                window.AppUpLoadFile = (str) => {
                    var progress = str;
                    var value = '';
                    var arr = str.split(',');
                    if (arr.length > 1) {
                        progress = arr[0];
                        value = arr[1];
                    }
                    this.isUpLoading = true;
                    //上传前
                    if (progress == 'beforeupload') {
                        this.imgIsLoading = true;
                        this.imageUrls.push(this.imagePlaceUrl);
                    }
                    //上传中
                    else if (progress == 'uploading') {
                    }
                    //上传成功
                    else if (progress == 'success') {
                        this.imageUrls.pop();
                        if (this.imageUrls.length < 9) {
                            this.imageUrls.push(value);
                            this.isUpLoading = false;
                            this.imgIsLoading = false;
                        }
                    }
                    //上传出错
                    else if (progress == 'error') {
                        this.isUpLoading = false;
                        this.imgIsLoading = false;
				        this.imageUrls.pop();
                        
                        Toast('上传失败')
                    }
                }
            },
            limitTextNum() {
                // 特殊机型maxlength不起作用
                this.text = this.text.slice(0, 500);
            },
            mark(e) {
                this.starNum = e.currentTarget.getAttribute('data-idx') - 0 + 1;
            },
            isAnonymity() {
                this.anonymity = !this.anonymity;
            },
            getGoodsInfo() {
                Object.assign(this.goodsinfo, this.parseQueryString(window.location.href));
            },
            parseQueryString(url) {
                var obj = {};
                var keyvalue = [];
                var key = "",
                    value = "";
                var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
                for (var i in paraString) {
                    keyvalue = paraString[i].split("=");
                    key = keyvalue[0];
                    value = keyvalue[1];
                    obj[key] = decodeURIComponent(value);
                }
                console.log(obj)
                return obj;
            },
            //上传图片
			uploadEvid(data) {  
				Evaluate.uploadCommentPic(data).then((res) => {
					if(res.code == 1){	
						this.imgIsLoading = false;					
						this.imageUrls.pop();
						this.imageUrls.push(res.data);
					} else {
						Toast('凭证上传失败，请稍候重试[' + res.code + ']');
						this.uploadFailed(); 
					}
				}).catch((err) => {
					this.uploadFailed();
				})
			},
			//上传失败
			uploadFailed(){   
				this.imgIsLoading = false;
				this.imageUrls.pop();				
            },
            uploadImageMethod() {
                let self = this;
                try {
                    if(self.appVersion == 'android') {
                        InitBridge(function (bridge) {
                            bridge.uploadImageMethod(2);
                        });
                    }else{
                        if(!self.initFlag) {
                            bridge.init();
                            self.initFlag = true;
                        }
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('uploadImageMethod', 2, ()=>{})
                        }); 
                        bridge.registerHandler('AppUpLoadFile', AppUpLoadFile);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            //选中图片 
			changeImage(e){
                if(this.appVersion == 'android') {
                    return false;
                }
				let file = e.target.files[0],
					imageData = new FormData(),					
					self = this;						
				
				if(!file){
					return;
				}	
				e.target.value = '';			
				if(file.size > MAX_IMG_SIZE){
					Toast('上传图片不能大于' + MAX_NUM +'M');
					return;
				}
				if(!VALID_TYPE.test(file.type)){
					let type = file.type.split('/').pop();
					Toast('不支持上传'+ type +'格式');
					return;
				}				
				//获取图片的 Orientation
				let orientation = 0;
				EXIF.getData(file, function(){
					EXIF.getAllTags(this);
					orientation = EXIF.getTag(this, 'Orientation');
				})

				this.uploadStart();				
				if(file.size <= UPLOAD_SIZE){   //如果图片小于规定的大小，直接提交file文件流
					imageData.append('imagefile', file);
					self.uploadEvid(imageData);
					return
				}

				let reader = new FileReader();
				let quality = 0.3;								
				reader.onload = function(e){  
					let img = new Image();					
					let result = e.target.result;  
					img.addEventListener('load', callback,  false);
					img.src = result;    
					function callback(e){                
						let newData = compressImg(img, {orientation, quality});    //压图
						let blob = dataURLtoBlob(newData);				  //转为Blob对象
						imageData.append('imagefile', blob, file.name);
						img = null;						
						self.uploadEvid(imageData);											
					}
				}
				reader.readAsDataURL(file);			
            },
            //上传开始
			uploadStart(){
				this.imgIsLoading = true;
				this.imageUrls.push(this.imagePlaceUrl);
			},
			//上传结束，不论成功还是失败		
			uploadEnd(){   
				this.imgIsLoading = false;
				this.imageUrls.pop();				
			},
			//删除图片
			removeImage(index){
				this.imageUrls.splice(index, 1);
            },
            showImgView(e){
                let self = this;
                let target = e.target,
                    tagName = target.tagName.toLowerCase();	
                let index = Array.from(e.currentTarget.querySelectorAll(tagName)).indexOf(target);
                let str = `${index},${self.imageUrls.join(',')}`;
                if(index < 0) {
                    return false;
                }
                try {
                    if(self.appVersion === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('imageDetail', str, ()=>{})
                        }); 
                    }else {
                        InitBridge(function (bridge) {
                            bridge.imageDetail(str);  
                        }); 
                    }
                } catch (error) {
                    console.log(error);
                }
			},
            // 获取图片名称
            getImgList() {
                const picturename = this.imageUrls.map(ele => {
                    return ele.slice(ele.lastIndexOf('/')+1);
                });
                return picturename.join(',');
            },
            // 提交
            submitForm() {;
                let images = this.getImgList();
                let data = {
                    anonymity: this.anonymity ? 1 : 0,
                    orderlineid: this.goodsinfo.orderlineid,
                    stars: this.starNum,
                    text: this.text,
                    picturename: images
                }
                if(data.text.length>500) {
                    Toast('字数已超出限制！');
                    return false;
                }
                Indicator.show('正在提交...');
                Evaluate.commitComment(data).then((res) => {
					if(res.code == 1){
                        try {
                            if (getAppType() === 'ios') {
                                setupWebViewJavascriptBridge((bridge) => {
                                    bridge.callHandler('showAlertNativeMethod',()=>{})
                                }); 
                            } else {
                                InitBridge(function (bridge) {
                                    bridge.showAlertNativeMethod('');   
                                }); 
                            }
                        } catch (error) {
                            console.log(error);
                        }
						console.log('提交成功', res);
                        Indicator.close();
                        window.location.href = './evaluate-success.html';
					} else {
						Toast(res.message + resCode);
                        Indicator.close();
					}
				}).catch((err) => {
					console.log(err);
					Indicator.close();
	                Toast('网络不给力，请稍后重试!');
				})
            },
            goEvaluation() {
                window.location.href = './my-evaluation.html?status=1'
            },
            showAlertNativeMethod() {
                let data = {
                    title: '',
                    message: '确认退出评价吗？编辑内容不保存～',
                    cancletitle: '退出',
                    othertitle: '继续评价',
                    isshow: 1
                }
                try {
                    if (getAppType() === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('showAlertNativeMethod', data, ()=>{})
                        }); 
                    } else {
                        InitBridge(function (bridge) {
                            bridge.showAlertNativeMethod(JSON.stringify(data));   
                        }); 
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        },
        beforeMount() {
            this.init();
        }
	}	
</script>

<style lang="postcss">
	@import '../../../assets/styles/mixins.css';
    @import '../../../assets/styles/common.css';

    .evaluate-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        font-size: .32rem;
        line-height: 1.15;
        background-color: #f5f5f5;
    }
    .edit-region {
        width: 100%;
        padding: .24rem .32rem;
        box-sizing: border-box;
        border-bottom: 1px solid #e5e5e5;
        textarea {
            width: 100%;
            height: 1.53rem;
            display: block;
            box-sizing: border-box;
            font-size: .26rem;
            color: #666;
        }
        .limit-tips {
            display: flex;
            justify-content: flex-end;
            font-size: .24rem;
            color: #999;
            line-height: .33rem;
            &.limit-over {
                color: #ff681d;
            }
        }
        .imgs-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-top: .28rem;
            margin-left: -.22rem;
            margin-right: -.22rem;
            .img-wrap {
                position: relative;
                margin: 0 .22rem .2rem;
                width: 1.38rem;
                height: 1.38rem;
                &.isLoading {
                    background-image: url(../../../assets/images/evaluation/200.gif);
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;						
                }
                img {
                    position: absolute;
                    max-width: 100%;
                    max-height: 100%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
            .close {
                position: absolute;
                top: -.16rem;
                right: -.16rem;
                display: block;
                width: .32rem;
                height: .32rem;
                background-image: url(../../../assets/images/evaluation/close.png);
                background-size: 100%;
                background-repeat: no-repeat;
            }
            .add-img-btn {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 0 0 .2rem .22rem;
                img {
                    width: .4rem;
                    height: .4rem;
                    margin-bottom: .11rem;
                }
                p {
                    font-size: .22rem;
                    color: #999;
                }
                .file-inp{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    opacity: 0;
                }	
            }
        }
        .add-img-btn {
            width: 1.38rem;
            height: 1.38rem;
            border: 1px dashed #ccc;
            box-sizing: border-box;
        }
    }
    .anonymity {
        position: relative;
        display: flex;
        align-items: flex-end;
        padding-left: .32rem;
        margin-top: .24rem;
        .tips {
            margin-left: .2rem;
            font-size: .22rem;
            color: #999;
            line-height: .28rem;
        }
        input {
            display: none;
            &:checked + label i {
                background-image: url(../../../assets/images/evaluation/selected.png);
            }
        }
        label {
            display: flex;
            i {
                width: 16px;
                height: 16px;
                margin-right: .15rem;
                background-image: url(../../../assets/images/evaluation/unselect.png);
                background-size: 100%;
            }
            font-size: .28rem;
        }
    }
    .start-evaluate .btn {
        width: 6.86rem;
        height: .96rem;
        border: 1px solid #FF681D;
        border-radius: .12rem;
        line-height: .96rem;
        text-align: center;
        margin: .86rem auto 0;
        font-size: .36rem;
        color: #FF681D;
    }
    .evaluate {
        margin-top: .2rem;
        background-color: #fff;
        min-height: calc(100% - 2.4rem);
        .score-wrap {
            display: flex;
            align-items: center;
            height: .88rem;
            padding-left: .32rem;
            border-bottom: 1px solid #e5e5e5;
            box-sizing: border-box;
            span {
                line-height: 1;
            }
            .name {
                font-size: .28rem;
                color: #666;
            }
            .level {
                font-size: .28rem;
            }
            .star-wrap {
                display: flex;
                align-items: center;
                margin: 0 .12rem .02rem;    
                user-select: none;
                span {
                    width: .32rem;
                    height: .3rem;
                    margin-right: .12rem;
                    background-image: url(../../../assets/images/evaluation/icon-star.png);
                    background-size: 100%;
                    background-repeat: no-repeat;
                    &.active {
                        background-image: url(../../../assets/images/evaluation/icon-star-active.png);
                    }
                }
            }
        }
    }
    .goods-wrap {
        display: flex;
        padding: .3rem .32rem;
        background-color: #fff;
        .goods-pic {
            width: 1.6rem /* 200/100 */;
            margin-right: .24rem;
            // border: 1px solid #e5e5e5;
            box-sizing: border-box;
            padding: 1px;
            img {
                display: block;
                width: 100%;
            }
        }
        .goods-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 1.6rem;
            .goods-name {
                margin-bottom: .16rem;
                font-size: .26rem /* 26/100 */;
                line-height: .36rem;
            }
            .goods-spec {
                font-size: .22rem;
                color: #999;
            }
            .goods-bot {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: .54rem /* 54/100 */;
                .left {
                    display: flex;
                    align-items: center;
                    margin-left: -.06rem;
                }
                .price {
                    font-size: .26rem;
                }
                .num {
                    margin-left: .2rem;
                    font-size: .24rem;
                    color: #999;
                }
                .btn {
                    width: 1.4rem /* 140/100 */;
                    height: .54rem;
                    font-size: .24rem;
                    line-height: .54rem;
                    border: 1px solid #FF681D;
                    border-radius: .08rem /* 8/100 */;
                    text-align: center;
                    color: #FF681D;
                    box-sizing: border-box;
                }
            }
        }
    }
    .evaluate-success {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        background-color: #fff;
        .banner {
            width: 100%;
            height: 2.2rem;
            padding-top: .54rem;
            background-image: url(../../../assets/images/evaluation/banner.png);
            background-size: 100%;
            background-postion: 0 0;
            box-sizing: border-box;
            color: #fff;
            text-align: center;
            p {
                font-size: .3rem;
                line-height: .42rem;
            }
            div {
                width: 1.6rem;
                height: .56rem; 
                margin: .32rem auto 0;
                font-size: .26rem;
                border-radius: .08rem;
                border: 1px solid #fff;
                line-height: .56rem;
                text-align: center; 
            }
        }
        .hd {
            display: flex;
            align-items: center;
            width: 100%;
            height: .8rem;
            padding-left: .32rem;
            border-bottom: 1px solid #e5e5e5;
            box-sizing: border-box;
            i {
                display: block;
                content: "";
                width: .06rem;
                height: .26rem;
                margin-right: .1rem;
                background-color: #FF681D;
                border-radius: .03rem;
            }
            span {
                font-size: .28rem;
            }
        }
        .waiting-eavluation-null {
            padding-top: 1.97rem;
            text-align: center;
            background-color: #fff;
            p {
                margin-top: .42rem;
                font-size: .26rem;
                color: #999;
            }
            .btn {
                width: 2.46rem;
                height: .61rem;
                border-radius: .12rem;
                line-height: .61rem;
                box-sizing: border-box;
                text-align: center;
                color: #FF681D;
                border: 1px solid #FF681D;
                margin: .54rem auto 0;
                font-size: .28rem;
            }
            img {
                width: 1.5rem;
                height: 1.5rem;
            }
        }
        .wating-evaluation-content {
            padding: .3rem .32rem;
            box-sizing: border-box;
        }
        .evaluation-item {
        display: flex;
        margin-bottom: .4rem;
        .goods-pic {
            width: 2rem /* 200/100 */;
            margin-right: .24rem;
            // border: 1px solid #e5e5e5;
            box-sizing: border-box;
            padding: 1px;
            img {
                display: block;
                width: 100%;
            }
        }
        .goods-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
                .goods-name {
                    margin-bottom: .16rem;
                    font-size: .26rem /* 26/100 */;
                    line-height: .36rem;
                }
                .goods-spec {
                    font-size: .22rem;
                    color: #999;
                }
                .goods-bot {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: .54rem /* 54/100 */;
                    .left {
                        display: flex;
                        margin-left: -.06rem;
                    }
                    .price {
                        font-size: .26rem;
                    }
                    .num {
                        margin-left: .2rem;
                        font-size: .24rem;
                        color: #999;
                    }
                    .btn {
                        width: 1.4rem /* 140/100 */;
                        height: .54rem;
                        font-size: .24rem;
                        line-height: .54rem;
                        border: 1px solid #FF681D;
                        border-radius: .08rem /* 8/100 */;
                        text-align: center;
                        color: #FF681D;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }
    .waiting-evaluation-loading,
    .waiting-evaluation-loadend {
        font-size: 0.26rem;
        text-align: center;
    }
</style>