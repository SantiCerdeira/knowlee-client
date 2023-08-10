import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import { getUserId } from "../utils/users/getUserId.js";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import Feedback from "../components/Feedback";
import Loader from "../components/Loader";
import {
  fetchUserData,
  fetchFollowers,
  fetchUserFollowing,
} from "../utils/helpers/fetch.js";
import useUserPosts from "../utils/posts/useUserPost.js";
import { BASE_URL } from "../utils/helpers/config.js";
import useAuthentication from "../utils/helpers/useAuthentication.js";
import { Link } from "react-router-dom";
import UsersModal from "../components/UsersModal";

function Profile() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [showLinksForm, setShowLinksForm] = useState(false);
  const [profileImageKey, setProfileImageKey] = useState(Date.now());
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [premium, setPremium] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [linksError, setLinksError] = useState("");
  const [fileError, setFileError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const { postsLoading, userPosts } = useUserPosts(newPost);

  const [values, setValues] = useState({
    title: "",
    content: "",
  });
  const [linksValues, setLinksValues] = useState({
    coffeeLink: "",
    paypalLink: "",
    mercadoPagoLink: "",
  });
  const [description, setDescription] = useState("");

  useAuthentication();

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const handleLinksChange = (fieldName) => (e) => {
    setLinksValues({ ...linksValues, [fieldName]: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    setPdfFile(selectedFile);
    setHasFile(!!selectedFile);
  };

  const handleOptionChange = (e) => {
    const optionValue = e.target.value;
    setSelectedOption(optionValue);

    if (optionValue === "premium") {
      setPremium(true);
    } else {
      setPremium(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUserData();
      setUser(user);
      setDescription(user.description);
      setLinksValues({
        coffeeLink: user.coffeeLink,
        paypalLink: user.paypalLink,
        mercadoPagoLink: user.mercadoPagoLink,
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const followersData = await fetchFollowers(userId);
      const followingData = await fetchUserFollowing(userId);
      setFollowers(followersData);
      setFollowing(followingData);
    };

    loadData();
  }, [userId]);

  if (!userId || !user || !userPosts) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  }

  const toggleForm = (formName) => {
    setShowPostForm((prevValue) =>
      formName === "postForm" ? !prevValue : false
    );
    setShowDescriptionForm((prevValue) =>
      formName === "descriptionForm" ? !prevValue : false
    );
    setShowImageForm((prevValue) =>
      formName === "imageForm" ? !prevValue : false
    );
    setShowLinksForm((prevValue) =>
      formName === "linksForm" ? !prevValue : false
    );
    setErrors({});
  };

  const togglePostForm = () => {
    toggleForm("postForm");
  };

  const toggleDataForm = () => {
    toggleForm("imageForm");
  };

  const toggleDescriptionForm = () => {
    toggleForm("descriptionForm");
  };

  const toggleLinksForm = () => {
    toggleForm("linksForm");
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!values.title) {
      formErrors.title = "Ingresá un título";
      isValid = false;
    }

    if (values.title && values.title.length < 10) {
      formErrors.title = "El título debe tener al menos 10 caracteres";
      isValid = false;
    }

    if (!values.content) {
      formErrors.content = "Ingresá el contenido de la publicación";
      isValid = false;
    }

    if (values.content && values.content.length < 50) {
      formErrors.content = "El contenido debe tener al menos 50 caracteres";
      isValid = false;
    }

    if (hasFile && !selectedOption) {
      formErrors.selectedOption = "Seleccioná una opción";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setFileError("");

    if (!validateForm()) {
      setSubmitLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("author", userId);
    formData.append("file", pdfFile);
    formData.append("name", user.name);
    formData.append("lastName", user.lastName);
    formData.append("userName", user.userName);
    formData.append("date", new Date());
    formData.append("premium", premium);

    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const { message } = await response.json();
        setFileError(message);
        setSubmitLoading(false);
        return;
      }

      const data = await response.json();
      setNewPost(data);
      setMessage(data.message);
      setStatus(data.status);

      setValues({
        title: "",
        content: "",
      });
      setPdfFile(null);
      setHasFile(false);
      setSelectedOption("");
      setPremium(false);
      setSubmitLoading(false);
      togglePostForm();
    } catch (error) {
      setSubmitLoading(false);
      console.log(error);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("profileImage", imageFile);
    formData.append("userImage", user.profileImage);
    console.log(user.profileImage);

    if (!imageFile) {
      setErrors({ imageFile: "Ingresá una imagen" });
      return;
    }

    if (imageFile) {
      setErrors({ imageFile: "" });
    }

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);

      setUser((prevUser) => ({
        ...prevUser,
        profileImage: data.profileImage,
      }));

      setLoading(false);
      toggleDataForm();
      setProfileImageKey(Date.now());
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleImageDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/delete-image`, {
        method: "DELETE",
        credentials: 'include',
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);

      setUser((prevUser) => ({
        ...prevUser,
        profileImage: data.profileImage,
      }));

      setLoading(false);
      setImageFile(null);
      setErrors({ imageFile: "" });
      toggleDataForm();
      setProfileImageKey(Date.now());
    } catch (error) {
      console.error("Error occurred during image delete:", error);
      setMessage("Ocurrió un error al eliminar la imagen");
      setStatus(500);
      setLoading(false);
    }
  };

  const handlePostDelete = (response) => {
    setMessage(response.message);
    setStatus(response.status);
    setNewPost(Date.now());
  };

  const handleDescriptionSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      setDescription("");
    }

    try {
      const response = await fetch(`${BASE_URL}/description`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      user.description = data.description;
      toggleDescriptionForm();
    } catch (error) {
      console.error("Ocurrió un error al actualizar la descripción:", error);
    }
  };

  const handleLinksSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/${userId}/links`, {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coffeeLink: linksValues.coffeeLink,
          paypalLink: linksValues.paypalLink,
          mercadoPagoLink: linksValues.mercadoPagoLink,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setUser({
          ...user,
          coffeeLink: linksValues.coffeeLink || null,
          mercadoPagoLink: linksValues.mercadoPagoLink || null,
          paypalLink: linksValues.paypalLink || null,
        });
        setMessage(data.message);
        setStatus(data.status);
        setLinksError("");
        toggleLinksForm();
      } else {
        setLinksError(data.message);
      }
    } catch (error) {
      console.error("Error occurred during description update:", error);
    }
  };

  const showUsersModal = (list) => {
    setCurrentList(list);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (showModal) {
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "auto";
  }

  return (
    <div>
      <Navbar key={profileImageKey} />
      <section>
        <div className="w-[75vw] mx-auto flex flex-wrap shadow-lg p-5 rounded-b-3xl mb-4 gap-3">
          <div className="relative w-10/12 xl:w-4/12 flex justify-center xl:justify-end items-center mx-auto xl:mr-5">
            <img
              src={user.profileImage}
              className="relative rounded-full shadow-xl hover:scale-105 transition duration-300 mb-3 lg:mb-0 w-[70%]"
              alt={user.name + user.lastName}
            />
            <div
              className="absolute text-black top-0 right-0 bg-gray-100 rounded-full px-3 py-2 hover:scale-105 hover:cursor-pointer hover:text-white hover:bg-black transition duration-100"
              onClick={toggleDataForm}
            >
              <i className="fa-solid fa-pencil"></i>
            </div>
          </div>
          <div className="relative w-full xl:w-7/12 flex flex-col justify-center text-center xl:text-start">
            <h1 className="font-bold text-2xl">
              {user.name} {user.lastName}{" "}
              {user.premium && (
                <span>
                  <img
                    src={`/img/logo-letra.png`}
                    className="w-4 inline mx-1 "
                    alt="Usuario Premium"
                  />
                </span>
              )}
            </h1>
            <p className="text-md text-gray-400 mb-3">@{user.userName}</p>
            <div className="flex items-center justify-center mb-2 xl:justify-between gap-2">
              {user.description ? (
                <p className="text-lg lg:text-xl text-black text-center xl:text-start">
                  {user.description}
                </p>
              ) : (
                <p className="text-md text-center xl:text-start text-gray-400 ">
                  Tu descripción está vacía
                </p>
              )}
              <div
                className=" text-black bg-gray-100 rounded-full px-3 py-2 hover:scale-105 hover:cursor-pointer hover:text-white hover:bg-black transition duration-100"
                onClick={toggleDescriptionForm}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>

            {message && (
              <Feedback
                message={message}
                status={status}
                setMessage={setMessage}
                setStatus={setStatus}
              />
            )}
            <div className="flex gap-2 justify-center xl:justify-start">
              <p
                className="font-semibold text-md text-black mb-3 cursor-pointer"
                onClick={() => showUsersModal(followers)}
              >
                Seguidores: {followers.length} |
              </p>
              <p
                className="font-semibold text-md text-black mb-3 cursor-pointer"
                onClick={() => showUsersModal(following)}
              >
                Siguiendo: {following.length}
              </p>
            </div>
            {showModal && (
              <UsersModal closeModal={closeModal} users={currentList} />
            )}
            <div className="flex items-center justify-center xl:justify-between gap-2">
              <div>
                {user.coffeeLink && (
                  <a
                    href={user.coffeeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/cafecito.png"
                      className="w-8 md:w-12 rounded-md shadow-lg inline hover:scale-105 transition duration-200"
                      alt="Cafecito"
                    />
                  </a>
                )}
                {user.paypalLink && (
                  <a
                    href={user.paypalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/paypal.png"
                      className="w-8 md:w-12 rounded-md shadow-lg inline hover:scale-105 transition duration-200"
                      alt="Paypal"
                    />
                  </a>
                )}
                {user.mercadoPagoLink && (
                  <a
                    href={user.mercadoPagoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/mercadopago.png"
                      className="w-8 md:w-12 rounded-md shadow-lg inline hover:scale-105 transition duration-200"
                      alt="MercadoPago"
                    />
                  </a>
                )}
                {!user.coffeeLink &&
                  !user.mercadoPagoLink &&
                  !user.paypalLink && (
                    <p className="text-sm lg:text-base text-gray-400">
                      Aún no agregaste ninguna opción para recibir donaciones
                    </p>
                  )}
              </div>
              <div
                className=" text-black bg-gray-100 rounded-full px-3 py-2 hover:scale-105 hover:cursor-pointer hover:text-white hover:bg-black transition duration-100"
                onClick={toggleLinksForm}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
            <Link
              to="/posts/guardados"
              className="text-white text-sm xl:text-base bg-blue-600 rounded-lg px-4 py-3 text-center font-semibold my-3 mx-auto xl:mr-0 "
            >
              <i className="fa-solid fa-bookmark fa-xl cursor-pointer mx-2"></i>{" "}
              Ver favoritos
            </Link>
          </div>
          {showImageForm && (
            <div className="flex flex-col items-center justify-center w-9/12 mx-auto my-3 rounded-md p-4 shadow-lg border-solid border-2 border-blue-600">
              <div className="flex flex-col lg:flex-row items-center gap-0">
                <form
                  onSubmit={handleImageSubmit}
                  encType="multipart/form-data"
                >
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="profileImage"
                    id="profileImage"
                    onChange={handleImageChange}
                    className="px-5 py-2 rounded-sm border-solid border-2 border-gray-300 mx-2 max-w-[55%] lg:max-w-auto"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-t from-blue-500 to-blue-600 font-semibold px-4 py-2 rounded-md text-white mx-2 mt-2 2xl:mt-0"
                  >
                    Cambiar imagen
                  </button>
                </form>
                {user.profileImage !==
                  "https://knowleeimages.s3.sa-east-1.amazonaws.com/default-user-image.png" && (
                  <form
                    onSubmit={handleImageDelete}
                    encType="multipart/form-data"
                    className="rounded-md"
                  >
                    <button
                      type="submit"
                      className="bg-gradient-to-t from-red-500 to-red-600 font-semibold px-4 py-2 rounded-md text-white my-1"
                    >
                      Eliminar imagen
                    </button>
                  </form>
                )}
              </div>
              {errors.imageFile && (
                <p className="text-center  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.imageFile}
                </p>
              )}
              <p className="w-[85%] mx-auto text-center text-sm text-gray-500 mt-3">
                La imagen debe ser un .png,.jpg,.jpeg,.webp o .avif y pesar
                menos de 1MB
              </p>
              {loading && <Loader />}
            </div>
          )}
          {showDescriptionForm && (
            <div className="w-9/12 mx-auto my-3 rounded-md p-4 shadow-lg border-solid border-2 border-blue-600">
              <form
                onSubmit={handleDescriptionSubmit}
                className="flex-col items-center justify-center"
              >
                <input
                  type="text"
                  name="description"
                  id="description"
                  onChange={handleDescriptionChange}
                  className="px-5 py-2 rounded-sm border-solid border-2 border-gray-300 w-full"
                  placeholder="Ingresá la descripción"
                  value={description}
                  autoComplete="off"
                />
                <Button text="Cambiar descipción" type="submit" />
              </form>
            </div>
          )}
          {showLinksForm && (
            <div className="w-9/12 mx-auto my-3 rounded-md p-5 shadow-lg border-solid border-2 border-blue-600">
              <h3 className="text-black font-semibold text-sm lg:text-lg text-center my-2">
                Agregá los links para que otros usuarios puedan hacerte
                donaciones
              </h3>
              <form
                onSubmit={handleLinksSubmit}
                className="flex-col gap-1 items-center justify-center"
              >
                <div>
                  <Label text="Cafecito:" htmlFor="coffeeLink" />
                  <Input
                    type="text"
                    name="coffeeLink"
                    id="coffeeLink"
                    placeholder='Formato: "https://cafecito.app/xxxxx/donate"'
                    value={linksValues.coffeeLink}
                    onChange={handleLinksChange("coffeeLink")}
                  />
                </div>
                <div>
                  <Label text="Paypal:" htmlFor="paypalLink" />
                  <Input
                    type="text"
                    name="paypalLink"
                    id="paypalLink"
                    placeholder='Formato: "https://www.paypal.com/donate?hosted_button_id=XXXXXXXXX"'
                    value={linksValues.paypalLink}
                    onChange={handleLinksChange("paypalLink")}
                  />
                </div>
                <div>
                  <Label text="MercadoPago:" htmlFor="mercadoPagoLink" />
                  <Input
                    type="text"
                    name="mercadoPagoLink"
                    id="mercadoPagoLink"
                    placeholder='Formato: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=XXXXXXXX"'
                    value={linksValues.mercadoPagoLink}
                    onChange={handleLinksChange("mercadoPagoLink")}
                  />
                </div>
                {linksError && (
                  <p className="text-center mt-5  text-red-700 rounded-lg p-1">
                    <i className="fa-solid fa-xmark fa-lg"></i> {linksError}
                  </p>
                )}
                <Button text="Confirmar" type="submit" />
              </form>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[75vw] mx-auto flex flex-col gap-7 min-h-[70vh] shadow-lg p-5 rounded-t-3xl bg-[#c1d0f3]">
          <button
            onClick={togglePostForm}
            className="bg-white font-semibold p-2 rounded-lg w-[75%]  mx-auto text-black shadow-lg hover:scale-105 transition duration-300 border-2 border-solid border-black"
          >
            Crear nueva publicación{" "}
            <i className="fa-solid fa-circle-plus fa-xl"></i>
          </button>
          {showPostForm && (
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="bg-white rounded-lg shadow-lg w-[90vw] lg:w-[75%] mx-auto p-5"
            >
              <h3 className="text-center font-semibold text-xl mb-4">
                Ingresa los datos para crear una publicación
              </h3>
              <div className="w-[85%] mx-auto my-1">
                <Label text="Título (*):" htmlFor="title" />
                <Input
                  type="text"
                  placeholder="Ingresa el título"
                  value={values.title}
                  onChange={handleChange("title")}
                  name="title"
                  id="title"
                  aria-invalid={!!errors.title}
                />
                <p className="text-start text-sm text-gray-500">
                  El título debe tener al menos 10 caracteres
                </p>
                {errors.title && (
                  <p className="text-start  text-red-700 rounded-lg p-1">
                    <i className="fa-solid fa-xmark fa-lg"></i> {errors.title}
                  </p>
                )}
              </div>
              <div className="w-[85%] mx-auto my-1">
                <Label text="Texto (*):" htmlFor="content" />
                <Input
                  type="textarea"
                  placeholder="Ingresa el contenido"
                  value={values.content}
                  onChange={handleChange("content")}
                  name="content"
                  id="content"
                  aria-invalid={!!errors.content}
                />
                <p className="text-start text-sm text-gray-500">
                  El contenido debe tener al menos 50 caracteres
                </p>
                {errors.content && (
                  <p className="text-start  text-red-700 rounded-lg p-1">
                    <i className="fa-solid fa-xmark fa-lg"></i> {errors.content}
                  </p>
                )}
              </div>
              <div className="w-[85%] mx-auto my-1">
                <Label text="Archivo:" htmlFor="file" />
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  name="file"
                  id="file"
                />
                <p className="text-start text-sm lg:text-base text-gray-500">
                  El documento debe ser un PDF (.pdf) y pesar máximo 25 MB
                </p>
              </div>
              {hasFile && (
                <div className="w-[85%] mx-auto my-1">
                  <Label
                    text="¿Qué tipo de archivo querés que sea?"
                    htmlFor="acceso"
                  />
                  <p className="text-base text-black my-2">
                    Seleccioná si el archivo será de acceso <b>gratuito</b> o
                    solo para los usuarios que tengan el <b>Plan Premium</b>.
                    (Solo si vos también tenés plan Premium)
                  </p>
                  <input
                    type="radio"
                    value="free"
                    checked={selectedOption === "free"}
                    onChange={handleOptionChange}
                    className="mx-3"
                    name="acceso"
                  />
                  Gratis
                  <input
                    type="radio"
                    value="premium"
                    checked={selectedOption === "premium"}
                    onChange={handleOptionChange}
                    className={`mx-3 ${
                      user.premium ? "" : "opacity-50 cursor-not-allowed"
                    }`}
                    name="acceso"
                    disabled={!user.premium}
                  />
                  Premium
                  {errors.selectedOption && (
                    <p className="text-center text-red-700 rounded-lg p-1">
                      <i className="fa-solid fa-xmark fa-lg"></i>{" "}
                      {errors.selectedOption}
                    </p>
                  )}
                </div>
              )}
              <p className="w-[85%] mx-auto text-start text-sm text-gray-500 mt-3">
                Los campos son obligatorios (*)
              </p>
              {submitLoading && <Loader />}
              {fileError && (
                <p className="text-center  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {fileError}
                </p>
              )}
              <Button text="Publicar" type="submit" />
            </form>
          )}
          {postsLoading && <Loader />}
          {!postsLoading && userPosts.length === 0 && (
            <p className="text-black font-semibold text-xl lg:text-3xl drop-shadow-xl my-7">
              Aún no realizaste ninguna publicación
            </p>
          )}
          {userPosts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              premium={post.premium}
              name={user.name}
              lastName={user.lastName}
              userName={user.userName}
              img={user.profileImage}
              author={userId}
              authorPremium={user.premium}
              title={post.title}
              text={post.content}
              date={formatPostDate(post.date)}
              likes={post.likes}
              comments={post.comments}
              file={post.fileName}
              ratings={post.ratings}
              onDelete={handlePostDelete}
              user={user}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;
