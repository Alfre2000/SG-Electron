import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import { useQuery } from "react-query";
import { PaginationData } from "@interfaces/global";

type CardProps = {
  icon: string;
  link: string;
  title: string;
  alertEndpoint?: string;
};

function Card({ icon, link, title, alertEndpoint }: CardProps) {
  const alertsQuery = useQuery<PaginationData<unknown> | unknown[]>(alertEndpoint || "");
  let nAlerts = 0;
  if (alertsQuery.isSuccess && alertsQuery.data) {
    if ("results" in alertsQuery.data) {
      nAlerts = alertsQuery.data.results.length;
    } else {
      nAlerts = alertsQuery.data.length;
    }
  }
  return (
    <div className="bg-white w-96 h-36 tex-center flex flex-col justify-center items-center shadow-my-card border-t-[5px] rounded-lg border-t-card-blue font-poppins">
      <div className="relative">
        <h2 className="font-semibold text-[22px] text-gray-blue">{title}</h2>
        {nAlerts > 0 && (
          <div className="rounded-full absolute -right-6 -top-2 text-center bg-red-600 text-white size-5 flex items-center justify-center text-xs font-bold font-roboto">
            {nAlerts}
          </div>
        )}
      </div>
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
