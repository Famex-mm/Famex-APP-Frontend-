import { Loading } from "../../SVG";

export default function ButtonGradientOutline(props) {
  return (
    <div
        style={{backgroundImage: "url('/button-bg.svg')"}}
      className={`flex justify-center items-center text-white bg-no-repeat bg-contain bg-center rounded-full ${props.disabled ? "hover:cursor-not-allowed bg-gray-100 !text-gray-500" : "hover:cursor-pointer"} transition ${props.classNames}`}
      onClick={props.handleClick}
      disabled={props.disabled ? props.disabled : false}
    >
      {props.isLoading && Loading}
      {props.icon && <i className={props.icon + " mr-2.5"} />}
      {props.name}
      {props.children}
    </div>
  );
}
