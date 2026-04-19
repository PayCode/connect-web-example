import { zodResolver } from "@hookform/resolvers/zod";
import type { PayCodeConnect } from "@paycode/connect";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PinProps = {
  pc: PayCodeConnect | null;
};

const formSchema = z.object({
  pin: z.string().min(1, "Pin is required."),
  password: z.string().min(1, "Password is required."),
});

export const Pin = ({ pc }: PinProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    pc?.setPin(values.pin, values.password);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="pin"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>New Pin</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="New Pin"
              className="bg-black/20! backdrop-blur-xl"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              placeholder="Password"
              className="bg-black/20! backdrop-blur-xl"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full" variant="secondary">
        Set Pin
      </Button>
    </form>
  );
};
