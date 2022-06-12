class AudioController {
    constructor(audio, subtitleControllers) {
        this.audio = audio
        this.subtitleControllers = subtitleControllers
    }
    /**
     * @param {string} name
     */
    getAudio(name) {
        return Object.values(this.audio).find((audio) => audio[name])[name]
    }
    /**
     * @param {string} name
     */
    play(name) {
        this.getAudio(name).play()
    }
    /**
     * @param {string} name
     */
    stop(name) {
        this.getAudio(name).stop()
    }
    /**
     * @param {string} voice
     */
    speak(voice, delay = 0) {
        setTimeout(() => {
            const otherVoices = Object.keys(this.audio.voices).filter(
                (voiceName) => voiceName.indexOf(voice) === -1
            )

            otherVoices.forEach((voice) => {
                if (this.audio.voices[voice].playing()) {
                    this.shutUp()
                }
            })
            if (!this.getAudio(voice).playing()) {
                this.play(voice)
                this.subtitleControllers[voice].show()
            } else if (this.getAudio(voice).playing()) {
                this.stop(voice)
                this.subtitleControllers[voice].hide()
            }
        }, delay)
    }
    shutUp() {
        Object.values(this.audio.voices).forEach((voice) => {
            voice.stop()
        })
        Object.values(this.subtitleControllers).forEach((subtitle) => {
            subtitle.hide()
        })
    }
}

export default AudioController
