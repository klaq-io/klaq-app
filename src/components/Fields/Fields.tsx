import { useEffect, useId, useRef } from 'react';

const formClasses = {
  klaq: 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
  black:
    'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6',
};
type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
};

export const Label = (props: LabelProps) => {
  const { htmlFor, children } = props;

  return (
    <label
      className="block text-sm font-medium leading-6 text-gray-900 mb-2"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

type TextFieldProps = {
  label?: string;
  variant?: 'klaq' | 'black';
  error?: string | null;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'id'>;

export const TextField = (props: TextFieldProps) => {
  const { label, type = 'text', variant = 'klaq', className, error } = props;
  const id = useId();

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses[variant]} />
      {error && <p className="mt-2 text-sm text-danger-600">{error}</p>}
    </div>
  );
};

type SelectFieldProps = {
  label?: string;
} & Omit<React.ComponentPropsWithoutRef<'select'>, 'id'>;

export const SelectField = (props: SelectFieldProps) => {
  const { label, className } = props;
  const id = useId();

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <select id={id} {...props} className={formClasses['klaq']} />
    </div>
  );
};

type TextAreaProps = {
  label?: string;
  error?: string | null;
} & Omit<React.ComponentPropsWithoutRef<'textarea'>, 'id'>;

export const TextArea = (props: TextAreaProps) => {
  const { label, className, error } = props;
  const id = useId();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: unknown,
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        textAreaRef.style.height = '0px';
        const scrollHeight = textAreaRef.scrollHeight;

        textAreaRef.style.height = scrollHeight + 'px';
      }
    }, [textAreaRef, value]);
  };

  useAutosizeTextArea(textAreaRef.current, props.value || '');

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <textarea
        ref={textAreaRef}
        id={id}
        {...props}
        className={formClasses['klaq']}
      />
      {error && <p className="mt-2 text-sm text-danger-600">{error}</p>}
    </div>
  );
};
