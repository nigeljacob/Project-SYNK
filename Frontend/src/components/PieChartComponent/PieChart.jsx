import React from "react";
import {Chart as ChartJS} from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const PieChart = () => {
    // Dummy data
    const data = {
        labels: ["Ms Word", "Chrome", "Git",],
        datasets: [
            {
                label: "Total Miniutes",
                data: [20, 70, 20],
                backgroundColor: [
                    "rgb(116,238,21)",
                    "rgb(77,238,234)",
                    "rgb(254,0,0)",
                ],
                borderColor: [
                    "rgb(116,238,21)",
                    "rgb(77,238,234)",
                    "rgb(254,0,0)",
                ],
                borderWidth: 1,
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