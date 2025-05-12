export function ListCustomizer({searchText, setSearchText, startDate, setStartDate, endDate, setEndDate, handleSearch}) {
  return (  
    <form onSubmit={handleSearch}>
        <input type="text" style={{ padding:"6px", width:"300px" }} id="searchValue" name="searchValue" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
        <span> from: </span>
        <input type="date" name="startDate" onChange={(e)=>setStartDate(e.target.value)} value={startDate} /> 
        <span> to </span> 
        <input type="date" name="endDate" onChange={(e)=>setEndDate(e.target.value)} value={endDate} />
        <input type="submit" style={{ padding:"6px 8px", margin:"0 6px"}} value="Search"/>
        <button onClick={(e)=>{handleSearch(e);}} style={{ padding:"6px 8px"}}>Cancel</button>
    </form>
  );
}