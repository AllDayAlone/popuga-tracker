function Button({ children, className, ...props }) {
  return <button {...props} className={`py-3 align-center rounded-lg font-semibold bg-black text-white ${className}`}>{children}</button>
}

export default Button;
