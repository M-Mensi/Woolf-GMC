import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [listOfUSer, setListOfUSer] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => setListOfUSer(response.data))
      .catch(() => setError("Could not load users. Please try again."));
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">API CHECKPOINT</p>
        <h1>People directory</h1>
        <p className="subtitle">
          A list of users, fetched from JSONPlaceholder.
        </p>
      </header>

      {error ? (
        <p className="message" role="alert">
          {error}
        </p>
      ) : listOfUSer.length === 0 ? (
        <p className="message" role="status">
          Loading users...
        </p>
      ) : (
        <ul className="user-list">
          {listOfUSer.map((user) => (
            <li className="user" key={user.id}>
              <div className="avatar" aria-hidden="true">
                {user.name.charAt(0)}
              </div>
              <div className="user-info">
                <h2>{user.name}</h2>
                <a href={`mailto:${user.email}`}>{user.email}</a>
                <p>
                  {user.company.name} · {user.address.city}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default UserList;
