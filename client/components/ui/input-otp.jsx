import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const InputOTP = React.forwardRef(
	({ className, value, onChange, length = 6, loading = false, disabled = false, ...props }, ref) => {
		const [values, setValues] = React.useState(Array(length).fill(""));
		const inputRefs = React.useRef([]);
		const [focusedIndex, setFocusedIndex] = React.useState(null);

		React.useEffect(() => {
			if (value !== undefined && value !== null) {
				const digits = String(value).replace(/\D/g, "").slice(0, length).split("");
				const newValues = Array(length).fill("");
				digits.forEach((digit, idx) => {
					if (idx < length) newValues[idx] = digit;
				});
				setValues(newValues);
			} else if (value === "") {
				// Reset quando value é explicitamente vazio
				setValues(Array(length).fill(""));
			}
		}, [value, length]);

		React.useEffect(() => {
			if (loading && values.every((v) => v !== "")) {
				// Desabilita inputs quando está carregando e completo
				inputRefs.current.forEach((ref) => {
					if (ref) ref.blur();
				});
			}
		}, [loading, values]);

		const handleChange = (index, newValue) => {
			if (disabled || loading) return;
			if (!/^\d$/.test(newValue) && newValue !== "") return;

			const newValues = [...values];
			newValues[index] = newValue.slice(-1);
			setValues(newValues);

			const combined = newValues.join("");
			onChange?.(combined);

			if (newValue && index < length - 1) {
				setTimeout(() => {
					inputRefs.current[index + 1]?.focus();
				}, 0);
			}
		};

		const handleKeyDown = (index, e) => {
			if (disabled || loading) return;

			if (e.key === "Backspace" && !values[index] && index > 0) {
				inputRefs.current[index - 1]?.focus();
			}
		};

		const handlePaste = (e) => {
			if (disabled || loading) return;

			e.preventDefault();
			const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
			const newValues = Array(length).fill("");
			pasted.split("").forEach((digit, idx) => {
				if (idx < length) newValues[idx] = digit;
			});
			setValues(newValues);
			const combined = newValues.join("");
			onChange?.(combined);
			const nextIndex = Math.min(pasted.length, length - 1);
			setTimeout(() => {
				inputRefs.current[nextIndex]?.focus();
			}, 0);
		};

		const isComplete = values.every((v) => v !== "") && values.length === length;
		const showLoading = loading && isComplete;

		return (
			<div className={cn("relative flex gap-2 justify-center", className)} {...props}>
				{Array.from({ length }).map((_, index) => (
					<div key={index} className="relative">
						<input
							ref={(el) => (inputRefs.current[index] = el)}
							type="text"
							inputMode="numeric"
							maxLength={1}
							value={values[index]}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							onFocus={() => setFocusedIndex(index)}
							onBlur={() => setFocusedIndex(null)}
							disabled={disabled || loading}
							className={cn(
								"h-14 w-14 rounded-lg border-2 bg-white/5 backdrop-blur-sm text-center text-2xl font-bold text-white",
								"transition-all duration-200",
								"focus-visible:outline-none focus-visible:ring-0",
								focusedIndex === index
									? "border-white/60 bg-white/10 scale-105"
									: values[index]
									? "border-white/40 bg-white/8"
									: "border-white/20 bg-white/5",
								(disabled || loading) && "opacity-50 cursor-not-allowed",
								showLoading && "border-white/30"
							)}
						/>
					</div>
				))}
				{showLoading && (
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
						<Loader2 className="h-6 w-6 animate-spin text-white" />
					</div>
				)}
			</div>
		);
	}
);
InputOTP.displayName = "InputOTP";

export { InputOTP };
