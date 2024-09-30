import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";
import {
  faBook,
  faBuilding,
  faLocationDot,
  faAddressBook,
  faFileCode
} from "@fortawesome/free-solid-svg-icons";

export const ProfileInfo = () => {
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch("https://api.github.com/users/qhoa256");
        let profile = await response.json();

        let response2 = await fetch(
          "https://api.github.com/users/qhoa256/repos"
        );
        let repos = await response2.json();

        setProfileData([profile, repos]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile">
      <h2>Thông tin cá nhân</h2>
      <div className="flex gap-x-4 items-start">
        <div className="w-1/4 profile-card">
          {profileData.length > 0 && (
            <>
              <div className="profile-card__header">
                <div className="profile-card__img">
                  {profileData.length > 0 && (
                    <img src={profileData[0].avatar_url} alt="avatar" />
                  )}
                </div>
              </div>
              <div className="profile-card__body">
                <h3 className="profile-card__name">
                  {profileData.length > 0 && profileData[0].name}
                </h3>
                <p className="profile-card__bio">{profileData[0].bio}</p>
                <p className="profile-card__sub-info gap-3">
                  <FontAwesomeIcon icon={faBuilding} />
                  <span>{profileData[0].company}</span>
                </p>
                <p className="profile-card__sub-info gap-3">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{profileData[0].location}</span>
                </p>
                <p className="profile-card__sub-info gap-3">
                  <FontAwesomeIcon icon={faAddressBook} />
                  <a href="#" target="_blank">Report</a>
                </p>
                <p className="profile-card__sub-info gap-3">
                  <FontAwesomeIcon icon={faFileCode} />
                  <a href="http://localhost:8081/apidocs/#" target="_blank">API Docs</a>
                </p>
                <button className="profile-card__btn">
                  <a href="https://github.com/qhoa256" target="_blank">
                    Visit my Github
                  </a>
                </button>
              </div>
            </>
          )}
        </div>
        <div className="w-3/4">
          <h3 className="profile-title">My Github repositories</h3>
          <div className="grid grid-cols-3 gap-4">
            {profileData[1] &&
              profileData[1].map((repo, index) => {
                const repoName = repo.name;
                return (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    className={`profile-repo__item ${repo.name ==
                      "Project-IoT" && "highlight"}`}
                    key={index}
                  >
                    <h4 className="flex items-center gap-x-2 text-blue-700">
                      <FontAwesomeIcon icon={faBook} />
                      {repo.name}
                    </h4>
                    <p>{repo.description}</p>
                    <span>{repo.language}</span>
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};