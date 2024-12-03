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
 */

export class PluginStatus {
  static DEFAULT_REVERT_SECONDS: number = 10;

  static app: any = undefined;
  static defaultStatus: string = '';
  static revertSeconds: number = PluginStatus.DEFAULT_REVERT_SECONDS;
  static revertTimeout: NodeJS.Timeout | undefined = undefined;

  /**
   *  Create a new PluginStatus instance, setting a default status
   *  message for the plugin and, optionally, configuring the time for
   *  which transient status messages will be displayed.
   * 
   * @param app - handle to the Signal K app interface. 
   * @param defaultStatus - plugin status default text.
   * @param revertSeconds - number of seconds to display a transient
   *        status message.
   */
  constructor(app: any, defaultStatus: string, revertSeconds?: number) {
    PluginStatus.app = app;
    PluginStatus.defaultStatus = defaultStatus.charAt(0).toUpperCase() + defaultStatus.slice(1);
    PluginStatus.revertSeconds = (revertSeconds)?revertSeconds:PluginStatus.DEFAULT_REVERT_SECONDS;

    if (PluginStatus.defaultStatus) this.setPluginStatus(PluginStatus.defaultStatus, true);
  }

  /**
   * Update the plugin status default text with a new value.
   *  
   * @param defaultStatus - new plugin status default text.
   */

  setDefaultStatus(defaultStatus: string) {
    PluginStatus.defaultStatus = defaultStatus.charAt(0).toUpperCase() + defaultStatus.slice(1);
    if (!PluginStatus.revertTimeout) this.setPluginStatus(PluginStatus.defaultStatus, true);
  }

  setStatus(transientStatus: string) {
    if (PluginStatus.revertTimeout) {
      clearTimeout(PluginStatus.revertTimeout);
      PluginStatus.revertTimeout = undefined;
    }
    this.setPluginStatus(`${transientStatus.charAt(0).toUpperCase() + transientStatus.slice(1)}...`, true);
    PluginStatus.revertTimeout = setTimeout(this.revertPluginStatus, PluginStatus.revertSeconds * 1000)
  }

  private revertPluginStatus() {
    PluginStatus.revertTimeout = undefined;
    this.setPluginStatus(PluginStatus.defaultStatus, false);
  }

  private setPluginStatus(text: string, debug?: boolean) {
    if (debug) PluginStatus.app.debug(text.charAt(0).toLowerCase + text.slice(0));
    PluginStatus.app.setPluginStatus(`${text.charAt(0).toUpperCase() + text.slice(1)}...`);
  }

}