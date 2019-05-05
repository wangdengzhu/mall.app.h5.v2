<template>
	<div class="help-detail-wrapper" v-if="pageLoaded">		
		<div class="content">
			<div class="question-wrap">
				<p><span>问题：</span>{{question}}</p>
			</div>
			<div class="answer-wrap">
				<span class="hd">回答：</span>
				<div class="answer" v-html="answer"></div>
			</div>
		</div>
		<div class="userful-wrap">
			<div class="text-wrap">
				<em class="line tb1px"></em>
				<span>以上方案对您是否有用</span>
			</div>
			<div class="operate-box" v-if="usefulFlag === 0">
				<div class="useful-box tb1px" @click="updateProblemState(1)">
					<i></i>
					<span>有用</span>
				</div>
				<div class="unuseful-box tb1px" @click="updateProblemState(2)">
					<i></i>
					<span>无用</span>
				</div>
			</div>
			<div class="box thanks-feedback" v-else-if="usefulFlag === 1">
				感谢您的反馈~
			</div>
			<div class="box have-question" @click="doCall('没有帮助到您')" v-else>
				有问题联系客服
			</div>
		</div>
		<div class="similar-question" v-if="list.length > 0">
			<p class="hd">还有其它问题？</p>
			<ul>
                <li v-for="item in list" :key="item.qa_detail_id" :data-detailid="item.qa_detail_id" :data-sortid="item.qa_sort_id" @click="toDetailPage">
                    <span>{{item.qa_detail_name}}</span>
                    <i></i> 
                </li>
			</ul>
		</div>
		<div class="contact" @click="doCall()">
			<span>联系客服</span>
			<i></i>
			<span>400-8988-111</span>
		</div>
	</div>	
</template>
<script>
    import {Help} from '@/apis/';
	import Indicator from '@/components/common/indicator';
    import confirmBox from '@/components/common/confirm-box';
    import {reLogin, InitBridge } from '@/utils/common';
	export default {
		data(){
			return {
				pageLoaded: !1,
                flag: 0,
				detailid: null,
				sortid: null,
				title: '',
				list: [],
				usefulFlag: 0,
				question: '',
				answer: null,
			}
		},
		methods:{
            init() {
				this.title = this.getQueryVariable('title');
				this.detailid = this.getQueryVariable('detailid');
				this.sortid = this.getQueryVariable('sortid');
				this.flag = parseInt(this.getQueryVariable('flag')) == 0 ? 0 : 1;
				document.title = decodeURIComponent(this.title);
				this.$nextTick(() => {
					this.getProblemDetails();
					this.updateProblemViews();
				})
			},
			getProblemDetails() {
				Indicator.show('加载中...');
                Help.getProblemDetails({
					qa_detail_id: this.detailid,
                    qa_sort_id: this.sortid,
                    flag: this.flag
                }).then(res => {
					this.pageLoaded = !0;
					Indicator.close();
                    if(res.code === 1) {
						this.list = res.data.other_problemlist;
						this.usefulFlag = res.data.useful_flag;
						this.question = res.data.qa_title_name;
						this.answer = res.data.qa_answer.replace(/(<img\b.*?)style=".*?"/g,'$1');
                    }else if(res.code === 401) {
                        reLogin();
                    }else {
						this.reqFailed();
					}	
                }).catch(err=>{
					Indicator.close();
				});
			},
			updateProblemState(usefulFlag) {
				if(usefulFlag === 2) {
					this.doCall('没有帮助到您');
				}
				Help.updateProblemState({
					qa_detail_id: this.detailid,
					useful_flag: usefulFlag
                }).then(res => {
                    if(res.code === 1) {
						this.usefulFlag = usefulFlag;
                    }else if(res.code === 401) {
                        reLogin();
                    }
                }).catch(err=>{
				});
			},
			updateProblemViews() {
				Help.updateProblemViews({
					qa_detail_id: this.detailid,
				}).then(res => {
                }).catch(err=>{
				});
			},
			doCall(text='') {
				confirmBox.open({
					'cnfrmBtnTxt': '呼叫',
					'message' : `<p>${text}尝试联系客服</p><p>400-8988-111</p>`
				}).then(
					(resolve) => {
                        window.location.href = 'tel:400-8988-111';
                    }, 
					reject => {}
				).catch((err) => {
                });
			},
            getQueryVariable(variable) {
                var query = decodeURIComponent(window.location.search.substring(1));
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
                }
                return(false);
            },
            toDetailPage(e) {
                let targetDom = e.currentTarget;
                let detailid = targetDom.getAttribute('data-detailid');
                let sortid = targetDom.getAttribute('data-sortid');
                window.location.href = `./detail.html?detailid=${detailid}&sortid=${sortid}&title=${this.title}`;
            },
		},
		watch: {
			'$route': 'init'
		},
        mounted() {
            this.init();
		}
	}	
</script>

