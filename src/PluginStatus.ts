/**********************************************************************
 * Copyright 2024 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You
 * may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * PluginStatus provides a wrapper around the setPluginStatus() method
 * of the Signal K plugin API. This method allows a plugin to write a
 * message to its dashboard status display.
 * 
 * This wrapper introduces the idea of default and transient status
 * messages. A default status message one which is normally displayed,
 * whilst a transient message is one which will replace the default
 * message on the dashboard for a short period of time before being
 * automatically be overwritten by the default.
 */
export class PluginStatus {

  static app: any = undefined;
  static defaultStatus: string = '';
  static revertSeconds: number = 0;
  static revertTimeout: NodeJS.Timeout | undefined = undefined;
  static debug: boolean = false;

  /**
   * Create a new PluginStatus instance, setting a default status
   * message and, optionally, configuring the time for which transient
   * status messages will be displayed.
   * 
   * @param app - handle to Signal K app interface. 
   * @param defaultStatus - plugin status default text.
   * @param revertSeconds - number of seconds to display a transient
   *        status message (overrides DEFAULT_REVERT_SECONDS).
   */
  constructor(app: any, defaultStatus: string, revertSeconds: number = 3, debug: boolean = false) {
    PluginStatus.app = app;
    PluginStatus.defaultStatus = (defaultStatus == '')?'':(defaultStatus.charAt(0).toUpperCase() + defaultStatus.slice(1));
    PluginStatus.revertSeconds = revertSeconds;
    PluginStatus.debug = debug;

    if (PluginStatus.defaultStatus) this.setPluginStatus(PluginStatus.defaultStatus, true);
  }

  /**
   * Update the plugin status default text with a new value.
   *  
   * @param defaultStatus - new plugin status default text.
   */
  setDefaultStatus(defaultStatus: string) {
    PluginStatus.app.debug(`setDefaultStatus('${defaultStatus}')...`);
    PluginStatus.defaultStatus = (defaultStatus == '')?'':(defaultStatus.charAt(0).toUpperCase() + defaultStatus.slice(1));
    if (!PluginStatus.revertTimeout) this.setPluginStatus(PluginStatus.defaultStatus, true);
  }

  /**
   * Immediately display a status message which will be reverted to the
   * default in due course.
   * 
   * @param transientStatus - the message to be displayed.
   */
  setStatus(transientStatus: string) {
    PluginStatus.app.debug(`setStatus('${transientStatus}')...`);
    if (PluginStatus.revertTimeout) {
      clearTimeout(PluginStatus.revertTimeout);
      PluginStatus.revertTimeout = undefined;
    }
    this.setPluginStatus((transientStatus == '')?'':`${transientStatus.charAt(0).toUpperCase() + transientStatus.slice(1)}`, true);
    PluginStatus.revertTimeout = setTimeout(this.revertPluginStatus.bind(this), PluginStatus.revertSeconds * 1000);
  }

  private revertPluginStatus() {
    PluginStatus.revertTimeout = undefined;
    this.setPluginStatus(PluginStatus.defaultStatus, false);
  }

  private setPluginStatus(text: string, debug: boolean = false) {
    if (debug === true || PluginStatus.debug === true) PluginStatus.app.debug(text.charAt(0).toLowerCase() + text.slice(1));
    PluginStatus.app.setPluginStatus(`${text.charAt(0).toUpperCase() + text.slice(1)}`);
  }

}