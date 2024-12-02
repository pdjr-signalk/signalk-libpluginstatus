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
  static defaultStatus: string | undefined = undefined;
  static revertSeconds: number = PluginStatus.DEFAULT_REVERT_SECONDS;
  static revertTimeout: NodeJS.Timeout | undefined = undefined;

  constructor(app: any, defaultStatus: string, revertSeconds?: number) {
    PluginStatus.app = app;
    PluginStatus.defaultStatus = defaultStatus;
    PluginStatus.revertSeconds = (revertSeconds)?revertSeconds:PluginStatus.DEFAULT_REVERT_SECONDS;

    if (PluginStatus.defaultStatus) app.setPluginStatus(PluginStatus.defaultStatus);
  }

  setDefaultStatus(message: string) {
    PluginStatus.defaultStatus = message;
    if (!PluginStatus.revertTimeout) PluginStatus.app.setPluginStatus(PluginStatus.defaultStatus);
  }

  setStatus(message: string) {
    if (PluginStatus.revertTimeout) {
      clearTimeout(PluginStatus.revertTimeout);
      PluginStatus.revertTimeout = undefined;
    }
    PluginStatus.app.debug(`${message}...`);
    PluginStatus.app.setPluginStatus(`${message}...`);
    PluginStatus.revertTimeout = setTimeout(this.revertStatus, PluginStatus.revertSeconds * 1000)
  }

  revertStatus() {
    PluginStatus.revertTimeout = undefined;
    PluginStatus.app.setPluginStatus(PluginStatus.defaultStatus);
  }

}