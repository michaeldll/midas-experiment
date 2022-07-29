import gsap, { Expo } from 'gsap'

export default class LoadingController {
  private container = document.querySelector('.loader')
  private twentyOne = document.querySelector('.loader__mask__21')
  private twentyTwo = document.querySelector('.loader__mask__22')

  constructor(debug: boolean) {
    if (debug) {
      gsap.set(this.container, { autoAlpha: 0 })
    } else {
      document.body.addEventListener("loaded", this.onLoad, false);
    }
  }

  private onLoad = () => {
    gsap.to('.loader__mask', {
      autoAlpha: 1, duration: 0.3, ease: Expo.easeInOut, delay: 0.3, onComplete: () => {
        gsap.to(this.twentyOne, { autoAlpha: 1, skewY: -10, y: "-120%", duration: 1.1, delay: 0.5, ease: Expo.easeInOut })
        gsap.from(this.twentyTwo, { autoAlpha: 0, skewY: -10, y: "120%", duration: 1.1, delay: 0.5, ease: Expo.easeInOut })
        gsap.to(this.container, { autoAlpha: 0, duration: 0.5, ease: Expo.easeInOut, delay: 1.85 })
      }
    })
  }
}