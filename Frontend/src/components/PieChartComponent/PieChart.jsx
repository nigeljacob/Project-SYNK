import React from "react";
import {Chart as ChartJS} from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const PieChart = (props) => {
    return (
        <div className="tw-h-[350px] ">
            <Doughnut data={props.data} />
        </div>
    );
};

export default PieChart;