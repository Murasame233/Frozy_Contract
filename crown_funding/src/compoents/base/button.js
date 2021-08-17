export default function Button(props) {
  var hadnleclass = () => {
    if (props.className) {
      return props.className;
    } else {
      return "";
    }
  };
  var hadnlewidth = () => {
    if (props.w) {
      return " w-"+props.w;
    } else {
      return " w-20";
    }
  };
  var hadnledisabled = () => {
    if (props.disabled) {
      return " cursor-default  text-grey-300";
    } else {
      return " text-grey-700";
    }
  };
  return (
    <button
      className={
        "p-0.5 h-10 border border-lg rounded-lg focus:shadow-outline " +
        hadnleclass()+hadnlewidth()+hadnledisabled()+" hover:text-opacity-50"
      }
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
