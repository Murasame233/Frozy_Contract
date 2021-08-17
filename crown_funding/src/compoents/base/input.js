export default function Input(props) {
  return (
    <input
      onChange={props.onChange}
      className={
        "w-full px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline " +
        (props.h ? "h-" + props.h : "h-10")
      }
      type={props.type ? props.type : "text"}
      value={props.value}
      maxLength={props.maxLength}
      disabled={props.disabled}
    />
  );
}
