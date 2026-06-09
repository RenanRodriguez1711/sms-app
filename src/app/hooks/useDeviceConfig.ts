import { useState, useEffect, useCallback } from "react";
import { DeviceConfig, Contact, BatteryLowConfig, FallAlertConfig, SpeedAlertConfig } from "../../types/device";

const DEFAULT_CONFIG: DeviceConfig = {
  contacts: [
    { number: "", sms: true, call: true },
    { number: "", sms: true, call: true },
    { number: "", sms: true, call: true },
    { number: "", sms: true, call: true },
    { number: "", sms: true, call: true },
  ],
  batteryLow: {
    enabled: false,
    percentage: 15,
  },
  fallAlert: {
    enabled: false,
    sensitivity: 5,
    allowCall: true,
  },
  speedAlert: {
    enabled: false,
    limit: 80,
  },
};

export function useDeviceConfig(phoneNumber: string) {
  const [config, setConfig] = useState<DeviceConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `device-config-${phoneNumber}`;

  // Load config from localStorage on mount
  useEffect(() => {
    if (!phoneNumber) {
      setIsLoaded(true);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch {
        setConfig(DEFAULT_CONFIG);
      }
    } else {
      setConfig(DEFAULT_CONFIG);
    }
    setIsLoaded(true);
  }, [phoneNumber, storageKey]);

  // Auto-save to localStorage whenever config changes
  useEffect(() => {
    if (isLoaded && phoneNumber) {
      localStorage.setItem(storageKey, JSON.stringify(config));
    }
  }, [config, phoneNumber, storageKey, isLoaded]);

  const updateContact = useCallback((index: number, contact: Contact) => {
    setConfig((prev) => {
      const newContacts = [...prev.contacts];
      newContacts[index] = contact;
      return { ...prev, contacts: newContacts };
    });
  }, []);

  const updateBatteryLow = useCallback((batteryLow: BatteryLowConfig) => {
    setConfig((prev) => ({ ...prev, batteryLow }));
  }, []);

  const updateFallAlert = useCallback((fallAlert: FallAlertConfig) => {
    setConfig((prev) => ({ ...prev, fallAlert }));
  }, []);

  const updateSpeedAlert = useCallback((speedAlert: SpeedAlertConfig) => {
    setConfig((prev) => ({ ...prev, speedAlert }));
  }, []);

  return {
    config,
    isLoaded,
    updateContact,
    updateBatteryLow,
    updateFallAlert,
    updateSpeedAlert,
  };
}
