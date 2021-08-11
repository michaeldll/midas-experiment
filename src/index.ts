import { ready } from "./utils/";
import { Pane } from "tweakpane"
import main from "./desenha/main"

const init = () => {
    const pane = new Pane()
    main(pane)
}

ready(init)