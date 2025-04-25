import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useHookForm } from "react-hook-form";
import { z } from "zod";

export function useZodForm<TSchema extends z.ZodType>(schema: TSchema, defaultValues?: z.infer<TSchema>) {
  return useHookForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
}
