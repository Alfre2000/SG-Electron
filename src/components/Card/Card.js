import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card({ icon, link, title }) {
  return (
    <div className="bg-white w-96 h-36 tex-center flex flex-col justify-center items-center shadow-my-card border-t-[5px] rounded-lg border-t-card-blue font-poppins">
      <h2 className="font-semibold text-[22px] text-gray-blue">{title}</h2>
      <div className="flex flex-row items-center pt-3">
        <img src={icon} alt={title} width="55" className="mr-6" />
        <Link
          to={link}
          className="bg-btn-blue px-6 py-1.5 ml-6 text-lg font-semibold text-white rounded-lg relative btn-card"
        >
          Avvia <FontAwesomeIcon icon={faCircleArrowRight} className="pl-2" />
        </Link>
      </div>
    </div>
  );
}

export default Card;
