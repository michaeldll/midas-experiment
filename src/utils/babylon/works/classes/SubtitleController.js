class SubtitleController {
    /**
     * @param {String} id
     * @param {Number} duration
     * @param {Array} timeoutsTime
     */
    constructor(id, duration, timeoutsTime) {
        this.id = id
        this.duration = duration
        this.timeoutsTime = timeoutsTime
        this.timeouts = []
        this.paragraphElements = document.querySelectorAll(`#${this.id} p`)
    }

    show() {
        document.getElementById(this.id).classList.add('show')

        this.timeoutsTime.forEach((timeout, i) => {
            this.timeouts.push(
                setTimeout(() => {
                    this.paragraphElements[i - 1] &&
                        this.paragraphElements[i - 1].classList.remove('show')
                    this.paragraphElements[i] &&
                        this.paragraphElements[i].classList.add('show')
                }, timeout)
            )
        })

        this.timeouts.push(
            setTimeout(() => {
                this.hide()
            }, this.duration)
        )
    }

    hide() {
        document.getElementById(this.id).classList.remove('show')
        this.paragraphElements.forEach((p) => p.classList.remove('show'))
        this.timeouts.forEach((timeout) => {
            clearTimeout(timeout)
        })
    }
}
export default SubtitleController