<style lang="postcss">
	@import '../../../assets/styles/mixins.css';
    @import '../../../assets/styles/common.css';
	strong{
		font-weight: bold;
	}
	em, i{
		font-style: italic;
	}
    .help-detail-wrapper {
        // position: absolute;
		// left: 0;
		// top: 0;
		// bottom: 0;
		// right: 0;
		// background-color: #f5f5f5;
        // font-size: 0.32rem;
        // color: #333;
		// z-index: 1000;
		// overflow-x: hidden;
    	// overflow-y: auto;
		background-color: #f5f5f5;
    	-webkit-overflow-scrolling: touch;
		.content {
			background-color: #fff;
			.question-wrap {
				display: flex;
   				align-items: center;
				width: 100%;
				min-height: .88rem /* 88/100 */;
				font-size: .3rem;
				padding: .23rem .32rem /* 32/100 */;
				box-sizing: border-box;
				background-color: #f5f5f5;
			}
			.answer-wrap {
				padding: .23rem .32rem .32rem;
				line-height: 1.5;
				.hd {
					display: block;
					margin-bottom: .18rem /* 18/100 */;
					font-size: .3rem;
				}
				.answer {
					word-break: break-all;
					font-size: .28rem /* 28/100 */;
					img {
						max-width: 100%;
					}
				}
			}
		}
		.userful-wrap {
			margin-top: .2rem;
			padding: .6rem .3rem .8rem;
			background-color: #fff;
			.text-wrap {
				position: relative;
				height: 36px;
				text-align: center;
				z-index: 8;
				em {
					position: absolute;
					left: 50%;
					top: 40%;
					width: 4.5rem;
					height: 1px;
					border-bottom: 1px solid #333;
					z-index: 9;
					transform: translate3d(-50%,0,0);
				}
				span {
					display: inline-block;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate3d(-50%,-50%,0);
					padding: 0 0.15rem;
					line-height: 1;
					color: #333;
					font-size: 0.3rem;
					z-index: 10;
					background-color: #fff;
				}
			}
		}
		.operate-box {
			margin-top: .33rem /* 33/100 */;
			display: flex;
			align-items: center;
			justify-content: center;
			div {
				display: flex;
				justify-content: center;
				align-items: center;			
				width: 2.2rem /* 220/100 */;
				height: .8rem /* 80/100 */;
				border: 1px solid #E5E5E5;
				border-radius: .04rem /* 4/100 */;
				span {
					font-size: .3rem /* 30/100 */;
				}
				i {
					width: .42rem /* 42/100 */;
					height: .42rem /* 42/100 */;
					margin-right: .12rem /* 12/100 */;
					background-size: 100%;
					background-repeat: no-repeat;
				}
			}
			.useful-box {
				margin-right: .5rem /* 50/100 */;
				i {
					background-image: url(../../../assets/images/help/useful.png);
				}
			}
			.unuseful-box {
				i {
					background-image: url(../../../assets/images/help/unuseful.png);
				}
			}
		}
		.box {
			width: 5.4rem /* 540/100 */;
			height: .8rem /* 80/100 */;
			margin: .33rem auto 0;
			font-size: .28rem /* 28/100 */;
			text-align: center;
			line-height: .8rem;
			border-radius: .04rem /* 4/100 */;
		}
		.thanks-feedback {
			background-color: #f5f5f5;
			color: #999;
		}
		.have-question {
			background-color: #49A0FF;
			color: #fff;
		}
		.similar-question {
			background-color: #fff;
			.hd {
				width: 100%;
				height: .88rem /* 88/100 */;
				padding: 0 .32rem /* 32/100 */;
				line-height: .88rem;
				box-sizing: border-box;
				font-size: .3rem /* 30/100 */;
				background-color: #f5f5f5;
			}
			
			li {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: .88rem /* 88/100 */;
				padding: 0 .32rem /* 32/100 */;
				background-color: #fff;
				line-height: .88rem;
				box-sizing: border-box;
				border-bottom: 1px solid #E5E5E5;
				span {
					font-size: .3rem /* 30/100 */;
					color: #333;
				}
				i {
					display: block;
					width: .16rem /* 15/100 */;
					height: .26rem /* 24/100 */;
					background-image: url(../../../assets/images/help/list-icon.png);
					background-size: 100%;
					background-repeat: no-repeat;
				}
			}
		}
		

		.contact {
			background-color: #fafafa;
			padding: .4rem 0;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: .28rem /* 28/100 */;
			i {
				width: .43rem /* 43/100 */;
				height: .45rem /* 45/100 */;
				margin: 0 .2rem /* 10/100 */;
				background-image: url(../../../assets/images/help/call.png);
				background-size: 100%;
				background-repeat: no-repeat;
			}
		}

		.slide-enter-active,.slide-leave-active{
			transition: all .3s ease-in-out;
		}
		.slide-enter,.slide-leave-to{
			transform: translate3d(100%,0,0);
		}
    }
	.cnfrmbox-wrap {
		div.cnfrmbox {
			border-radius: .25rem /* 25/100 */;
			div.cnfrmbox-ft {
				height: .88rem;
				line-height: .88rem;
				.btn.cancel-btn,
				.btn.ok-btn {
					color: #007AFF;
					font-size: .34rem /* 34/100 */;
				}
			}
		}
		.bd-message {
			p {
				font-size: .32rem;
				&:first-child {
					margin-bottom: .22rem /* 22/100 */;
					font-size: .34rem /* 34/100 */;
				}
			}
		}
	}
	
</style>