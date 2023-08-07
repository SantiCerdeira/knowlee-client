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

function PaymentPage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const creditCards = [
    { brand: "Visa", last4Digits: "1234" },
    { brand: "Mastercard", last4Digits: "5678" },
    { brand: "Amex", last4Digits: "9876" },
  ];

  const navigate = useNavigate();

  useAuthentication();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUserData();
  }, []);

  const handlePremiumSubmit = async () => {
    if (!user) {
      setMessage("Inicia sesión para acceder a esta función");
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/premium`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      const data = await response.json();
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
          <h1 className="text-white font-bold text-center text-3xl lg:text-6xl">
            Pagar suscripción
          </h1>
        </div>
        <div className="flex justify-center flex-wrap items-stretch gap-20 w-12/12 xl:w-9/12 mx-auto">
          <article className="glass py-8 px-20 w-full flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-2xl mb-2 w-full">Plan premium</h2>
              <p className="font-bold text-2xl lg:text-5xl mb-2 text-white">$5000/mes</p>
              <hr className="mt-3 mb-5" />
            </div>
            <div className="flex flex-wrap overflow-x-auto">
              {creditCards.map((card, index) => (
                <div
                  key={index}
                  className={`w-10/12 xl:w-3/12 mx-auto px-4 py-10 cursor-pointer rounded-lg mb-4 bg-gradient-to-tr from-orange-300 to-purple-600 ${
                    selectedCard === index ? "border-2 border-white" : ""
                  } shadow-md hover:scale-105 hover:shadow-xl transition duration-100`}
                  onClick={() => setSelectedCard(index)}
                >
                  <p className="text-lg text-white font-bold text-center">
                    {card.brand}
                  </p>
                  <p className="text-center text-white font-bold">
                    **** **** **** {card.last4Digits}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <Button
                text={
                  loading ? <Loader className="my-0" /> : "Confirmar compra"
                }
                type="submit"
                onClick={handlePremiumSubmit}
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

export default PaymentPage;
