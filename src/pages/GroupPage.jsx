import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserId } from "../utils/users/getUserId";
import Feedback from "../components/Feedback";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Loader from "../components/Loader";
import Input from "../components/Input";
import Label from "../components/Label";
import Button from "../components/Button";
import { Link, useParams, useNavigate } from "react-router-dom";
import useGroupPosts from "../utils/groups/useGroupPosts.js";
import useAuthentication from "../utils/helpers/useAuthentication.js";
import useGroup from "../utils/groups/useGroup.js";
import { BASE_URL } from "../utils/helpers/config.js";
import GroupPost from "../components/GroupPost";
import useGroupUsers from "../utils/groups/useGroupUsers";
import useGroupAdmins from "../utils/groups/useGroupAdmins";

function GroupPage() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [premium, setPremium] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { groupId } = useParams();
  const [refetchUsers, setRefetchUsers] = useState(false);
  const [description, setDescription] = useState("");
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [showImageForm, setShowImageForm] = useState(false);

  const { users } = useGroupUsers(groupId, refetchUsers);
  const { admins, adminsLoading } = useGroupAdmins(groupId);
  const { posts, loading } = useGroupPosts(newPost, groupId);
  const { group } = useGroup(groupId);
  const [values, setValues] = useState({
    title: "",
    content: "",
  });

  useAuthentication();

  const navigate = useNavigate();

  useEffect(() => {
    getUserId().then((result) => {
      setUserId(result);
      if (admins.length > 0) {
        const isAdminUser = admins.some((admin) => admin._id === result);
        setIsAdmin(isAdminUser);
      }
      if (users.length > 0) {
        const isMemberUser = users.some((user) => user._id === result);
        setIsMember(isMemberUser);
      }
    });
  }, [users, admins]);

  useEffect(() => {
    setDescription(group?.description);
  }, [group]);

  const handleRefetchUsers = () => {
    setRefetchUsers((prev) => !prev);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
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

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAuthenticatedUser();
      setUser(user);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setShowResults(false);
      setSelectedCategory("all");
    }
  }, [searchQuery]);

  if (!user || !posts || !group || adminsLoading) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  }

  const performSearch = () => {
    if (!searchQuery) {
      setShowResults(false);
      return setSearchResults([]);
    }

    const filteredPosts = posts.filter(
      (post) =>
        (post.title &&
          post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.content &&
          post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const filteredUsers = users.filter(
      (user) =>
        (user.name &&
          user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.username &&
          user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSelectedCategory("all");
    console.log(filteredPosts);
    console.log(filteredUsers);
    setSearchResults({ posts: filteredPosts, users: filteredUsers });
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedCategory("all");
    setShowResults(false);
  };

  const closeSearch = () => {
    clearSearch();
    setShowSearchBar(false);
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

    formData.append("group", groupId);
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
      const response = await fetch(`${BASE_URL}/group-posts`, {
        method: "POST",
        body: formData,
        credentials: "include",
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

  const handlePostDelete = (response) => {
    setMessage(response.message);
    setStatus(response.status);
    setNewPost(Date.now());
  };

  const handleGroupDelete = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/group/${groupId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const { message } = await response.json();
        setMessage(message);
        setStatus("error");
        setDeleteLoading(false);
        return;
      }

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      setDeleteLoading(false);
      navigate("/grupos");
    } catch (error) {
      setDeleteLoading(false);
      console.log(error);
    }
  };

  const handleAddMember = async () => {
    try {
      const response = await fetch(`${BASE_URL}/group/${groupId}/add`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setIsMember((prevMember) => !prevMember);
        handleRefetchUsers();
      }
      setMessage(data.message);
      setStatus(data.status);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleRemoveMember = async () => {
    try {
      const response = await fetch(`${BASE_URL}/group/${groupId}/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setIsMember((prevMember) => !prevMember);
        handleRefetchUsers();
      }
      setMessage(data.message);
      setStatus(data.status);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleDescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!description) {
      setDescription("");
    }

    try {
      const response = await fetch(`${BASE_URL}/group/${groupId}/description`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      group.description = data.description;
      toggleDescriptionForm();
    } catch (error) {
      console.error("Ocurrió un error al actualizar la descripción:", error);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    if (!isAdmin) return;

    const formData = new FormData();
    formData.append("groupId", groupId);
    formData.append("groupImage", imageFile);
    formData.append("previousImage", group.image);

    if (!imageFile) {
      setErrors({ imageFile: "Ingresá una imagen" });
      return;
    }

    if (imageFile) {
      setErrors({ imageFile: "" });
    }

    try {
      const response = await fetch(`${BASE_URL}/group/${groupId}/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);

      group.image = data.image;
      setImageLoading(false);
      toggleImageForm();
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setImageLoading(false);
    }
  };

  const handleImageDelete = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    if (!isAdmin) return;

    try {
      const response = await fetch(
        `${BASE_URL}/group/${groupId}/delete-image`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      group.image = data.image;

      setImageLoading(false);
      setImageFile(null);
      setErrors({ imageFile: "" });
      toggleImageForm();
    } catch (error) {
      console.error("Error occurred during image delete:", error);
      setMessage("Ocurrió un error al eliminar la imagen");
      setStatus(500);
      setImageLoading(false);
    }
  };

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
    setShowConfirmation((prevValue) =>
      formName === "confirmation" ? !prevValue : false
    );
    setSubmitLoading(false);
    setFileError("");
    setErrors({});
  };

  const togglePostForm = () => {
    toggleForm("postForm");
  };

  const toggleDescriptionForm = () => {
    toggleForm("descriptionForm");
  };

  const toggleImageForm = () => {
    toggleForm("imageForm");
  };

  const toggleConfirmationForm = () => {
    toggleForm("confirmation");
  };

  return (
    <div>
      <Navbar />
      <div className="w-full mx-auto">
        <div className="w-full relative">
          <img
            src={group.image}
            alt={group.name}
            className="object-cover object-center w-full h-56 lg:h-72"
          />
          {isAdmin && (
            <div
              className="absolute top-2 right-2 text-black bg-gray-100 rounded-full px-3 py-2 hover:scale-105 hover:cursor-pointer hover:text-white hover:bg-black transition duration-100"
              onClick={toggleImageForm}
            >
              <i className="fa-solid fa-pencil"></i>
            </div>
          )}
          <div className="bg-white rounded-t-xl p-5 w-full lg:w-[75vw] xl:w-[60vw] mx-auto">
            <div className="w-full flex items-center justify-between">
              <h1 className="text-start text-black font-bold text-3xl my-2">
                {group.name}
                <span></span>
              </h1>
              {isAdmin && (
                <button
                  onClick={toggleConfirmationForm}
                  className="text-black bg-white border-2 border-solid border-black rounded-lg p-5 w-10 h-10 flex justify-center items-center ml-3 hover:scale-105 focus:scale-105 transition duration-200"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
            {showConfirmation && (
              <div>
                <p className="my-3 text-center font-semibold">
                  ¿Estás seguro/a de que querés eliminar este grupo? Ésta acción
                  no se puede deshacer.
                </p>
                {deleteLoading ? (
                  <Loader />
                ) : (
                  <div className="d-flex gap-5">
                    <button
                      onClick={handleGroupDelete}
                      className="bg-red-500 px-4 py-2 text-white font-semibold rounded-lg mx-5 hover:bg-red-400"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      onClick={toggleConfirmationForm}
                      className="bg-blue-600 px-4 py-2 text-white font-semibold rounded-lg mx-5 hover:bg-blue-500"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
            {showImageForm && (
              <div className="flex flex-col items-center justify-center w-9/12 mx-auto my-3 rounded-md p-4 shadow-lg border-solid border-2 border-blue-600">
                <form
                  onSubmit={handleImageSubmit}
                  encType="multipart/form-data"
                  className="flex-col lg:flex-row gap-1 items-center justify-center"
                >
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="groupImage"
                    id="groupImage"
                    onChange={handleImageChange}
                    className="px-5 py-2 rounded-sm border-solid border-2 border-gray-300 mx-2 max-w-[60%] lg:max-w-auto"
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
                {group.image !==
                  "https://knowleeimages.s3.sa-east-1.amazonaws.com/4abvz-logo-fondo-azul.jpg" && (
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
                {imageLoading && <Loader />}
                <p className="text-center mt-2 text-sm text-gray-500">
                  La imagen debe ser un .png,.jpg,.jpeg,.webp o .avif y pesar
                  menos de 1MB.
                </p>
                <p className="text-center text-sm text-gray-500">
                  Procurá que sea una imagen rectangular para que se vea bien
                  horizontalmente.
                </p>
              </div>
            )}
            <div className="w-full flex items-center justify-between">
              <p className="text-start text-black my-1 text-lg">
                {group.description}
              </p>
              {isAdmin && (
                <div
                  className="text-black bg-gray-100 rounded-full px-3 py-2 mt-2 hover:scale-105 hover:cursor-pointer hover:text-white hover:bg-black transition duration-100"
                  onClick={toggleDescriptionForm}
                >
                  <i className="fa-solid fa-pencil"></i>
                </div>
              )}
            </div>
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
                    className="px-5 py-2 rounded-sm border-solid border-2 border-gray-300 w-full"
                    placeholder="Ingresá la descripción"
                    value={description}
                    autoComplete="off"
                  />
                  <Button text="Cambiar descipción" type="submit" />
                </form>
              </div>
            )}
            {isMember ? (
                <button
                  className="w-4/12 bg-white rounded-lg text-blue-600 border-2 border-solid border-blue-400  shadow-md text-center py-3 font-semibold my-2"
                  onClick={() => handleRemoveMember()}
                  disabled={isAdmin ? true : false}
                >
                  <i className="fa-solid fa-user-check"></i> Miembro
                </button>
              ) : (
                <button
                  className="w-4/12 bg-blue-500 text-white rounded-lg shadow-md text-center py-3 font-semibold my-2"
                  onClick={() => handleAddMember()}
                  disabled={isAdmin ? true : false}
                >
                  <i className="fa-solid fa-user-plus"></i> Unirme
                </button>
              )}
              <p className="text-center text-gray-500 my-1 text-base">
                {users.length} Miembro(s)
              </p>
          </div>
        </div>
      </div>
      <section className="w-full lg:w-[75vw] xl:w-[60vw] min-h-screen bg-[#c1d0f3] pb-5 mx-auto">
        {isMember && (
          <button
            onClick={togglePostForm}
            className="bg-white font-semibold p-2 rounded-lg w-full  mx-auto text-black shadow-lg border-2 border-solid border-black"
          >
            Crear nueva publicación{" "}
            <i className="fa-solid fa-circle-plus fa-xl"></i>
          </button>
        )}
        {showPostForm && (
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white rounded-lg shadow-lg w-full mx-auto p-5"
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
                // autoComplete='off'
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
                  Seleccioná si el archivo será de acceso <b>gratuito</b> o solo
                  para los usuarios que tengan el <b>Plan Premium</b>. (Solo si
                  vos también tenés plan Premium)
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
        {!showSearchBar && (
          <div className="flex justify-center">
            <button
              className={`${
                showAllPosts ? "border-white border-b-2" : "border-none"
              } px-4 py-2 text-white w-6/12 bg-blue-600 border-solid font-semibold text-lg`}
              onClick={() => setShowAllPosts(true)}
            >
              Publicaciones
            </button>
            <button
              className={`${
                showAllPosts ? "border-none" : "border-white border-b-2"
              } px-4 py-2 text-white w-6/12 bg-blue-600 border-solid font-semibold text-lg`}
              onClick={() => setShowAllPosts(false)}
            >
              Usuarios
            </button>
          </div>
        )}
        {!showSearchBar && (
          <div className="bg-blue-400 ">
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="bg-white text-black px-5 py-2 font-semibold text-center w-full border-2 border-solid border-blue-600"
            >
              Buscar <i className="fa-solid fa-magnifying-glass mx-2"></i>
            </button>
          </div>
        )}
        <div className="flex flex-col gap-7">
          <div>
            {showSearchBar && posts && users && (
              <div className="w-full bg-blue-600 pt-2">
                <div className="flex justify-center my-2">
                  <div className="bg-white w-[70%] rounded-full">
                    <input
                      type="text"
                      placeholder="Ingresá tu búsqueda"
                      value={searchQuery}
                      onChange={handleSearchQueryChange}
                      className="py-2 px-4 rounded-l-full w-[90%]"
                    />
                    <button
                      onClick={performSearch}
                      className="bg-white text-black py-2 px-4 rounded-r-full w-[10%]"
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="bg-blue-600 text-white py-2 px-4 "
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button
                    onClick={closeSearch}
                    className="bg-blue-600 text-white py-2 px-4 "
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`${
                      selectedCategory === "all"
                        ? "bg-white text-blue-500"
                        : "bg-blue-600 text-white"
                    } px-4 py-2  w-4/12  border-solid font-semibold text-lg`}
                  >
                    Todo
                  </button>
                  <button
                    onClick={() => handleCategoryChange("posts")}
                    className={`${
                      selectedCategory === "posts"
                        ? "bg-white text-blue-500"
                        : "bg-blue-600 text-white"
                    } px-4 py-2  w-4/12  border-solid font-semibold text-lg`}
                  >
                    Publicaciones
                  </button>
                  <button
                    onClick={() => handleCategoryChange("users")}
                    className={`${
                      selectedCategory === "users"
                        ? "bg-white text-blue-500"
                        : "bg-blue-600 text-white"
                    } px-4 py-2  w-4/12  border-solid font-semibold text-lg`}
                  >
                    Usuarios
                  </button>
                </div>
              </div>
            )}
          </div>
          {showResults && (
            <>
              {searchResults.posts?.length === 0 &&
                (selectedCategory === "posts" ||
                  selectedCategory === "all") && (
                  <p className="text-black font-semibold text-xl lg:text-3xl drop-shadow-xl text-center my-10">
                    No se encontraron publicaciones.
                  </p>
                )}

              {searchResults.posts?.length > 0 &&
                (selectedCategory === "posts" ||
                  selectedCategory === "all") && (
                  <div className="flex flex-col-reverse gap-7">
                    {searchResults.posts.map((post) => (
                      <GroupPost
                        key={post._id}
                        postId={post._id}
                        premium={post.premium}
                        name={post.authorUser.name}
                        lastName={post.authorUser.lastName}
                        userName={post.authorUser.userName}
                        img={post.authorUser.profileImage}
                        author={post.author}
                        authorPremium={post.authorUser.premium}
                        title={post.title}
                        text={post.content}
                        date={formatPostDate(post.date)}
                        likes={post.likes}
                        comments={post.comments}
                        file={post.fileName}
                        ratings={post.ratings}
                        user={user}
                        isAdmin={isAdmin}
                        isMember={isMember}
                      />
                    ))}
                    {searchResults.posts.some(
                      (post) => post.author !== userId
                    ) && (
                      <h2 className="text-black font-bold text-xl lg:text-3xl drop-shadow-xl text-start mb-2 mx-10">
                        Publicaciones
                      </h2>
                    )}
                  </div>
                )}

              {searchResults.users?.length > 0 &&
                (selectedCategory === "users" ||
                  selectedCategory === "all") && (
                  <div>
                    <h2 className="text-black font-bold text-xl lg:text-3xl drop-shadow-xl text-start mb-2 mx-10">
                      Usuarios
                    </h2>
                    {searchResults.users.map((user) => (
                      <article
                        className="w-10/12 mx-auto rounded-lg bg-white py-3 px-10 my-4"
                        key={user._id}
                      >
                        <Link to={`/usuarios/${user._id}`}>
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-32 h-32 rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">
                                {user.name} {user.lastName}
                              </h3>
                              <p className="text-gray-500">@{user.userName}</p>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                )}

              {!searchResults.users?.length &&
                (selectedCategory === "users" ||
                  selectedCategory === "all") && (
                  <p className="text-black font-semibold text-xl lg:text-3xl drop-shadow-xl text-center my-10">
                    No se encontraron usuarios.
                  </p>
                )}
            </>
          )}

          {!showResults && (
            <>
              {!loading ? (
                <>
                  {showAllPosts ? (
                    <>
                      {posts.length === 0 && (
                        <p className="text-black font-semibold text-xl lg:text-3xl drop-shadow-xl text-center my-10">
                          No hay publicaciones en este grupo.
                        </p>
                      )}
                      {posts &&
                        posts.map((post) => {
                          return (
                            <GroupPost
                              name={post.authorUser.name}
                              lastName={post.authorUser.lastName}
                              userName={post.authorUser.userName}
                              img={post.authorUser.profileImage}
                              text={post.content}
                              title={post.title}
                              file={post.fileName}
                              date={formatPostDate(post.date)}
                              likes={post.likes}
                              ratings={post.ratings}
                              comments={post.comments}
                              key={post._id}
                              postId={post._id}
                              author={post.author}
                              premium={post.premium}
                              authorPremium={post.authorUser.premium}
                              onDelete={handlePostDelete}
                              showCommentsForm={false}
                              user={user}
                              isAdmin={isAdmin}
                              isMember={isMember}
                            />
                          );
                        })}
                    </>
                  ) : (
                    <div>
                      <h2 className="text-black font-bold text-xl lg:text-3xl drop-shadow-xl text-start mb-2 mx-10">
                        Usuarios
                      </h2>
                      {users.map((user) => (
                        <article
                          className="w-10/12 mx-auto rounded-lg bg-white py-3 px-10 my-4"
                          key={user._id}
                        >
                          <Link to={`/usuarios/${user._id}`}>
                            <div className="flex items-center gap-3">
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-32 h-32 rounded-full"
                              />
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {user.name} {user.lastName}
                                </h3>
                                <p className="text-gray-500">
                                  @{user.userName}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Loader />
              )}
            </>
          )}
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
    </div>
  );
}

export default GroupPage;
