import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import InfoPanel from "./components/InfoPanel";
import LoginForm from "./components/Login";
import Marks from "./components/Marks";
import { useAuth } from "./hooks/auth";
import { useUser } from "./hooks/user";

function App() {
  const [time, setTime] = useState("");

  const { data: testuser } = useUser({ id: 23347833 });

  console.log(`user loaded:`, testuser);

  const showPerthTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 480);
    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const time = `${hours}:${minutes}${ampm} Perth time.`;
    setTime(time);
  };

  useEffect(() => {
    showPerthTime();
    const interval = setInterval(showPerthTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const { user } = useAuth();

  return (
    <div className="flex min-h-lvh flex-col">
      <Header />

      {/* Main Content */}
      <main className="px-12 py-6">
        <div className="text-left">
          {/* <div className="whitespace-nowrap">
            <span>
              <span id="PerthTime">{time}</span> It's UWAweek 42 (2nd semester, week
              12)
            </span>
          </div> */}

          {!user && <InfoPanel />}
          {!user ? (
            <div className="mt-8 text-center">
              <LoginForm />
            </div>
          ) : (
            <Marks />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
