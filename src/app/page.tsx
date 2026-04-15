import SplashScreen from "@/components/splashScreen/SplashScreen";
import { redirect } from "next/navigation";

export default function Home() {
  // redirect("/login");
  return <SplashScreen />;
}
