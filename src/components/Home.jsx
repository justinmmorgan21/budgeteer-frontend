import { useLoaderData } from "react-router-dom";
import { BarChart } from "./BarChart";
import { LineChart } from "./LineChart";
import { useState } from "react";
import axios from 'axios';

export function Home() {
  const loadedCategories = useLoaderData();
  const [ bigCategories, setBigCategories ] = useState(loadedCategories.filter(cat => cat.budget_amount >= 200 || cat.name === "Misc"));
  const [ smallCategories, setSmallCategories ] = useState(loadedCategories.filter(cat => cat.budget_amount < 200 && cat.name != "*ignore*" && cat.name != "Misc"));
  const [ duration, setDuration ] = useState("1");
  const [ numberOfMonths, setNumberOfMonths ] = useState(1);

  const getLastDayOfMonth = (month, year) => {
    const isLeapYear = year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)
    if (month===1||month===3||month===5||month===7||month===8||month===10||month===12)
      return 31;
    else if (month===4||month===6||month===9||month===11)
      return 30;
    else if (!isLeapYear && month===2)
      return 28;
    else
      return 29;
  }

  const getDateRange = (duration) => {
    const today = new Date();
    const endMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    let startMonth = endMonth;
    const endYear = today.getFullYear() - (endMonth === 12 ? 1 : 0);
    let startYear = endYear;
    switch (duration) {
      case "1":
        return { startDate: null, endDate: null };
      case "2":
        break;
      case "3":
        startMonth = endMonth - (endMonth === 2 ? -10 : 2);
        break;
      case "4":
        startMonth = endMonth - (endMonth === 5 ? -7 : 5);
        startYear = endYear - (endMonth <= 5 ? 1 : 0)
        break;
      case "5":
        startMonth = endMonth + (endMonth === 12 ? -11 : 1);
        startYear = endYear - (endMonth !== 12 ? 1 : 0)
        break;
    }
    const lastDay = getLastDayOfMonth(endMonth, endYear);
    return { startDate: startYear + '-' + (startMonth < 10 ? '0':'') + startMonth + '-01',
              endDate: endYear + '-' + (endMonth < 10 ? '0':'') + endMonth + '-' + lastDay};
  };

  const fetchAndSetCategories = (startDate = null, endDate = null) => {
    const params = {};
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    axios.get("http://localhost:5000/categories", { params }).then(response => {
      const big = response.data.filter(cat => cat.budget_amount >= 200 || cat.name === "Misc");
      const small = response.data.filter(cat => cat.budget_amount < 200 && cat.name != "*ignore*" && cat.name != "Misc");
      setBigCategories(big);
      setSmallCategories(small);
    });
  };

  const updateDuration = (selectedDuration) => {
    setDuration(selectedDuration);

    const monthMapping = {
      "1": 1,
      "2": 1,
      "3": 3,
      "4": 6,
      "5": 12,
    };
    setNumberOfMonths(monthMapping[selectedDuration]);

    const { startDate, endDate } = getDateRange(selectedDuration);
    fetchAndSetCategories(startDate, endDate);
  };
  
  return (
    <div style={{width:"80%", margin:"20px auto"}}>
      <div style={{display:"flex", width:"80%"}}>
        <h1>Dashboard</h1>
        <div style={{border:"solid black 0px", margin:"0 auto"}}>
          <div style={{padding:"0 auto"}}>
            <span>show Budget history for: </span>
            <select onChange={(event) => updateDuration(event.target.value)} value={duration}>
              <option value="1">current month</option>
              <option value="2">last month</option>
              <option value="3">last 3 months</option>
              <option value="4">last 6 months</option>
              <option value="5">last year</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"auto auto"}}>
        <BarChart data={smallCategories} title={"Small Budgets"} numberOfMonths={numberOfMonths}/>
        <BarChart data={bigCategories} title={"Big Budgets"} numberOfMonths={numberOfMonths}/>
      </div>
        {/* <LineChart /> */}
    </div>
  );
};