<template>
  <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">饱了吗</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:loginWay}" @click="setLoginWay(true)">短信登录</a>
            <a href="javascript:;" :class="{on:!loginWay}" @click="setLoginWay(false)">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div :class="{on:loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!rightPhone" class="get_verification" @click.prevent="getCode" :class="{right_phone:rightPhone}">
                  {{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册饱了吗外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:!loginWay}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                  <div class="switch_button" :class="showPwd ? 'on':'off'" @click="showPwd=!showPwd">
                    <div class="switch_circle" :class="{right:showPwd}"></div>
                    <span class="switch_text" >{{showPwd ? 'abc' : '...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha" @click="getCaptcha" ref="captcha" alt="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <AlertTip @closeTip="closeTip" :alert-text="alertText" v-show="alertShow"></AlertTip>
    </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
import {sendCode, smsLogin, pwdLogin} from '../../api'
export default {
  components: {AlertTip},
  data () {
    return {
      loginWay: true, // true代表短信登陆，false代表密码
      phone: '', // 手机号
      computeTime: 0, // 计时
      showPwd: false, // 是否显示密码
      pwd: '', // 密码
      code: '', // 短信验证码
      name: '', // 用户名
      captcha: '', // 图形验证码
      alertText: '', // 提示文本
      alertShow: false // 是否显示警告
    }
  },
  computed: {
    // 判断手机号码
    rightPhone: function () {
      return /^1\d{10}$/.test(this.phone)
    }
  },
  methods: {
    setLoginWay(loginWay) {
      this.loginWay = loginWay
    },
    async getCode() {
      // 如果当前没有计时，才可以启动计时。
      if (!this.computeTime) {
        // 启动倒计时
        this.computeTime = 30
        this.intervalId = setInterval(() => {
          this.computeTime--
          if (this.computeTime <= 0) {
            // 停止计时
            clearInterval(this.intervalId)
          }
        }, 1000)
        // 发送ajax请求（向制定手机号发消息）
      }
      // 发送ajax请求
      const result = await sendCode(this.phone)
      if (result.code === 1) {
        // 显示提示
        this.showAlert(result.msg)
        // 停止倒计时
        if (this.computeTime) {
          this.computeTime = 0
          clearInterval(this.intervalId)
          this.intervalId = 0
        }
      }
    },
    showAlert(alertText) {
      this.alertShow = true
      this.alertText = alertText
    },
    // 关闭弹窗
    closeTip() {
      this.alertShow = false
      this.alertText = ''
    },
    // 获取一个新的图片验证码
    getCaptcha () {
      // 每次指定的src指不一样，但是前面部分值不一样 而且虽然端口号是4000但是不存在跨域问题
      // 因为这不是ajax请求，ajax才存在跨域
      // event.target.src = 'http://localhost:4000/captcha?time=' + Date.now()
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time=' + Date.now()
    },
    // 异步登录
    async login () {
      let result
      // 前台表单验证
      if (this.loginWay) { // 短信登陆
        const {rightPhone, code} = this
        if (!this.rightPhone) {
          // 手机号不正确
          this.showAlert('手机号不正确')
          return
        } else if (!(/^\d{6}$/gi.test(this.code))) {
          // 验证码必须是6位数字
          this.showAlert('验证码必须是6位数字')
          return
        }
        // 发送ajax请求短信登陆
        result = await smsLogin(rightPhone, code)
      } else {
        // 密码登录
        const {name, pwd, captcha} = this
        if (!this.name) {
          // 用户名必须指定
          this.showAlert('用户名必须指定')
          return
        } else if (!this.pwd) {
          // 密码必须指定
          this.showAlert('密码必须指定')
          return
        } else if (!this.captcha) {
          // 验证码必须指定
          this.showAlert('验证码必须指定')
          return
        }
        // 发送ajax请求密码登录
        result = await pwdLogin(name, pwd, captcha)
      }
      if (this.computeTime) {
        this.computeTime = 0
        // 停止计时
        clearInterval(this.intervalId)
        this.intervalId = undefined
      }
      // 根据结果数据处理
      if (result.code === 0) {
        const user = result.data
        // 将user保存到vuex的state中
        this.$store.dispatch('recordUser', user)
        // 跳转路由 去个人中心界面
        this.$router.replace('/profile')
      } else {
        // 显示警告提示
        const msg = result.msg
        // 当信息提交失败的时候刷新一次图片验证码
        this.getCaptcha()
        this.showAlert(msg)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          > a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        > form
          > div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color #000
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s, border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                > .switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              > a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        > .iconfont
          font-size 20px
          color #999
</style>
