class OrientationController {
    show() {
        document.querySelector('#orientationScreen').classList.remove('hide')
    }
    hide() {
        document.querySelector('#orientationScreen').classList.add('hide')
    }
}

export default OrientationController
