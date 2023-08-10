import React, { useState, useEffect} from "react";
import useAuthentication from "../utils/helpers/useAuthentication.js";
import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";
import Group from "../components/Group.jsx";
import Label from "../components/Label.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Feedback from "../components/Feedback.jsx";
import useGroups from "../utils/groups/useGroups.js";
import { BASE_URL } from "../utils/helpers/config.js";
import { getUserId } from "../utils/users/getUserId.js";

function Groups() {
  const [userId, setUserId] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [groupError, setGroupError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ posts: [] });
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { groups, groupsLoading } = useGroups(newGroup);
  const [values, setValues] = useState({
    name: "",
    description: "",
  });

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

  const handleImageChange = (e) => {
    setImgFile(e.target.files[0]);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setGroupError("");
    setImgFile(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!values.name) {
      formErrors.name = "Ingresá un nombre";
      isValid = false;
    }

    if (values.name && values.name.length < 3) {
      formErrors.name = "El título debe tener al menos 3 caracteres";
      isValid = false;
    }

    if (!values.description) {
      formErrors.description = "Ingresá la descripción del grupo";
      isValid = false;
    }

    if (values.description && values.description.length < 10) {
      formErrors.description =
        "La descripción debe tener al menos 10 caracteres";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setGroupError("");

    if (!validateForm()) {
      setSubmitLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("groupImage", imgFile || null);
    formData.append("members", userId);
    formData.append("admins", userId);
    formData.append("date", new Date());

    try {
      const response = await fetch(`${BASE_URL}/groups`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        const { message } = data;
        setGroupError(message);
        setSubmitLoading(false);
        return;
      }

      const data = await response.json();
      setNewGroup(data);
      setMessage(data.message);
      setStatus(data.status);

      setValues({
        name: "",
        description: "",
      });

      setSubmitLoading(false);
      toggleForm();
    } catch (error) {
      setSubmitLoading(false);
      console.log(error);
    }
  };

  useAuthentication();

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery === "") {
      setShowResults(false);
    }
  }, [searchQuery]);

  const performSearch = () => {
    if (!searchQuery) {
      setShowResults(false);
      return setSearchResults([]);
    }

    const filteredGroups = groups.filter(
      (group) =>
        (group.name &&
          group.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (group.description &&
          group.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults({ groups: filteredGroups });
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const closeSearch = () => {
    clearSearch();
    setShowSearchBar(false);
  };

  return (
    <div>
      <Navbar />
      <section className="w-full lg:w-[60vw] bg-white pb-5 mx-auto py-5">
        <button
          onClick={toggleForm}
          className="bg-white font-semibold p-2 rounded-lg w-[75%]  mx-auto text-black shadow-lg hover:scale-105 transition duration-300 border-2 border-solid border-black"
        >
          Crear nuevo grupo <i className="fa-solid fa-circle-plus fa-xl"></i>
        </button>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white rounded-lg shadow-lg w-[90vw] lg:w-[80%] xl:w-[75%] mx-auto p-5"
          >
            <h3 className="text-center font-semibold text-xl mb-4">
              Ingresa los datos para crear un grupo
            </h3>
            <div className="w-[85%] mx-auto my-1">
              <Label text="Nombre (*):" htmlFor="name" />
              <Input
                type="text"
                placeholder="Ingresa el nombre"
                value={values.name}
                onChange={handleChange("name")}
                name="name"
                id="name"
                aria-invalid={!!errors.name}
              />
              <p className="text-start text-sm text-gray-500">
                El nombre debe tener al menos 3 caracteres
              </p>
              {errors.name && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.name}
                </p>
              )}
            </div>
            <div className="w-[85%] mx-auto my-1">
              <Label text="Descripción (*):" htmlFor="description" />
              <Input
                type="textarea"
                placeholder="Ingresa la descripción"
                value={values.description}
                onChange={handleChange("description")}
                name="description"
                id="description"
                aria-invalid={!!errors.description}
              />
              <p className="text-start text-sm text-gray-500">
                La descripción debe tener al menos 10 caracteres
              </p>
              {errors.description && (
                <p className="text-start  text-red-700 rounded-lg p-1">
                  <i className="fa-solid fa-xmark fa-lg"></i>{" "}
                  {errors.description}
                </p>
              )}
            </div>
            <div className="w-[85%] mx-auto my-1">
              <Label text="Imagen:" htmlFor="image" />
              <Input
                type="file"
                accept=".png, .jpg, .jpeg, .webp, .avif"
                onChange={handleImageChange}
                name="image"
                id="image"
              />
              <p className="text-start text-sm text-gray-500">
                La imagen debe ser un .png,.jpg,.jpeg,.webp o .avif y pesar
                menos de 1MB.
              </p>
              <p className="text-start text-sm text-gray-500">
                Procurá que sea una imagen rectangular para que se vea bien horizontalmente.
              </p>
            </div>
            <p className="w-[85%] mx-auto text-start text-sm text-gray-500 mt-3">
              Los campos son obligatorios (*)
            </p>
            {submitLoading && <Loader />}
            {groupError && (
              <p className="text-center  text-red-700 rounded-lg p-1">
                <i className="fa-solid fa-xmark fa-lg"></i> {groupError}
              </p>
            )}
            <Button text="Crear" type="submit" />
          </form>
        )}

        {!showSearchBar && (
          <div className="bg-white font-semibold p-2 rounded-lg w-[75%] my-2  mx-auto text-black shadow-lg hover:scale-105 transition duration-300 border-2 border-solid border-black">
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="bg-white text-black px-5 font-semibold text-center w-full"
            >
              Buscar <i className="fa-solid fa-magnifying-glass mx-2"></i>
            </button>
          </div>
        )}
        <div>
          {showSearchBar && groups && (
            <div className="w-full  bg-white pt-2">
              <div className="flex justify-center my-2">
                <div className="bg-white w-[70%] rounded-l-full shadow-2xl">
                  <input
                    type="text"
                    placeholder="Ingresá tu búsqueda"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    className="py-3 px-5 rounded-l-full w-[90%]"
                  />
                  <button
                    onClick={performSearch}
                    className="bg-white text-black py-2 px-4 w-[10%]"
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
                  className="bg-blue-600 text-white py-2 px-4 rounded-r-full"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {showResults && (
          <>
            {searchResults.groups?.length === 0 && (
              <p className="text-black font-semibold text-3xl text-center my-10">
                No se encontraron grupos.
              </p>
            )}

            {searchResults.groups?.length > 0 && (
              <div className="flex flex-col-reverse gap-7">
                {searchResults.groups.map((group) => (
                  <Group
                    id={group._id}
                    name={group.name}
                    image={group.image}
                    members={group.members}
                    isOwner={group.admins.includes(userId)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {submitLoading && <Loader />}
        {!showResults && (
          <>
            {groupsLoading ? (
              <Loader />
            ) : (
              <div className="flex flex-wrap justify-around gap-2 mt-5">
                {groups.length === 0 && (
                  <p className="text-black font-semibold text-3xl text-center my-10">
                    Aún no hay grupos creados
                  </p>
                )}
                {groups.map((group) => (
                  <Group
                    id={group._id}
                    name={group.name}
                    image={group.image}
                    members={group.members}
                    isOwner={group.admins.includes(userId)}
                  />
                ))}
              </div>
            )}
          </>
        )}
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
export default Groups;
