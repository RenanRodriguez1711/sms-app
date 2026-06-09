export interface Contact {
  number: string;
  sms: boolean;
  call: boolean;
}

export interface BatteryLowConfig {
  enabled: boolean;
  percentage: number;
}

export interface FallAlertConfig {
  enabled: boolean;
  sensitivity: number;
  allowCall: boolean;
}

export interface SpeedAlertConfig {
  enabled: boolean;
  limit: number;
}

export interface DeviceConfig {
  contacts: Contact[];
  batteryLow: BatteryLowConfig;
  fallAlert: FallAlertConfig;
  speedAlert: SpeedAlertConfig;
}

export interface DeviceParams {
  phone: string;
  name: string;
  model: string;
}

export type CommandType = 
  | "contact-1" | "contact-2" | "contact-3" | "contact-4" | "contact-5"
  | "battery-low"
  | "fall-alert"
  | "speed-alert"
  | "query-battery"
  | "query-location"
  | "query-status"
  | "query-signal";
