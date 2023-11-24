import React, { useState, useEffect } from "react";
import "./Graph.css";

const Graph = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dpg.gg/test/calendar.json");
        const jsonData = await response.json();

        if (jsonData && typeof jsonData === "object") {
          setData(jsonData);
        } else {
          throw new Error("Data is not in the expected format.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBlockColor = (contributions) => {
    if (contributions === 0) return "color-0";
    if (contributions >= 1 && contributions <= 9) return "color-1-9";
    if (contributions >= 10 && contributions <= 19) return "color-10-19";
    if (contributions >= 20 && contributions <= 29) return "color-20-29";
    return "color-30";
  };

  const getDayInfo = (index) => {
    const date = new Date();
    date.setDate(date.getDate() - (51 * 7 - index));

    date.setDate(date.getDate() + 2);

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const contributions = data[date.toISOString().split("T")[0]] || 0;

    return `Contributions: ${contributions} - ${dayOfWeek}, ${day} ${month} ${year}`;
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="ContributionGraph">
      <div className="DayOfWeekColumn">
        <div className="DayOfWeek">Пн</div>
        <div className="DayOfWeek"></div>
        <div className="DayOfWeek">Ср</div>
        <div className="DayOfWeek"></div>
        <div className="DayOfWeek">Пт</div>
      </div>
      <div>
        <div className="MonthRow">
          <div className="Month">Дек</div>
          <div className="Month">Янв</div>
          <div className="Month">Февр</div>
          <div className="Month">Март</div>
          <div className="Month">Апр</div>
          <div className="Month">Май</div>
          <div className="Month">Июнь</div>
          <div className="Month">Июль</div>
          <div className="Month">Авг</div>
          <div className="Month">Сен</div>
          <div className="Month">Окт</div>
          <div className="Month">Нояб</div>
        </div>
        <div className="GraphContainer">
          {Array.from({ length: 51 }, (_, colIndex) => (
            <div key={colIndex} className="DayColumn">
              {Array.from({ length: 7 }, (_, rowIndex) => {
                const index = colIndex * 7 + rowIndex;
                const date = new Date();
                date.setDate(date.getDate() - (51 * 7 - index));

                date.setDate(date.getDate() + 2);

                const dateString = date.toISOString().split("T")[0];
                const contributions = data[dateString] || 0;

                return (
                  <div
                    key={rowIndex}
                    className={`ContributionBlock ${getBlockColor(
                      contributions
                    )}`}
                    title={getDayInfo(index)}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="legend_container">
          <span>Less</span>
          <ul className="levels">
            {[0, 1, 2, 3, 4].map((level) => (
              <li
                key={level}
                className="level"
                data-level={level}
                style={{
                  backgroundColor: getBlockColor(level * 10),
                  boxShadow: `0 0 5px ${getBlockColor(level * 10)}`,
                }}
              />
            ))}
          </ul>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Graph;
