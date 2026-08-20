import FocusApp from "./focus-app";

export default function Page(){
  return <FocusApp initialNow={new Date().toISOString()}/>;
}
