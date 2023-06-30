import React, { useState, useEffect } from "react";
import Feedback from "./Feedback";
import { Link } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import Comment from "./Comment";
import { getUserId } from "../utils/getUserId";
import { formatPostDate } from "../utils/formatPostDate";
import Loader from "./Loader";
import Modal from "./Modal";
import Archivo from "./Archivo";
import { BASE_URL } from "../utils/config.js";
import { AuthContext } from "../contexts/AuthContext";

const Post = ({
  name,
  lastName,
  userName,
  img,
  ratings,
  text,
  file,
  likes,
  title,
  date,
  onDelete,
  postId,
  author,
  authorPremium,
  user,
  comments,
  premium,
  fetchComments,
  showCommentsForm,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState("");
  const [postLikes, setLikes] = useState(likes.length);
  const [postRatings, setRatings] = useState(ratings.length);
  const [postComments, setPostComments] = useState(comments);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    content: "",
  });
  const { token } = React.useContext(AuthContext);

  useEffect(() => {
    getUserId(token).then((result) => {
      setUserId(result);
      const hasLikedPost = likes.some((like) => like.userId === result);
      setLiked(hasLikedPost);
      const hasRatedPost = ratings.some((rating) => rating.userId === result);
      const userRating = ratings.find((rating) => rating.userId === result);
      setIsRated(hasRatedPost);
      setRating(userRating ? userRating.rating : null);
    });
  }, [likes, ratings, token]);

  useEffect(() => {
    const calculateAverageRating = () => {
      if (ratings.length === 0) {
        return "";
      }

      const totalRating = ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      const averageRating = totalRating / ratings.length;

      return averageRating.toFixed(1);
    };

    const newAverageRating = calculateAverageRating();
    setAverageRating(newAverageRating);
  }, [ratings]);

  useEffect(() => {
    if (fetchComments && typeof fetchComments === "function") {
      fetchComments();
    }
  }, [fetchComments]);

  useEffect(() => {
    setPostComments(comments);
  }, [comments]);

  const calculateAverageRating = (newRatings) => {
    if (newRatings.length === 0) {
      return "";
    }

    const totalRating = newRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    const averageRating = totalRating / newRatings.length;

    return averageRating.toFixed(1);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setShowConfirmation(false);
      onDelete(data);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleLike = async (postId, userId) => {
    if (liked) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes + 1);
      }
      setMessage(data.message);
      setStatus(data.status);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleUnlike = async (postId, userId) => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/unlike`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setLiked((prevLiked) => !prevLiked);
        setLikes((prevLikes) => prevLikes - 1);
      }
      setMessage(data.message);
      setStatus(data.status);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, [fieldName]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!values.content) {
      formErrors.title = "Ingresá un comentario";
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

    const dataToSend = {
      author: userId,
      content: values.content,
      post: postId,
      date: new Date(),
    };

    try {
      const response = await fetch(`${BASE_URL}/create-comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);

      setValues({
        content: "",
      });

      fetchComments();
    } catch (error) {
      return console.log(error);
    }
  };

  const handleCommentDelete = (response) => {
    setMessage(response.message);
    setStatus(response.status);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const handleRatingSubmit = async (e) => {
    if (isRated) {
      return;
    }

    e.preventDefault();

    const ratingData = {
      userId: userId,
      rating: rating,
    };

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/rate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      if (data.status === "success") {
        setIsRated((prevRated) => !prevRated);
        const userRatingIndex = ratings.findIndex(
          (rating) => rating.userId === userId
        );
        const updatedRatings = [...ratings];
        if (userRatingIndex !== -1) {
          updatedRatings[userRatingIndex] = { userId: userId, rating: rating };
        } else {
          updatedRatings.push({ userId: userId, rating: rating });
        }
        setRatings(updatedRatings.length);
        setRating(rating);
        const newAverageRating = calculateAverageRating(updatedRatings);
        setAverageRating(newAverageRating);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  const handleDeleteRating = async (e) => {
    if (!isRated) {
      return;
    }

    e.preventDefault();

    const ratingData = {
      userId: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/rate`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      });

      const data = await response.json();
      setMessage(data.message);
      setStatus(data.status);
      if (data.status === "success") {
        setIsRated((prevRated) => !prevRated);
        const updatedRatings = ratings.filter(
          (rating) => rating.userId !== userId
        );
        setRatings(updatedRatings.length);
        setRating(null);
        const newAverageRating = calculateAverageRating(updatedRatings);
        setAverageRating(newAverageRating);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  if (showModal) {
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "auto";
  }

  return (
    <article
      className={`w-10/12 mx-auto rounded-lg py-3 px-2 ${
        premium ? "bg-white shadow-2xl" : "bg-white shadow-lg"
      }`}
    >
      {user ? (
        <div>
          <div className="flex justify-between">
            <div className="flex p-3 items-center">
              <Link to={`/usuarios/${author}`}>
                <img
                  src={`${img}`}
                  alt={name}
                  className="rounded-full w-[4rem] shadow-md"
                />
              </Link>
              <div className="flex flex-col items-start">
                <h3 className="font-semibold my-auto mx-3">
                  {name} {lastName}{" "}
                  {authorPremium && (
                    <span>
                      <img
                        src={`/img/logo-letra.png`}
                        className="w-3 inline mx-1 "
                        alt="Usuario Premium"
                      />
                    </span>
                  )}
                </h3>
                <p className="text-md text-gray-400 mx-3">@{userName}</p>
              </div>
            </div>
            <div className="flex p-3 font-semibold text-lg items-center">
              <p className="mx-3 text-sm text-gray-500">{date}</p>
              {user._id === author && (
                <button
                  onClick={handleDeleteClick}
                  className="text-blue-600 bg-white border-2 border-solid border-blue-600 rounded-lg p-5 w-10 h-10 flex justify-center items-center ml-3 hover:scale-105 focus:scale-105 transition duration-200"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </div>
          <Link to={`/posts/${postId}`}>
            <h4 className="text-start font-bold my-2 text-2xl px-8 ">
              {title}
            </h4>
          </Link>
          <p className="text-start py-3 px-8 text-gray-700 overflow-hidden break-words">
            {text}
          </p>
          <div className="flex gap-1 justify-center items-center">
            {file ? (
              <>
                {user._id === author ? (
                  <Archivo
                    premium={premium}
                    averageRating={averageRating}
                    postRatings={postRatings}
                    text={title}
                    className={
                      "bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer"
                    }
                    onClick={() => setShowModal(true)}
                  />
                ) : (
                  <>
                    {premium && user.premium && (
                      <Archivo
                        premium={premium}
                        averageRating={averageRating}
                        postRatings={postRatings}
                        text={title}
                        className={
                          "bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer"
                        }
                        onClick={() => setShowModal(true)}
                      />
                    )}
                    {premium && !user.premium && (
                      <Archivo
                        premium={premium}
                        averageRating={averageRating}
                        postRatings={postRatings}
                        text={"Contenido Premium"}
                        className={"bg-gray-500"}
                      />
                    )}
                    {!premium && (
                      <Archivo
                        premium={premium}
                        averageRating={averageRating}
                        postRatings={postRatings}
                        text={title}
                        className={
                          "bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer"
                        }
                        onClick={() => setShowModal(true)}
                      />
                    )}
                  </>
                )}
              </>
            ) : null}
            {file && isRated && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleDeleteRating}
                  className="rounded-lg bg-white text-blue-600 border-2 border-solid border-blue-600 p-3 hover:bg-blue-200"
                >
                  <i className="fa-solid fa-trash"></i> {rating}{" "}
                  <i className="fa-solid fa-star fa-xl"></i>
                </button>
              </div>
            )}
          </div>
          {file && !isRated && premium && (user.premium || userId === author) && (
            <div className="flex justify-center gap-2 mt-4 text-blue-600">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} onClick={() => handleRating(value)}>
                  {value <= rating ? (
                    <i className="fa-solid fa-star fa-xl"></i>
                  ) : (
                    <i className="fa-regular fa-star fa-xl"></i>
                  )}
                </button>
              ))}
              {!isRated && (
                <button
                  onClick={handleRatingSubmit}
                  className="rounded-lg bg-gradient-to-t from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 hover:bg-blue-500"
                >
                  Valorar
                </button>
              )}
            </div>
          )}
          {file && !isRated && !premium && (
            <div className="flex justify-center gap-2 mt-4 text-blue-600">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} onClick={() => handleRating(value)}>
                  {value <= rating ? (
                    <i className="fa-solid fa-star fa-xl"></i>
                  ) : (
                    <i className="fa-regular fa-star fa-xl"></i>
                  )}
                </button>
              ))}
              {!isRated && (
                <button
                  onClick={handleRatingSubmit}
                  className="rounded-lg bg-gradient-to-t from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 hover:bg-blue-500"
                >
                  Valorar
                </button>
              )}
            </div>
          )}

          {showModal && (
            <Modal
              closeModal={() => setShowModal(false)}
              file={file}
              title={title}
              img={img}
              username={userName}
            />
          )}
          <div className="flex justify-center gap-5 mt-6">
            <button
              className={`rounded-lg shadow-md text-center p-3 font-semibold ${
                liked
                  ? "bg-white text-blue-600 border-2 border-solid border-blue-500"
                  : "bg-blue-600 text-white"
              }`}
              onClick={() =>
                liked
                  ? handleUnlike(postId, user._id)
                  : handleLike(postId, user._id)
              }
            >
              <i className="fa-solid fa-thumbs-up mx-3"></i>
              {liked ? "Ya no me gusta" : "Me gusta"} ({postLikes})
            </button>
            <Link
              to={`/posts/${postId}`}
              className="bg-blue-600 text-white rounded-lg shadow-md text-center p-3 font-semibold"
            >
              <i className="fa-solid fa-message mx-3"></i> Comentarios (
              {postComments && postComments.length})
            </Link>
          </div>
          {showConfirmation && (
            <div>
              <p className="my-3 text-center font-semibold">
                ¿Estás seguro/a de que querés eliminar esta publicación?
              </p>
              <div className="d-flex gap-5">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 px-4 py-2 text-white font-semibold rounded-lg mx-5 hover:bg-red-400"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-blue-600 px-4 py-2 text-white font-semibold rounded-lg mx-5 hover:bg-blue-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          {showCommentsForm && (
            <form
              className="bg-white rounded-lg  w-full lg:w-10/12 mx-auto py-1 px-2 mt-4"
              onSubmit={handleSubmit}
            >
              <div className="gap-2 my-1 flex items-center">
                <Input
                  type="text"
                  placeholder="Ingresá tu comentario"
                  value={values.content}
                  onChange={handleChange("content")}
                  name="content"
                  id="content"
                  aria-invalid={!!errors.content}
                  className="w-[80%]"
                />
                <Button
                  text={<i className="fa-solid fa-paper-plane fa-lg"></i>}
                  type="submit"
                />
              </div>
              {errors.title && (
                <p className="text-start text-red-700 rounded-lg p-3">
                  <i className="fa-solid fa-xmark fa-lg"></i> {errors.title}
                </p>
              )}
            </form>
          )}
          {showCommentsForm && !postComments && <Loader />}
          {showCommentsForm && postComments && (
            <div className="mt-4 lg:mx-5">
              <h3 className="text-start text-xl font-semibold">Comentarios:</h3>
              {showCommentsForm && postComments.length === 0 && (
                <p className="text-2xl my-7 text-gray-400 text-center">
                  Sé el primero en comentar esta publicación
                </p>
              )}
              {postComments &&
                postComments.map((comment) => (
                  <Comment
                    name={comment.author.name}
                    lastName={comment.author.lastName}
                    img={comment.author.profileImage}
                    text={comment.content}
                    date={formatPostDate(comment.date)}
                    key={comment._id}
                    onDelete={handleCommentDelete}
                    commentId={comment._id}
                    author={comment.author}
                    user={user}
                  />
                ))}
            </div>
          )}
        </div>
      ) : (
        <p className="font-bold text-3xl my-7 text-white">Cargando...</p>
      )}
      {message && (
        <Feedback
          message={message}
          status={status}
          setMessage={setMessage}
          setStatus={setStatus}
        />
      )}
    </article>
  );
};

export default Post;
