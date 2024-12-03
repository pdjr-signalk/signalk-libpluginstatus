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
export declare class PluginStatus {
    static DEFAULT_REVERT_SECONDS: number;
    static app: any;
    static defaultStatus: string;
    static revertSeconds: number;
    static revertTimeout: NodeJS.Timeout | undefined;
    /**
     *  Create a new PluginStatus instance, setting a default status
     *  message for the plugin and, optionally, configuring the time for
     *  which transient status messages will be displayed.
     *
     * @param app - handle to Signal K app interface.
     * @param defaultStatus - plugin status default text.
     * @param revertSeconds - number of seconds to display a transient
     *        status message.
     */
    constructor(app: any, defaultStatus: string, revertSeconds?: number);
    /**
     * Update the plugin status default text with a new value.
     *
     * @param defaultStatus - new plugin status default text.
     */
    setDefaultStatus(defaultStatus: string): void;
    setStatus(transientStatus: string): void;
    private revertPluginStatus;
    private setPluginStatus;
}
