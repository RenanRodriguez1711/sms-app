import { CommandType, Contact, BatteryLowConfig, FallAlertConfig, SpeedAlertConfig } from "../../types/device";

export function generateSMS(
  commandType: CommandType,
  config: any
): string {
  switch (commandType) {
    case "contact-1":
    case "contact-2":
    case "contact-3":
    case "contact-4":
    case "contact-5": {
      const contactNum = commandType.split("-")[1];
      const contact = config as Contact;
      if (!contact.number) return "";
      return `A${contactNum},${contact.sms ? 1 : 0},${contact.call ? 1 : 0},${contact.number}`;
    }

    case "battery-low": {
      const battery = config as BatteryLowConfig;
      return `Low${battery.enabled ? 1 : 0},${battery.percentage}`;
    }

    case "fall-alert": {
      const fall = config as FallAlertConfig;
      return `fl${fall.enabled ? 1 : 0},${fall.sensitivity},${fall.allowCall ? 1 : 0}`;
    }

    case "speed-alert": {
      const speed = config as SpeedAlertConfig;
      return `Speed${speed.enabled ? 1 : 0},${speed.limit}km/h`;
    }

    case "query-battery":
      return "battery";

    case "query-location":
      return "loc";

    case "query-status":
      return "status";

    case "query-signal":
      return "V?";

    default:
      return "";
  }
}

export function openSMS(devicePhone: string, message: string): void {
  const smsUrl = `sms:${devicePhone}?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
}
