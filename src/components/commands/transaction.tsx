import { zodResolver } from "@hookform/resolvers/zod";
import type { PayCodeConnect } from "@paycode/connect";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TransactionProps = {
  pc: PayCodeConnect | null;
};

const formSchema = z.object({
  folio: z.string().min(1, "Folio is required."),
});

export const Transaction = ({ pc }: TransactionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folio: "",
    },
  });

  const handlePrint = async (values: z.infer<typeof formSchema>) => {
    pc?.printTransaction(values.folio);
  };

  const handleReverse = async (values: z.infer<typeof formSchema>) => {
    pc?.reverseTransaction(values.folio);
  };

  return (
    <form className="space-y-4">
      <Controller
        name="folio"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Folio</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="Folio"
              className="bg-black/20! backdrop-blur-xl"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={form.handleSubmit(handlePrint)}
        >
          Print Transaction
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={form.handleSubmit(handleReverse)}
        >
          Reverse Transaction
        </Button>
      </div>
    </form>
  );
};
