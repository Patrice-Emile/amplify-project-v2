import { React, useState, useEffect } from "react";
import { API, Amplify, Storage, Auth } from "aws-amplify";
import { Button, withAuthenticator, Heading } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import UploadFile from "./components/UploadFile";

Amplify.configure(awsconfig);

function App({ signOut, user }) {
  const [places, setPlaces] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const addPlaces = async (e) => {
    e.preventDefault();

    try {
      const newPlace = {
        email: user.attributes.email,
        name,
        comment,
        rating,
      };

      // Call the API to add a new place
      await API.post("api64dac92c", "/addPlaces", {
        body: newPlace,
      });

      console.log("Place added successfully");
      // Reset input fields
      setPlaces([]);
      setName("");
      setComment("");
      setRating(0);
      // fetchPlaces();
    } catch (error) {
      console.error("Error adding place:", error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await API.get("api64dac92c", "/getPlaces", {
        body: user.attributes.email,
      });
      setPlaces(response);
    } catch (error) {
      console.log("Error fetching places:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <>
      <div style={styles.header}>
        <Heading level={1}>Hello {user.attributes.email}</Heading>
        <Button onClick={signOut} style={styles.button}>
          Sign out
        </Button>
      </div>
      <div style={styles.container}>
        {places && (
          <>
            <h1>Places List</h1>
            <table>
              <tr>
                <td>Name</td>
                <td>Comment</td>
                <td>Rating</td>
              </tr>
              {places.map((place, index) => (
                <>
                  <tr>
                    <td>{place.name}</td>
                    <td>{place.comment}</td>
                    <td>{place.rating}</td>
                  </tr>
                </>
              ))}
            </table>
          </>
        )}
      </div>
      <div style={styles.container}>
        <h2>Add Place</h2>
        <form onSubmit={addPlaces}>
          <input
            type="text"
            style={styles.input}
            placeholder="Place Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            style={styles.input}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment content"
          />
          <input
            style={styles.input}
            type="number"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            placeholder="Rating"
          />
          <button style={styles.button} type="submit">
            Add Place
          </button>
        </form>
      </div>
      <div style={styles.container}>
        <UploadFile styles={styles} />
      </div>
    </>
  );
}
const styles = {
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },

  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
    width: "100%",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px",
  },
};

export default withAuthenticator(App);
