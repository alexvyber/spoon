import { useHotkeys } from "react-hotkeys-hook"
import { stories } from "virtual:stories"

import { useState } from "react"

import { useMothmanContext } from "../../../../utils/global-context"
import config from "../../../../utils/load-config"
import { Action } from "../../../types"
import { Width } from "../../icons"
import { Modal } from "../../ui/modal"
import { AddonTriggerButton } from "../addons-ui"

export function WidthButton() {
  const { globalState, dispatch } = useMothmanContext()

  const text = "Change the story viewport."
  const [open, setOpen] = useState(false)

  useHotkeys(config.hotkeys.width, () => setOpen((prev) => !prev), {
    enabled: globalState.hotkeys && config.addons.width.enabled,
  })

  const storyData = stories[globalState.story]
  let metaWidth = storyData?.meta ? storyData.meta.meta.width : 0
  let options = config.addons.width.options

  for (const key of Object.keys(options)) {
    key === metaWidth && (metaWidth = options[key])
  }

  if (metaWidth && !Object.values(options).includes(metaWidth)) {
    options = { custom: metaWidth, ...options }
  }

  return (
    <>
      <li>
        <AddonTriggerButton
          aria-label={text}
          data-testid="addon-width"
          title={text}
          type="button"
          className={open ? "width-active" : ""}
          onClick={() => setOpen(true)}
          label="Set story width"
          icon={Width}
        />
      </li>

      <Modal
        isOpen={open}
        label="Dialog with the story width selector."
        close={() => setOpen(false)}
      >
        <p>Select story width</p>

        <div>
          <input
            value={0}
            type="radio"
            name="width"
            id={"width-unset"}
            checked={globalState.width === 0}
            onChange={() => dispatch({ type: Action.UpdateWidth, payload: 0 })}
          />

          <label
            htmlFor={"width-unset"}
            className="pl2"
          >
            unset
          </label>
        </div>

        {Object.entries(options).map(([key, value]) => (
          <div key={key}>
            <input
              type="radio"
              name="width"
              id={`width-${key}`}
              value={value}
              checked={globalState.width === value}
              onChange={() => dispatch({ type: Action.UpdateWidth, payload: value })}
            />
            <label
              htmlFor={`width-${key}`}
              className="pl2"
            >
              {value}px - {key}
            </label>
          </div>
        ))}

        <p />
      </Modal>
    </>
  )
}
