export default function InputSubmit(props) {
    if (props.hideButton) {
        return ""
    } else
  return (
    <div
      onClick={props.submitFunction}
      className={` flex flex-row items-center justify-center h-7.5 text-white bg-indigo-500 rounded-2xl px-3.75 py-1.25  transition ${props.hideButton ? "hover:disabled disabled hover:pointer-events-none hover:cursor-none  bg-indigo-500/50" : "hover:cursor-pointer hover:bg-indigo-500/80"}`}
    >
      <i className={props.icon + " mt-[2px] mr-1"}></i>
      {props.name}
    </div>
  );
}
