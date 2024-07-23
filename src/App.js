import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import "./index.css";

const App = () => {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortMethod, setSortMethod] = useState("title");
  const [bodyVisible, setBodyVisible] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts`
        );
        setAllData(response.data);
        setTotalPages(Math.ceil(response.data.length / 10));
        // simulate api response time/loading
        setTimeout(() => {
          setLoading(false);
        }, 2250);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchAllData();
  }, []);

  useEffect(() => {
    const sortedData = sortData([...allData], sortMethod);
    const paginatedData = paginateData(sortedData, page);
    setData(paginatedData);
  }, [allData, sortMethod, page]);

  const sortData = (data, method) => {
    switch (method) {
      case "title":
        return data.sort((a, b) => a.title.localeCompare(b.title));
      case "id":
        return data.sort((a, b) => a.id - b.id);
      default:
        return data;
    }
  };

  const paginateData = (data, page) => {
    const startIndex = (page - 1) * 10;
    return data.slice(startIndex, startIndex + 10);
  };

  const toggleBodyVisibility = (index) => {
    setBodyVisible((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const rowRenderer = ({ key, index, style }) => (
    <div
      key={key}
      style={style}
      className="row"
      onClick={() => toggleBodyVisibility(index)}
    >
      {data[index].id} - {data[index].title}
      <div
        className="body-text"
        style={{ display: bodyVisible[index] ? "block" : "none" }}
      >
        {data[index].body}
      </div>
    </div>
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && page < totalPages) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 1) {
      setPage(page - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: "100vh", paddingBottom: "10px" }}>
      <div style={{ marginBottom: "10px" }}>
        <label>Sort By: </label>
        <select
          value={sortMethod}
          onChange={(e) => {
            setSortMethod(e.target.value);
            setPage(1);
          }}
        >
          <option value="title">Title</option>
          <option value="id">ID</option>
        </select>
      </div>

      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={data.length}
            rowHeight={150}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
      <div className="pagination">
        <button onClick={() => handlePageChange("prev")} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}{" "}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
