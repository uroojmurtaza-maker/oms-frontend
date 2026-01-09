

import React from "react";

const Button = ({
  children,
  variant = "solid",
  color = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null, // ✅ Accept React element instead of image src
  iconPosition = "left", // ✅ Control where the icon appears
  onClick,
  className = "",
}) => {
  const baseStyles =
    "font-medium rounded-md transition-all duration-300 flex items-center justify-center gap-2";

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-1.5 text-sm",
    lg: "px-5 py-3 text-lg",
  };

  const colorStyles = {
    primary: "bg-primary text-white hover:bg-[#E1AB20]",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    blue: "bg-[#1E3B8A] hover:bg-blue-700 text-white",
  };

  const outlineStyles = {
    primary:
      "border border-primary text-primary hover:bg-secondary font-semibold",
    secondary: "border border-gray-600 text-gray-600 hover:bg-gray-100",
    success: "border border-green-600 text-green-600 hover:bg-green-100",
    danger: "border border-red-600 text-red-600 hover:bg-red-100",
    warning: "border border-yellow-500 text-yellow-500 hover:bg-yellow-100",
    blue: "border border-[#1E3B8A] text-[#1E3B8A] hover:bg-blue-50",
  };

  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variant === "solid" ? colorStyles[color] : outlineStyles[color]}
    ${fullWidth ? "w-full" : ""}
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={!loading ? onClick : undefined}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      {/* ✅ Render icon on the left */}
      {icon && iconPosition === "left" && (
        <span className="flex items-center justify-center text-lg">{icon}</span>
      )}

      {children}

      {/* ✅ Render icon on the right */}
      {icon && iconPosition === "right" && (
        <span className="flex items-center justify-center">{icon}</span>
      )}
    </button>
  );
};

export default Button;