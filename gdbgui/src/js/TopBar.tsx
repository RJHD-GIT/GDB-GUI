import React from "react";

import { store } from "statorgfc";
import BinaryLoader from "./BinaryLoader";
import ControlButtons from "./ControlButtons";
import Settings from "./Settings";
import SourceCodeHeading from "./SourceCodeHeading";
import ToolTipTourguide from "./ToolTipTourguide";
import FileOps from "./FileOps";
import GdbApi from "./GdbApi";
import Actions from "./Actions";
import constants from "./constants";
import Util from "./Util";
import { Trans } from "react-i18next";

let onkeyup_jump_to_line = (e: any) => {
  if (e.keyCode === constants.ENTER_BUTTON_NUM) {
    Actions.set_line_state(e.currentTarget.value);
  }
};

let show_license = function() {
  Actions.show_modal(
    "gdbgui license",
    <React.Fragment>
      <a href="https://github.com/cs01/gdbgui/blob/master/LICENSE">
        GNU General Public License v3.0
      </a>
      <p>Copyright © Chad Smith</p>
      <p>This software can be used personally or commercially for free.</p>
      <p>
        Permissions of this strong copyleft license are conditioned on making available
        complete source code of licensed works and modifications, which include larger
        works using a licensed work, under the same license. Copyright and license notices
        must be preserved. Contributors provide an express grant of patent rights.
      </p>
      <p>
        If you wish to redistribute gdbgui as part of a closed source product, you can do
        so for a fee. Contact chadsmith.software@gmail.com for details.
      </p>
    </React.Fragment>
  );
};

let About = {
  show_about: function() {
    Actions.show_modal(
      "About gdbgui",
      <div>
        <div>gdbgui, v{store.get("gdbgui_version")}</div>
        <div>Copyright © Chad Smith</div>
        <div>
          <a href="https://chadsmith.dev">chadsmith.dev</a>
        </div>
      </div>
    );
  }
};

let show_session_info = function() {
  Actions.show_modal(
    "session information",
    <React.Fragment>
      <table>
        <tbody>
          <tr>
            <td><Trans>gdb version</Trans>: {store.get("gdb_version")}</td>
          </tr>
          <tr>
            <td><Trans>gdb pid for this tab</Trans>: {store.get("gdb_pid")}</td>
          </tr>
          <tr>
            <td><Trans>gdbgui</Trans> v{store.get("gdbgui_version")}</td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  );
};

const menu = (
  <ul
    style={{ height: 25, padding: 0, paddingRight: "15px", fontSize: "1.3em" }}
    className="nav navbar-nav navbar-right"
  >
    <li id="menudropdown" className="dropdown">
      <a
        href="#"
        data-toggle="dropdown"
        role="button"
        style={{ height: 25, padding: 0, paddingRight: 20 }}
        className="dropdown-toggle"
      >
        <span className="glyphicon glyphicon-menu-hamburger"> </span>
      </a>
      <ul className="dropdown-menu">
        <li>
          <a title="dashboard" className="pointer" href="/dashboard">
            <Trans>Dashboard</Trans>
          </a>
        </li>
        <li>
          <a
            title="show guide"
            className="pointer"
            onClick={ToolTipTourguide.start_guide}
          >
            <Trans>Show Guide</Trans>
          </a>
        </li>
        <li>
          <a onClick={show_session_info} className="pointer">
            <Trans>Session Information</Trans>
          </a>
        </li>

        <li role="separator" className="divider" />
        <li>
          <a href="https://github.com/cs01/gdbgui" className="pointer">
            <Trans>GitHub</Trans>
          </a>
        </li>
        <li>
          <a href="http://gdbgui.com" className="pointer">
            <Trans>Homepage</Trans>
          </a>
        </li>

        <li>
          <a href="https://www.youtube.com/channel/UCUCOSclB97r9nd54NpXMV5A">
            <Trans>YouTube Channel</Trans>
          </a>
        </li>

        <li role="separator" className="divider" />
        <li>
          <a onClick={show_license} className="pointer">
            <Trans>License</Trans>
          </a>
        </li>
        <li>
          <a onClick={About.show_about} className="pointer">
            <Trans>About gdbgui</Trans>
          </a>
        </li>
      </ul>

      <ToolTipTourguide
        // @ts-expect-error ts-migrate(2322) FIXME: Property 'top' does not exist on type 'IntrinsicAt... Remove this comment to see the full error message
        top={"100%"}
        left={"-300px"}
        step_num={0}
        content={
          <div>
            <h5><Trans>Welcome to gdbgui.</Trans></h5>
            <p>
              <Trans>This guide can be shown at any time by clicking the menu button,<span className="glyphicon glyphicon-menu-hamburger"> </span>, then clicking "Show Guide".</Trans>
            </p>
          </div>
        }
      />
    </li>
  </ul>
);

