import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserId } from "../utils/users/getUserId";
import Post from "../components/Post";
import Feedback from "../components/Feedback";
import { formatPostDate } from "../utils/helpers/formatPostDate";
import { getAuthenticatedUser } from "../utils/users/getAuthenticateUser.js";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import useUsers from "../utils/users/useUsers.js";
import usePosts from "../utils/posts/usePosts.js";
import useAuthentication from "../utils/helpers/useAuthentication.js";

function HomePage() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { users } = useUsers();
  const { posts, loading } = usePosts();

  useAuthentication();

  useEffect(() => {
    getUserId().then((result) => setUserId(result));
  }, []);

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

  if (!user || !posts) {
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

  return (
    <div>
      <Navbar />
      <section className="w-full lg:w-[75vw] xl:w-[60vw] min-h-screen bg-blue-400 pb-5 mx-auto">
        {!showResults && !showSearchBar && (
          <div className="flex justify-center">
            <button
              className={`${
                showAllPosts ? "border-white border-b-2" : "border-none"
              } px-4 py-2 text-white w-6/12 bg-blue-600 border-solid font-semibold text-lg`}
              onClick={() => setShowAllPosts(true)}
            >
              Reciente
            </button>
            <button
              className={`${
                showAllPosts ? "border-none" : "border-white border-b-2"
              } px-4 py-2 text-white w-6/12 bg-blue-600 border-solid font-semibold text-lg`}
              onClick={() => setShowAllPosts(false)}
            >
              Siguiendo
            </button>
          </div>
        )}
        {!showSearchBar && (
          <div className="bg-blue-600 pt-2">
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="bg-white text-blue-500 px-5 py-2 font-semibold text-center w-full border-2 border-solid border-blue-600"
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
                      className="bg-white text-blue-500 py-2 px-4 rounded-r-full w-[10%]"
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
              {(searchResults.posts?.length === 0 ||
                searchResults.posts.every((post) => post.author === userId)) &&
                (selectedCategory === "posts" ||
                  selectedCategory === "all") && (
                  <p className="text-white font-semibold text-3xl text-center my-10">
                    No se encontraron publicaciones.
                  </p>
                )}

              {searchResults.posts?.length > 0 &&
                (selectedCategory === "posts" ||
                  selectedCategory === "all") && (
                  <div className="flex flex-col gap-7 px-3">
                    {searchResults.posts
                      .filter((post) => post.author !== userId)
                      .map((post) => (
                        <Post
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
                        />
                      ))}
                    {searchResults.posts.some(
                      (post) => post.author !== userId
                    ) && (
                      <h2 className="text-white font-bold text-3xl text-start mb-2 mx-10">
                        Publicaciones
                      </h2>
                    )}
                  </div>
                )}

              {searchResults.users?.length > 0 &&
                (selectedCategory === "users" ||
                  selectedCategory === "all") && (
                  <div>
                    <h2 className="text-white font-bold text-3xl text-start mb-2 mx-10">
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
                  <p className="text-white font-semibold text-3xl text-center my-10">
                    No se encontraron usuarios.
                  </p>
                )}
            </>
          )}

          {!showResults && (
            <>
              {!loading ? (
                <>
                  {!showAllPosts && user.following.length === 0 && (
                    <p className="text-white font-semibold text-3xl text-center my-10">
                      No estás siguiendo a ningún usuario.
                    </p>
                  )}
                  {!showAllPosts &&
                    user.following.length > 0 &&
                    posts.filter((post) =>
                      user.following
                        .map((user) => user.userId)
                        .includes(post.author)
                    ).length === 0 && (
                      <p className="text-white font-semibold text-3xl text-center my-10">
                        No hay publicaciones recientes de los usuarios que
                        seguís.
                      </p>
                    )}

                  {showAllPosts &&
                    !posts.some((post) => post.author !== userId) && (
                      <p className="text-white font-semibold text-3xl text-center my-10">
                        No hay publicaciones recientes.
                      </p>
                    )}

                  <div className="flex flex-col gap-7 px-3">
                    {posts &&
                      posts.map((post) => {
                        if (showAllPosts) {
                          if (post.author !== userId) {
                            return (
                              <Post
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
                                user={user}
                                showCommentsForm={false}
                              />
                            );
                          }
                        } else {
                          if (
                            user.following &&
                            user.following.some(
                              (followedUser) =>
                                followedUser.userId === post.author
                            )
                          ) {
                            return (
                              <Post
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
                                user={user}
                                showCommentsForm={false}
                              />
                            );
                          }
                        }
                        return null;
                      })}
                  </div>
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

export default HomePage;
