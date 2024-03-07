import React from "react";
import {Chart as ChartJS} from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import PieData from "./PieData/PieData.json"

const PieChart = () => {
    // Dummy data
    const data = {
        labels: PieData.map((data) => data.label),
        datasets: [
            {
                label: "Count",
                data:PieData.map((data) => data.value),
            },

        ],
    };
       
    

    return (
        <div className="tw-h-[350px] ">
            <Doughnut data={data} />
        </div>
    );
};

export default PieChart;