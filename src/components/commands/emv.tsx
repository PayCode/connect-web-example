import { zodResolver } from "@hookform/resolvers/zod";
import type { EMVData, PayCodeConnect } from "@paycode/connect";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type EmvProps = {
  pc: PayCodeConnect | null;
};

const formSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(
      /^\d*\.?\d+$/,
      "Must be a valid number (digits and optional decimal point only)",
    )
    .transform((val) => {
      const num = Number.parseFloat(val);
      return num.toFixed(2);
    }),
});

export const Emv = ({ pc }: EmvProps) => {
  const [useRandomAmounts, setUseRandomAmounts] = useState(false);
  const didSetListeners = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const generateRandomAmount = () => {
    const min = 20.0;
    const max = 200.0;
    const randomAmount = Math.random() * (max - min) + min;
    return randomAmount.toFixed(2);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const amount = useRandomAmounts ? generateRandomAmount() : values.amount;
      pc?.startEMV(parseFloat(amount));
      if (!useRandomAmounts) form.reset();
    } catch (_) {
      // TODO: notify
    }
  };

  const handleCheckedChange = (checked: boolean) => {
    setUseRandomAmounts(checked);

    if (checked) form.setValue("amount", "0.00");
    else form.setValue("amount", "");
  };

  const handleEmvEvent = useCallback((data: EMVData) => {
    // TODO: render this
    console.log(data);
  }, []);

  useEffect(() => {
    if (!didSetListeners.current && pc !== null) {
      didSetListeners.current = true;
      pc?.on("emvState", handleEmvEvent);
    }
  }, [pc, handleEmvEvent]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
      <Controller
        name="amount"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Amount"
              className="bg-black/20! backdrop-blur-xl"
              disabled={useRandomAmounts}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field orientation="horizontal">
        <Checkbox
          id="random-amounts"
          checked={useRandomAmounts}
          onCheckedChange={handleCheckedChange}
        />
        <FieldLabel htmlFor="random-amounts" className="font-normal">
          Random amounts
        </FieldLabel>
      </Field>
      <Button type="submit" className="w-full" variant="secondary">
        Start EMV
      </Button>
    </form>
  );
};
