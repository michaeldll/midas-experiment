import { DefaultLoadingScreen } from '@babylonjs/core/Loading/loadingScreen'

class LoadingScreen {
    init() {
        DefaultLoadingScreen.prototype.displayLoadingUI = function () {
            if (document.getElementById('customLoadingScreenDiv')) {
                // Do not add a loading screen if there is already one
                document.getElementById(
                    'customLoadingScreenDiv'
                ).style.display = 'flex'
                return
            }
            this._loadingDiv = document.createElement('div')
            this._loadingDiv.id = 'customLoadingScreenDiv'
            if (sessionStorage.getItem('USER_HAS_TOUCHED')) {
                this._loadingDiv.innerHTML = `
                    <div class="window loading-text aim">Aim with your phone to explore!</div>
                    <br>
                    <div class="window loading-text aim">Tap your screen to interact!</div>
                    <br>
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    <div id="loading-bar"></div>
                `
            } else {
                this._loadingDiv.innerHTML = `
                    <div class="window loading-text aim">Aim with your mouse to explore!</div>
                    <br>
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    <div class="loading-bar-container"><div id="loading-bar"></div></div>
                `
            }
            this._resizeLoadingUI()
            window.addEventListener('resize', this._resizeLoadingUI)
            document.body.appendChild(this._loadingDiv)
        }

        DefaultLoadingScreen.prototype.hideLoadingUI = function () {
            document.getElementById('customLoadingScreenDiv').style.display =
                'none'
        }
    }
}

export default LoadingScreen
