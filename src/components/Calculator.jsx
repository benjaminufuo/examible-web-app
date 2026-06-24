import { useState, useRef, useLayoutEffect } from "react";
import { FaCalculator, FaTimes } from "react-icons/fa";
import "../styles/calculator.css";

const isOp = (char) => ["+", "-", "*", "/"].includes(char);

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const posRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  const getBounds = () => {
    if (!wrapperRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const el = wrapperRef.current;
    const padding = 10;
    const minX = padding - el.offsetLeft;
    const maxX = window.innerWidth - padding - el.offsetWidth - el.offsetLeft;
    const minY = padding - el.offsetTop;
    const maxY = window.innerHeight - padding - el.offsetHeight - el.offsetTop;
    return {
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minY: Math.min(minY, maxY),
      maxY: Math.max(minY, maxY),
    };
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    wrapperRef.current?.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const rawX = e.clientX - dragStart.current.x;
    const rawY = e.clientY - dragStart.current.y;
    const { minX, maxX, minY, maxY } = getBounds();
    const newX = Math.min(Math.max(rawX, minX), maxX);
    const newY = Math.min(Math.max(rawY, minY), maxY);
    if (!hasMovedRef.current && (Math.abs(newX - posRef.current.x) > 3 || Math.abs(newY - posRef.current.y) > 3)) {
      hasMovedRef.current = true;
    }
    posRef.current = { x: newX, y: newY };
    // Update DOM directly — no React re-render on every pixel
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    const wasTap = !hasMovedRef.current;
    isDraggingRef.current = false;
    setIsDragging(false);
    setPosition({ ...posRef.current });
    if (wasTap && !isOpen) setIsOpen(true);
  };

  useLayoutEffect(() => {
    const adjustBounds = () => {
      if (!wrapperRef.current) return;
      const { minX, maxX, minY, maxY } = getBounds();
      setPosition((prev) => {
        const newX = Math.min(Math.max(prev.x, minX), maxX);
        const newY = Math.min(Math.max(prev.y, minY), maxY);
        if (newX !== prev.x || newY !== prev.y) {
          posRef.current = { x: newX, y: newY };
          return { x: newX, y: newY };
        }
        return prev;
      });
    };
    adjustBounds();
    window.addEventListener("resize", adjustBounds);
    return () => window.removeEventListener("resize", adjustBounds);
  }, [isOpen]);

  const handleClear = () => setInput("");

  const handleDelete = () => {
    if (["Error", "Overflow"].includes(input)) {
      setInput("");
      return;
    }
    // Delete multi-char tokens inserted as a unit
    const last2 = input.slice(-2);
    if (last2 === "√(" || last2 === "^2") {
      setInput((prev) => prev.slice(0, -2));
    } else {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  const handleButtonClick = (value) => {
    const errorStates = ["Error", "Overflow"];

    if (errorStates.includes(input)) {
      if (isOp(value) || [".", ")", "%"].includes(value)) return;
      setInput(value);
      return;
    }

    const lastChar = input.slice(-1);

    // Prevent starting expression with * or /
    if (!input && ["*", "/"].includes(value)) return;

    // Consecutive operator handling
    if (isOp(value) && isOp(lastChar)) {
      // Allow 5*- or 5/- (negative operand)
      if (value === "-" && ["*", "/"].includes(lastChar)) {
        setInput((prev) => prev + value);
        return;
      }
      // Replace last operator
      setInput((prev) => prev.slice(0, -1) + value);
      return;
    }

    // If pressing an operator after *- or /- (e.g. "5*-" + "+"), replace both
    if (isOp(value) && input.length >= 2) {
      const last2 = input.slice(-2);
      if (["*", "/"].includes(last2[0]) && last2[1] === "-") {
        setInput((prev) => prev.slice(0, -2) + value);
        return;
      }
    }

    // Decimal: auto-prepend 0, prevent double decimal in same number
    if (value === ".") {
      if (!input || isOp(lastChar) || lastChar === "(") {
        setInput((prev) => prev + "0.");
        return;
      }
      const segments = input.split(/[+\-*/()√^%]/);
      if (segments[segments.length - 1].includes(".")) return;
    }

    // Closing paren: only if unmatched open exists, not right after ( or operator
    if (value === ")") {
      const opens = (input.match(/\(/g) || []).length;
      const closes = (input.match(/\)/g) || []).length;
      if (closes >= opens || lastChar === "(" || isOp(lastChar)) return;
    }

    // Percent: only after a digit or closing paren, not doubled
    if (value === "%") {
      if (!lastChar || (!/\d/.test(lastChar) && lastChar !== ")")) return;
      if (lastChar === "%") return;
    }

    setInput((prev) => prev + value);
  };

  const handleNegate = () => {
    if (!input || ["Error", "Overflow"].includes(input)) return;

    // Simple case: entire input is a number
    if (/^-?\d+(?:\.\d+)?$/.test(input)) {
      setInput(input.startsWith("-") ? input.slice(1) : "-" + input);
      return;
    }

    // Find the last number at end of the expression and toggle its sign
    const numMatch = input.match(/(-?\d+(?:\.\d+)?)$/);
    if (!numMatch) return;
    const numStr = numMatch[1];
    const prefix = input.slice(0, input.length - numStr.length);
    const prefixLast = prefix.slice(-1);

    if (numStr.startsWith("-")) {
      setInput(prefix + numStr.slice(1));
    } else if (!prefix || isOp(prefixLast) || prefixLast === "(") {
      setInput(prefix + "-" + numStr);
    }
  };

  const handleSqrt = () => {
    if (["Error", "Overflow"].includes(input)) return;
    const lastChar = input.slice(-1);
    // Auto-insert * when following a number or closing paren
    if (lastChar && (/\d/.test(lastChar) || lastChar === ")")) {
      setInput((prev) => prev + "*√(");
    } else {
      setInput((prev) => prev + "√(");
    }
  };

  const handleSquare = () => {
    if (!input || ["Error", "Overflow"].includes(input)) return;
    const lastChar = input.slice(-1);
    if (/\d/.test(lastChar) || lastChar === ")") {
      setInput((prev) => prev + "^2");
    }
  };

  const handleCalculate = () => {
    if (!input || ["Error", "Overflow"].includes(input)) return;
    try {
      // Strip trailing operator before evaluating
      let expr = input.replace(/[+\-*/]$/, "");
      if (!expr) return;

      // Auto-close any unclosed parentheses
      const opens = (expr.match(/\(/g) || []).length;
      const closes = (expr.match(/\)/g) || []).length;
      expr += ")".repeat(Math.max(0, opens - closes));

      // Convert display symbols to valid JS
      expr = expr
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/\^/g, "**")
        .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

      // Safety: after removing known safe identifiers, nothing unexpected should remain
      const check = expr
        .replace(/Math\.sqrt/g, "")
        .replace(/[\d+\-*/.() ]/g, "");
      if (check.length > 0) {
        setInput("Error");
        return;
      }

      // eslint-disable-next-line no-new-func
      const result = new Function("return " + expr)();

      if (result === Infinity || result === -Infinity) {
        setInput("Overflow");
        return;
      }
      if (typeof result !== "number" || isNaN(result)) {
        setInput("Error");
        return;
      }

      // Trim floating-point noise (e.g. 0.1 + 0.2 = 0.30000000004)
      setInput(String(parseFloat(result.toPrecision(10))));
    } catch {
      setInput("Error");
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`calculator-wrapper ${isOpen ? "open" : ""}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {!isOpen && (
        <button
          className="calc-toggle-btn"
          onPointerDown={handlePointerDown}
          title="Open Calculator"
          style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
        >
          <FaCalculator size={24} />
        </button>
      )}

      {isOpen && (
        <div className="calculator-container">
          <div
            className="calculator-header"
            onPointerDown={handlePointerDown}
            style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}
          >
            <span>Calculator</span>
            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Close Calculator"
            />
          </div>

          <div className="calculator-display">{input || "0"}</div>

          <div className="calculator-keypad">
            {/* Scientific row */}
            <button onClick={handleSqrt} className="calc-btn scientific" title="Square root">
              &#x221A;
            </button>
            <button onClick={handleSquare} className="calc-btn scientific" title="Square">
              x&sup2;
            </button>
            <button
              onClick={() => handleButtonClick("%")}
              className="calc-btn scientific"
              title="Percent"
            >
              %
            </button>
            <button onClick={handleDelete} className="calc-btn backspace" title="Delete">
              DEL
            </button>

            {/* Row 2 */}
            <button onClick={handleClear} className="calc-btn clear">
              C
            </button>
            <button onClick={() => handleButtonClick("(")} className="calc-btn">
              (
            </button>
            <button onClick={() => handleButtonClick(")")} className="calc-btn">
              )
            </button>
            <button onClick={() => handleButtonClick("/")} className="calc-btn operator">
              &divide;
            </button>

            {/* Row 3 */}
            <button onClick={() => handleButtonClick("7")} className="calc-btn">7</button>
            <button onClick={() => handleButtonClick("8")} className="calc-btn">8</button>
            <button onClick={() => handleButtonClick("9")} className="calc-btn">9</button>
            <button onClick={() => handleButtonClick("*")} className="calc-btn operator">
              &times;
            </button>

            {/* Row 4 */}
            <button onClick={() => handleButtonClick("4")} className="calc-btn">4</button>
            <button onClick={() => handleButtonClick("5")} className="calc-btn">5</button>
            <button onClick={() => handleButtonClick("6")} className="calc-btn">6</button>
            <button onClick={() => handleButtonClick("-")} className="calc-btn operator">
              &minus;
            </button>

            {/* Row 5 */}
            <button onClick={() => handleButtonClick("1")} className="calc-btn">1</button>
            <button onClick={() => handleButtonClick("2")} className="calc-btn">2</button>
            <button onClick={() => handleButtonClick("3")} className="calc-btn">3</button>
            <button onClick={() => handleButtonClick("+")} className="calc-btn operator">
              +
            </button>

            {/* Row 6 */}
            <button onClick={handleNegate} className="calc-btn scientific" title="Toggle sign">
              +/&minus;
            </button>
            <button onClick={() => handleButtonClick("0")} className="calc-btn">
              0
            </button>
            <button onClick={() => handleButtonClick(".")} className="calc-btn">
              .
            </button>
            <button onClick={handleCalculate} className="calc-btn equal">
              =
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
