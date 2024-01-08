import { HashLoader } from "react-spinners";

function Loading({ className = "" }) {
  return <HashLoader color="#36d7b7" className={`${className} mx-auto`} size={55} />;
}

export default Loading;
