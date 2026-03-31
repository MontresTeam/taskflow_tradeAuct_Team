import { toIsoDatePart } from '../lib/dateFormat';

interface DateInputDDMMYYYYProps {
  value: string;
  onChange: (iso: string) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  /** When true, blur with empty text clears the value (emits ''). */
  allowEmpty?: boolean;
  /** Called after blur once the value is parsed and applied (or reverted). */
  onCommit?: () => void;
}

export default function DateInputDDMMYYYY({
  value,
  onChange,
  className = '',
  id,
  disabled,
  allowEmpty = false,
  onCommit,
}: DateInputDDMMYYYYProps) {
  const isoValue = toIsoDatePart(value);

  return (
    <input
      id={id}
      type="date"
      disabled={disabled}
      className={className}
      value={isoValue}
      onChange={(e) => {
        const next = e.target.value;
        if (!next && !allowEmpty) return;
        onChange(next);
      }}
      onBlur={() => onCommit?.()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}