type State = any;

class TopBar extends React.Component<{}, State> {
  spinner_timeout: any;
  spinner_timeout_msec: any;
  constructor() {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1-2 arguments, but got 0.
    super();
    // state local to the component
    this.state = {
      assembly_flavor: "intel", // default to intel (choices are 'att' or 'intel')
      show_spinner: false
    };
    // global state attached to this component
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'connectComponentState' does not exist on... Remove this comment to see the full error message
    store.connectComponentState(
      this,
      [
        "debug_in_reverse",
        "reverse_supported",
        "source_code_state",
        "waiting_for_response",
        "show_filesystem",
        "latest_gdbgui_version",
        "gdbgui_version"
      ],
      this.store_update_callback.bind(this)
    );

    this.spinner_timeout = null;
    this.spinner_timeout_msec = 5000;
  }
  store_update_callback(keys: any) {
    if (keys.indexOf("waiting_for_response") !== -1) {
      this._clear_spinner_timeout();
      this.setState({ show_spinner: false });
      if (this.state.waiting_for_response === true) {
        // false to true
        this._set_spinner_timeout();
      }
    }
  }
  _set_spinner_timeout() {
    this.spinner_timeout = setTimeout(() => {
      if (this.state.waiting_for_response) {
        this.setState({ show_spinner: true });
      }
    }, this.spinner_timeout_msec);
  }
  _clear_spinner_timeout() {
    clearTimeout(this.spinner_timeout);
  }
  toggle_assembly_flavor() {
    const flavor = this.state.assembly_flavor === "att" ? "intel" : "att";
    this.setState({ assembly_flavor: flavor });
    GdbApi.set_assembly_flavor(flavor);
    Actions.clear_cached_assembly();
    FileOps.fetch_assembly_cur_line();
  }
  get_controls() {
    return (
      <div
        role="group"
        style={{ marginBottom: 6, height: 25, width: 250 }}
        className="btn-group btn-group"
      >
        <ToolTipTourguide
          // @ts-expect-error ts-migrate(2322) FIXME: Property 'step_num' does not exist on type 'Intrin... Remove this comment to see the full error message
          step_num={3}
          position={"bottomleft"}
          onClick={(e: any) => e.stopPropagation()}
          content={
            <div>
              <h5>
                <Trans>These buttons allow you to control execution of the target you are debugging.</Trans>
              </h5>
              <p>
                <Trans>Hover over these buttons to see a description of their action. For example, the <span className="glyphicon glyphicon-repeat" /> button starts (or restarts) a program from the beginning.</Trans>
              </p>
              <p>
                <Trans>Each button has a keyboard shortcut. For example, you can press "r" to start running.</Trans>
              </p>
            </div>
          }
        />
        <ControlButtons />
      </div>
    );
  }
  render() {
    let toggle_assm_button = "";
    if (
      this.state.source_code_state ===
        constants.source_code_states.ASSM_AND_SOURCE_CACHED ||
      this.state.source_code_state === constants.source_code_states.ASSM_CACHED
    ) {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'Element' is not assignable to type 'string'.
      toggle_assm_button = (
        <button
          onClick={this.toggle_assembly_flavor.bind(this)}
          type="button"
          title={"Toggle between assembly flavors. The options are att or intel."}
          className={"btn btn-default btn-xs"}
        >
          <span
            title={`Currently displaying ${this.state.assembly_flavor}. Click to toggle.`}
          >
            {this.state.assembly_flavor}
          </span>
        </button>
      );
    }

    let reload_button_disabled = "disabled";
    if (
      this.state.source_code_state ===
        constants.source_code_states.ASSM_AND_SOURCE_CACHED ||
      this.state.source_code_state === constants.source_code_states.SOURCE_CACHED
    ) {
      reload_button_disabled = "";
    }
    let reload_button = (
      <button
        onClick={FileOps.refresh_cached_source_files}
        type="button"
        title="Erase file from local cache and re-fetch it"
        className={"btn btn-default btn-xs " + reload_button_disabled}
      >
        <span><Trans>reload file</Trans></span>
      </button>
    );

    let spinner = (
      <span className="" style={{ height: "100%", margin: "5px", width: "14px" }} />
    );
    if (this.state.show_spinner) {
      spinner = (
        <span
          className="glyphicon glyphicon-refresh glyphicon-refresh-animate"
          style={{ height: "100%", margin: "5px", width: "14px" }}
        />
      );
    }

    let reverse_checkbox = (
      <label
        title={
          "when clicking buttons to the right, pass the `--reverse` " +
          "flag to gdb in an attempt to debug in reverse. This is not always supported. " +
          "rr is known to support reverse debugging. Keyboard shortcuts go in " +
          "reverse when pressed with the shift key."
        }
        style={{ fontWeight: "normal", fontSize: "0.9em", margin: "5px" }}
      >
        <input
          type="checkbox"
          disabled={!this.state.reverse_supported}
          checked={store.get("debug_in_reverse")}
          onChange={e => {
            store.set("debug_in_reverse", e.target.checked);
          }}
        />
        <Trans>reverse</Trans>
      </label>
    );

    return (
      <div
        id="top"
        style={{ background: "#f5f6f7", position: "absolute", width: "100%" }}
      >
        <div className="flexrow">
          {/* @ts-expect-error ts-migrate(2322) FIXME: Property 'initial_user_input' does not exist on ty... Remove this comment to see the full error message */}
          <BinaryLoader initial_user_input={this.props.initial_user_input} />
          {spinner}
          {reverse_checkbox}

          {this.get_controls()}

          <span
            onClick={() => Settings.toggle_key("show_settings")}
            title="settings"
            className="pointer glyphicon glyphicon-cog"
            style={{ marginRight: "10px", fontSize: "1.3em" }}
          />
          {menu}
        </div>

        {/* @ts-expect-error ts-migrate(2322) FIXME: Object literal may only specify known properties, ... Remove this comment to see the full error message */}
        <div style={{ marginTop: 3, whitespace: "nowrap" }} className="flexrow">
          <div
            role="group"
            style={{ height: "25px", marginRight: "10px" }}
            className="btn-group btn-group"
          >
            <button
              className="btn btn-default btn-xs"
              title="Toggle file explorer visibility"
              onClick={() => {
                let middle_pane_sizes = store.get("middle_panes_split_obj").getSizes(),
                  file_explorer_size = middle_pane_sizes[0],
                  source_size = middle_pane_sizes[1],
                  sidebar_size = middle_pane_sizes[2],
                  new_file_explorer_size,
                  new_source_size,
                  new_sidebar_size;

                if (store.get("show_filesystem")) {
                  // hide it since it's shown right now
                  new_file_explorer_size = 0;
                  new_source_size = source_size + file_explorer_size / 2;
                  new_sidebar_size = sidebar_size + file_explorer_size / 2;
                } else {
                  new_file_explorer_size = 30;
                  new_source_size = Math.max(
                    30,
                    source_size - new_file_explorer_size / 2
                  );
                  new_sidebar_size = 99 - new_file_explorer_size - new_source_size;
                }

                store.set("show_filesystem", !store.get("show_filesystem"));
                localStorage.setItem(
                  "show_filesystem",
                  JSON.stringify(store.get("show_filesystem"))
                ); // save this for next session
                store
                  .get("middle_panes_split_obj")
                  .setSizes([new_file_explorer_size, new_source_size, new_sidebar_size]);
              }}
            >
              {store.get("show_filesystem") ? <Trans>hide filesystem</Trans> : <Trans>show filesystem</Trans>}
            </button>

            <button
              onClick={() => FileOps.fetch_assembly_cur_line()}
              type="button"
              title="fetch disassembly"
              className="btn btn-default btn-xs"
            >
              <span><Trans>fetch disassembly</Trans></span>
            </button>

            {reload_button}
            {toggle_assm_button}
          </div>

          <input
            onKeyUp={onkeyup_jump_to_line}
            autoComplete="on"
            title="Enter line number, then press enter"
            placeholder="jump to line"
            style={{ width: 150, height: 25, marginLeft: 10 }}
            className="form-control dropdown-input"
          />

          <div
            style={{
              marginRight: 5,
              marginLeft: 5,
              marginTop: 5,
              whiteSpace: "nowrap",
              fontFamily: "monospace",
              fontSize: "0.7em",
              display: "flex",
              overflow: "auto"
            }}
            className="lighttext"
          >
            <SourceCodeHeading />
          </div>
        </div>
      </div>
    );
  }
  static needs_to_update_gdbgui_version() {
    // to actually check each value:
    try {
      return Util.is_newer(
        store.get("latest_gdbgui_version"),
        store.get("gdbgui_version")
      );
    } catch (err) {
      console.error(err);
      return true;
    }
  }
}

export default TopBar;
