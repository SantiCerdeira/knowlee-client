import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { getAuthenticatedUser } from "../utils/getAuthenticateUser";
import Post from "../components/Post";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import { getUserId } from "../utils/getUserId";
import { isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { formatPostDate } from "../utils/formatPostDate";
import Feedback from "../components/Feedback";
import Loader from "../components/Loader";
import { BASE_URL } from "../utils/config.js";
import { AuthContext } from "../contexts/AuthContext";

function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
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
  const [postsLoading, setPostsLoading] = useState(false); 
  const [selectedOption, setSelectedOption] = useState("");
  const { token } = useContext(AuthContext);

  const [values, setValues] = useState({
    title: "",
    content: "",
  });
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userAuthenticated = async () => {
      const result = await isAuthenticated(token);
      if (!result) navigate("/login");
    };

    userAuthenticated();
  }, [navigate, token]);

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
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
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser(token);
      setUser(user);
      setDescription(user.description);
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setPostsLoading(true);
      const authUserId = await getUserId(token);
      setUserId(authUserId);

      try {
        const posts = await fetch(`${BASE_URL}/posts/${authUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await posts.json();

        const postsWithData = await Promise.all(
          data.map(async (post) => {
            const commentsResponse = await fetch(
              `${BASE_URL}/get-comments/${post._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const comments = await commentsResponse.json();

            return {
              ...post,
              comments,
            };
          })
        );

        setPostsLoading(false);
        setUserPosts(postsWithData);
      } catch (error) {
        setPostsLoading(false);
        console.error("Error al obtener las publicaciones del usuario:", error);
      }
    };

    fetchUserPosts();
  }, [newPost, userId, token]);

  useEffect(() => {
    const fetchUserFollowing = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/${userId}/following`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFollowing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFollowing();
  }, [userId, token]);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/${userId}/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFollowers();
  }, [userId, token]);

  if (!user || !userPosts) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  }

  const toggleForm = () => {
    setShowForm(!showForm);
    setErrors({});
  };

  const toggleDataForm = () => {
    setShowImageForm(!showImageForm);
  };

  const toggleDescriptionForm = () => {
    setShowDescriptionForm(!showDescriptionForm);
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

    if (!validateForm()) {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setNewPost(data);
      console.log(data);
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

      toggleForm();
    } catch (error) {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      console.error("Error occurred during image upload:", error);
      setLoading(false);
    }
  };

  const handleImageDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/delete-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);

      setUser((prevUser) => ({
        ...prevUser,
        profileImage: data.profileImage,
      }));

      setImageFile(null);
      setErrors({ imageFile: "" });
      toggleDataForm();
      setProfileImageKey(Date.now());
    } catch (error) {
      console.error("Error occurred during image delete:", error);
      setMessage("Ocurrió un error al eliminar la imagen");
      setStatus(500);
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      user.description = data.description;
      toggleDescriptionForm();
    } catch (error) {
      console.error("Error occurred during description update:", error);
    }
  };

  return (
    <div>
      <Navbar key={profileImageKey} />
      <section>
        <div className="w-[75vw] mx-auto flex flex-wrap shadow-lg p-5 rounded-b-3xl mb-4 gap-3">
          <div className="relative w-10/12 xl:w-4/12 flex justify-center  xl:justify-end items-center mx-auto xl:mr-5">
            <img
              src={user.profileImage}
              className="relative rounded-full shadow-xl hover:scale-105 transition duration-300 w-[70%]"
              alt={user.name + user.lastName}
            />
            <div
              className="absolute text-[#336ee7] top-0 right-0 bg-gray-100 rounded-full px-3 py-2 hover:scale-105 hover:cursor-pointer hover:text-white hover:bg-[#336ee7] transition duration-100"
              onClick={toggleDataForm}
            >
              <i className="fa-solid fa-pencil"></i>
            </div>
          </div>
          <div className="w-full xl:w-7/12 flex flex-col justify-center text-center xl:text-start">
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
            <div className="relative">
              <p className="text-lg lg:text-xl text-black mb-3 text-center xl:text-start">
                {user.description}
              </p>
              <div
                className="absolute text-[#336ee7] top-0 right-0 bg-gray-100 rounded-full px-3 py-2 hover:scale-105 hover:cursor-pointer hover:text-white hover:bg-[#336ee7] transition duration-100"
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
              <p className="font-semibold text-md text-black mb-3">
                Seguidores: {followers.length} |
              </p>
              <p className="font-semibold text-md text-black mb-3">
                {" "}
                Siguiendo: {following.length}
              </p>
            </div>
          </div>
          {showImageForm && (
            <div className="flex flex-col 2xl:flex-row items-center justify-center w-9/12 mx-auto my-3 rounded-md p-4 shadow-lg border-solid border-2 border-blue-600">
              <form
                onSubmit={handleImageSubmit}
                encType="multipart/form-data"
                className="flex-col xl:flex-row gap-1 items-center justify-center"
              >
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  name="profileImage"
                  id="profileImage"
                  onChange={handleImageChange}
                  className="px-5 py-2 rounded-sm border-solid border-2 border-gray-300 mx-2 w-max"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-t from-blue-500 to-blue-600 font-semibold px-4 py-2 rounded-md text-white mx-2 mt-2 2xl:mt-0"
                >
                  Cambiar imagen
                </button>
                {errors.imageFile && (
                  <p className="text-center  text-red-700 rounded-lg p-1">
                    <i className="fa-solid fa-xmark fa-lg"></i>{" "}
                    {errors.imageFile}
                  </p>
                )}
              </form>
              {user.profileImage !== "default-user-image.jpg" && (
                <form
                  onSubmit={handleImageDelete}
                  encType="multipart/form-data"
                  className="rounded-md p-4"
                >
                  <button
                    type="submit"
                    className="bg-gradient-to-t from-red-500 to-red-600 font-semibold px-4 py-2 rounded-md text-white mx-2"
                  >
                    Eliminar imagen
                  </button>
                </form>
              )}
              {loading && <Loader />}
            </div>
          )}
          {showDescriptionForm && (
            <div className="w-9/12 mx-auto my-3 rounded-md p-4 shadow-lg border-solid border-2 border-blue-600">
              <form
                onSubmit={handleDescriptionSubmit}
                className="flex-col gap-1 items-center justify-center"
              >
                <input
                  type="text"
                  name="description"
                  id="description"
                  onChange={handleDescriptionChange}
                  className="px-5 py-2 rounded-sm border-solid border-2 border-gray-300 mx-2 w-full"
                  placeholder="Ingresá la descripción"
                  value={description}
                />
                <Button text="Cambiar descipción" type="submit" />
              </form>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[75vw] mx-auto flex flex-col gap-7 min-h-[70vh] shadow-lg p-5 rounded-t-3xl bg-blue-500">
          <button
            onClick={toggleForm}
            className="bg-white font-semibold p-2 rounded-lg w-[75%]  mx-auto text-blue-500 shadow-lg hover:scale-105 transition duration-300 border-2 border-solid border-blue-600"
          >
            Crear nueva publicación{" "}
            <i className="fa-solid fa-circle-plus fa-xl"></i>
          </button>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="bg-white rounded-lg shadow-lg w-[75%] mx-auto p-5"
            >
              <h3 className="text-center font-semibold text-xl mb-4">
                Ingresa los datos para crear una publicación
              </h3>
              <div className="w-[85%] mx-auto my-1">
                <Label text="Título:" htmlFor="title" />
                <Input
                  type="text"
                  placeholder="Ingresa el título"
                  value={values.title}
                  onChange={handleChange("title")}
                  name="title"
                  id="title"
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-start  text-red-700 rounded-lg p-1">
                    <i className="fa-solid fa-xmark fa-lg"></i> {errors.title}
                  </p>
                )}
              </div>
              <div className="w-[85%] mx-auto my-1">
                <Label text="Texto:" htmlFor="content" />
                <Input
                  type="textarea"
                  placeholder="Ingresa el contenido"
                  value={values.content}
                  onChange={handleChange("content")}
                  name="content"
                  id="content"
                  aria-invalid={!!errors.content}
                />
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
              </div>
              {hasFile && (
                <div className="w-[85%] mx-auto my-1">
                  <Label
                    text="¿Qué tipo de archivo querés que sea?"
                    htmlFor="acceso"
                  />
                  <p className="text-md text-black my-2">
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
              <Button text="Publicar" type="submit" />
            </form>
          )}
          {postsLoading && <Loader />}
          {!postsLoading && userPosts.length === 0 && (
            <p className="font-bold text-white text-3xl my-7">
              Aún no realizaste ninguna publicación
            </p>
          )}
          {userPosts.map((post) => (
            <Post
              name={user.name}
              lastName={user.lastName}
              userName={user.userName}
              img={user.profileImage}
              text={post.content}
              title={post.title}
              file={post.fileName}
              date={formatPostDate(post.date)}
              key={post._id}
              onDelete={handlePostDelete}
              postId={post._id}
              likes={post.likes}
              ratings={post.ratings}
              comments={post.comments}
              premium={post.premium}
              author={userId}
              authorPremium={user.premium}
              user={user}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;
