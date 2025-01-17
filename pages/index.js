import Head from "next/head";
import { useState, useEffect } from "react";
import styles from '../styles/Home.module.css';

export default function Home() {

  const [dateInput, setDateInput] = useState("");
  const [resultList, setResultList] = useState([]);
  const [selectedButton, setSelectedButton] = useState("");
  const [isLoading, setIsLoading] = useState();
  const [darkMode, setDarkMode] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const storedDateList = localStorage.getItem("date list");
    const storedDarkMode = localStorage.getItem("dark mode");
    storedDateList ? setResultList(JSON.parse(storedDateList)) : setResultList([]);
    setDarkMode(
      storedDarkMode === "true" || storedDarkMode === "false" ? 
      (storedDarkMode === "true" ? true : false) : 
      darkMode);
  }, []);
  
  const buttonList = [
  "Beach", 
  "Park", 
  "Lake", 
  "City", 
  "Farm", 
  "Festival", 
  "Concert", 
  "Museum", 
  "Vineyard",
  "Dog Park", 
  "Boat",
  "Private Jet",
  "Water Park",
  "Safari",
  "Horse Race",
  "Desert",
  "National Park",];

  function darkModeToggle() {
    const updatedDarkMode = !darkMode;
    setDarkMode(updatedDarkMode);
    localStorage.setItem("dark mode", updatedDarkMode);
  };

  function buttonClick(e) {
    e.preventDefault();
    setError(false);
    setDateInput(e.target.value);
    setSelectedButton(e.target.value);
  };

  function onChange(e) {
    setError(false);
    setDateInput(e.target.value);
    setSelectedButton("");
  };

  function clearList() {
    setResultList([]);
    localStorage.setItem("date list", []);
  };

  async function onSubmit(event) {
    event.preventDefault();
    if(!dateInput || !dateInput.trim()){
      setError(true);
    } else {
    setIsLoading(true);
    const response = await fetch("/api/promptGenerator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: dateInput }),
    });
    const data = await response.json();
    setIsLoading(false);
    let updatedResultList = [{prompt: dateInput, response: data.result}, ...resultList]
    setResultList(updatedResultList);
    localStorage.setItem("date list", JSON.stringify(updatedResultList));
    setDateInput("");
    setSelectedButton("");
    }
  };

  return (
    <div className={darkMode ? styles.darkMode : ""}>
      <Head>
        <title>AI Date Planner</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.lightModeSelector}>
        {
          darkMode === false ? 
          <span 
          className="material-symbols-rounded" 
          onClick={() => darkModeToggle()}>dark_mode</span> : 
          <span 
          className="material-symbols-rounded" 
          onClick={() => darkModeToggle()}>light_mode</span>
        }
        </div>

        <h3>Plan a Romantic Date ❤️</h3>
        <form onSubmit={onSubmit}>
          <div className={styles.buttonContainer}>
            {
              buttonList.map((button, idx) => {
                return <button 
                className={selectedButton === button ? styles.selectedButton : ""} 
                key={idx} 
                value={button}
                onClick={buttonClick}>{button}</button>
              })
            }
          </div>

          <input
            type="text"
            name="date"
            placeholder="Enter a location/environment or select one from above"
            value={dateInput}
            onChange={onChange}
          />

          <div className={styles.submit}>
          <input type="submit" value="Generate Date Ideas" />
          {
            isLoading || error ?
            (error ? <p>you must enter a valid input</p> : <p>...loading dates</p> ) : 
            null
          }
          </div>
        </form>

        <div className={styles.responseSection}>
          {
            resultList.length > 0 ? 
            <div className={styles.subtitleSection}>
              <h2 className={styles.subtitle}>Date Ideas</h2>
              <p onClick={clearList}>clear list</p>
            </div> : 
            null
          }
          {
            resultList.map((res, idx) => {
              return <div className={styles.responseContainer} key={idx}>
                <div className={styles.response}>
                  <p>Input:</p> 
                  <p className={styles.responseText}>Suggestions for a romantic date at a {res.prompt}</p>
                </div>

                <div className={styles.response}>
                  <p>Response:</p> 
                  <p className={styles.responseText}>{res.response}</p>
                </div>
              </div>
              })
            }
        </div>

      </main>
    </div>
  );
}
