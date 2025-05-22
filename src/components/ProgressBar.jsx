const ProgressBar = (props) => {
  const { actual, budget } = props;

  const bgColorList = ["yellow", "orange", "green", "red"];

  const completed = (actual * 100 / budget).toFixed(2);

  const bgColor = pct => {
    let index = 0;
    if (pct > 85 && pct < 97) index = 1;
    else if (pct >= 97 && pct <= 103) index = 2;
    else if (pct > 103) index = 3;
    return bgColorList[index];
  }

  const containerStyles = {
    height: 20,
    width: '100%',
    maxWidth: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 0
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    maxWidth: '100%',
    backgroundColor: bgColor(actual * 100 / budget),
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 5,
    color: 'black',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;