import { ChangeEventHandler, FocusEventHandler, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { HTMLInputProps, KeyOfType } from "types";

export interface TextInputProps<T extends FieldValues = any>
  extends Omit<HTMLInputProps, "name" | "defaultValue">,
    Omit<UseControllerProps<T>, "name"> {
  name: KeyOfType<T>;
}

export const TextInput = ({ name, className, control, ...props }: TextInputProps) => {
  const classes = twMerge(`rounded-xl border-black border py-4 px-2 mr-4 ${className}`);

  const {
    field: { onChange, value, ref }
  } = useController({
    name,
    control,
    rules: { required: true }
  });

  const onChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      onChange(e);
    },
    [onChange]
  );

  return (
    <input
      {...props}
      type="text"
      className={classes}
      id={name}
      spellCheck={false}
      onChange={onChangeHandler}
      value={value}
      name={name}
      ref={ref}
    />
  );
};
