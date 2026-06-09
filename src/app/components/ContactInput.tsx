import React from "react"
import { Contact } from "../../types/device"
import { Switch } from "./ui/Switch"
import { Label } from "./ui/Label"
import { cn } from "../utils/cn"

interface ContactInputProps {
  value: Contact;
  onChange: (contact: Contact) => void;
  contactNumber: number;
}

export const ContactInput = React.forwardRef<HTMLInputElement, ContactInputProps>(
  ({ value, onChange, contactNumber }, ref) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value
        .replace(/\D/g, "") // Remove non-digits
        .slice(0, 8); // Max 8 digits

      onChange({
        ...value,
        number: `9${input}`,
      });
    };

    const handleSmsToggle = (checked: boolean) => {
      onChange({
        ...value,
        sms: checked,
      });
    };

    const handleCallToggle = (checked: boolean) => {
      onChange({
        ...value,
        call: checked,
      });
    };

    const displayValue = value.number
      ? `9 ${value.number.slice(1, 5)} ${value.number.slice(5)}`
      : "9 ";

    return (
      <div className="space-y-4 p-4 bg-muted rounded-lg">
        <div className="space-y-2">
          <Label htmlFor={`phone-${contactNumber}`} className="text-base">
            Teléfono (9 dígitos)
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold pointer-events-none">
              9
            </span>
            <input
              ref={ref}
              id={`phone-${contactNumber}`}
              type="tel"
              inputMode="numeric"
              placeholder="1234 5678"
              maxLength={8}
              value={value.number.slice(1) || ""}
              onChange={handlePhoneChange}
              className={cn(
                "flex h-12 w-full rounded-lg border-2 border-border bg-background px-4 py-2 pl-10 text-base font-medium transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              )}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Formato final: {displayValue}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <Label htmlFor={`sms-${contactNumber}`} className="text-base font-medium">
              ☑ Recibir SMS
            </Label>
            <Switch
              id={`sms-${contactNumber}`}
              checked={value.sms}
              onCheckedChange={handleSmsToggle}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <Label htmlFor={`call-${contactNumber}`} className="text-base font-medium">
              ☑ Recibir Llamadas
            </Label>
            <Switch
              id={`call-${contactNumber}`}
              checked={value.call}
              onCheckedChange={handleCallToggle}
            />
          </div>
        </div>
      </div>
    );
  }
);

ContactInput.displayName = "ContactInput"
