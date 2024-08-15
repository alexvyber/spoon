import { useMothmanContext } from "../../../../utils/global-context"
import config from "../../../../utils/load-config"
import { Action, Mode } from "../../../types"
import { Preview } from "../../icons"

export function ModeButton() {
  const { dispatch } = useMothmanContext()

  const text = `Open fullscreen mode. Can be toggled by pressing ${config.hotkeys.fullscreen.join(" or ")}.`

  return (
    <li>
      <button
        aria-label={text}
        title={text}
        onClick={() => dispatch({ type: Action.UpdateMode, payload: Mode.Preview })}
        type="button"
      >
        <Preview />

        <span className="moth-addon-tooltip">{text}</span>

        <label>Open fullscreen mode</label>
      </button>
    </li>
  )
}
