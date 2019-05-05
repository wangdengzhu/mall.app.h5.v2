import Vue from 'vue';

const ToastConstructor = Vue.extend(require('./toast.vue'));

let removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
};

ToastConstructor.prototype.close = function() {
  this.show = false;
  this.$el.addEventListener('transitionend', removeDom);
  this.closed = true;
};

let Toast = (options = {}) => {
  let duration = options.duration || 2000;

  let instance = new ToastConstructor().$mount(document.createElement('div'));
  instance.closed = false;
  clearTimeout(instance.timer);
  instance.toastTxt = typeof options === 'string' ? options : options.message;
  instance.toastCls = options.className || '';
  instance.iconClass = options.iconClass || '';
  document.body.appendChild(instance.$el);
  Vue.nextTick(function() {
    instance.show = true;
    instance.$el.removeEventListener('transitionend', removeDom);
    instance.timer = setTimeout(function() {
      if (instance.closed) return;
      instance.close();
    }, duration);
  });
  return instance;
};

export default Toast;