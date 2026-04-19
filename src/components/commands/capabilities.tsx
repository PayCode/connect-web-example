import { zodResolver } from "@hookform/resolvers/zod";
import type { PayCodeConnect } from "@paycode/connect";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CapabilitiesProps = {
  pc: PayCodeConnect | null;
};

const formSchema = z.object({
  scannerPrefixes: z.string(),
  pingInternetConnectivity: z.boolean(),
  forceRemoteControl: z.boolean(),
  disableManualPayments: z.boolean(),
});

export const Capabilities = ({ pc }: CapabilitiesProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scannerPrefixes: "",
      pingInternetConnectivity: false,
      forceRemoteControl: false,
      disableManualPayments: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const scannerPrefixes = values.scannerPrefixes
      .split(",")
      .map((prefix) => prefix.trim())
      .filter((prefix) => prefix.length > 0);
    const capabilities = {
      scannerPrefixes,
      pingInternetConnectivity: values.pingInternetConnectivity,
      forceRemoteControl: values.forceRemoteControl,
      disableManualPayments: values.disableManualPayments,
    };

    pc?.setCapabilities(capabilities);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="scannerPrefixes"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Scanner Prefixes</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Scanner Prefixes"
              className="bg-black/20! backdrop-blur-xl"
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>
              Comma separated scanner prefixes.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="pingInternetConnectivity"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <Checkbox
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldContent>
              <FieldLabel htmlFor={field.name} className="font-normal">
                Ping Internet Connectivity
              </FieldLabel>
              <FieldDescription>
                Enable internet connectivity checking.
              </FieldDescription>
            </FieldContent>
          </Field>
        )}
      />
      <Controller
        name="forceRemoteControl"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <Checkbox
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel htmlFor={field.name} className="font-normal">
              Force Remote Control Mode
            </FieldLabel>
          </Field>
        )}
      />
      <Controller
        name="disableManualPayments"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <Checkbox
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel htmlFor={field.name} className="font-normal">
              Disable Manual Payments
            </FieldLabel>
          </Field>
        )}
      />
      <Button type="submit" className="w-full" variant="secondary">
        Set Capabilities
      </Button>
    </form>
  );
};
