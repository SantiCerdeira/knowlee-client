import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Feedback from "../components/Feedback";
import Footer from "../components/Footer";
import { BASE_URL } from "../utils/helpers/config.js";
import Loader from "../components/Loader";
import useAuthentication from "../utils/helpers/useAuthentication.js";

function PromoCode() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [codeError, setCodeError] = useState("");

  const navigate = useNavigate();

  useAuthentication();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUserData();
  }, []);

  const handleCodeSubmit = async () => {
    if (!user) {
      setMessage("Inicia sesión para acceder a esta función");
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/redeem-code`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeValue }),
      });

      const data = await response.json();
      if (!response.ok) {
        const { message } = data;
        setCodeError(message);
        setLoading(false);
        return;
      }
      setMessage(data.message);
      setStatus(data.status);
      setLoading(false);
      navigate("/precios");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-10 flex flex-col justify-center bg-blue-400">
        <div className="mb-10">
          <h1 className="text-white font-bold text-center text-6xl">
            Canjear código promocional
          </h1>
        </div>
        <div className="flex justify-center flex-wrap items-stretch gap-20 w-12/12 xl:w-9/12 mx-auto">
          <article className="glass py-8 px-20 w-full flex flex-col justify-between">
            <div>
              <p className="font-semibold text-xl mb-2 text-white">
                Introducí un código promocional y conseguí un año de suscripción
                al plan Premium de forma gratuita
              </p>
              <hr className="mt-3 mb-5" />
            </div>
            <input
              className="w-6/12 mx-auto px-5 py-10 mb-4 rounded-lg text-black font-semibold text-5xl text-center"
              type="text"
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
            />
            {codeError && (
              <p className="text-center font-semibold  text-red-700 rounded-lg p-1">
                <i className="fa-solid fa-xmark fa-lg"></i> {codeError}
              </p>
            )}
            <div>
              <Button
                text={loading ? <Loader className="my-0" /> : "Canjear código"}
                type="submit"
                onClick={handleCodeSubmit}
              />
            </div>
          </article>
        </div>
        {message && (
          <Feedback
            message={message}
            status={status}
            setMessage={setMessage}
            setStatus={setStatus}
          />
        )}
      </section>
      <Footer />
    </div>
  );
}

export default PromoCode;
